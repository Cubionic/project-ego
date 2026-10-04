import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { CHAPTERS, type BlockKey, type CustomTask, type DayTask, type Kind } from './data/plan'
import { addDays } from './lib/dates'

export interface ChapterState {
  hours: number
  watched: number
  notes: number
  closedOn?: string
}
export interface PyqEntry {
  id: string
  date: string
  ch: string
  att: number
  cor: number
}
export type TestKind = 'allen' | 'shift' | 'chapter'
export interface TestEntry {
  id: string
  date: string
  name: string
  kind: TestKind
  p: number
  c: number
  m: number
  max: number
  lostSyllabus: number
  lostFormula: number
  lostSilly: number
  analysed: boolean
}

export interface Data {
  done: Record<string, true>
  moved: Record<string, true>
  custom: Record<string, CustomTask[]>
  chapters: Record<string, ChapterState>
  pyq: PyqEntry[]
  tests: TestEntry[]
  art: string[]
  duotone: boolean
}

interface Actions {
  toggle: (task: DayTask, date: string) => void
  addCustom: (date: string, block: BlockKey, text: string, hours: number, extra?: { kind?: Kind; ch?: string }) => void
  removeCustom: (date: string, id: string) => void
  carryOver: (date: string, tasks: DayTask[]) => number
  updateChapter: (id: string, patch: Partial<ChapterState>) => void
  logPyq: (e: Omit<PyqEntry, 'id'>) => void
  removePyq: (id: string) => void
  addTest: (t: Omit<TestEntry, 'id'>) => void
  removeTest: (id: string) => void
  toggleAnalysed: (id: string) => void
  setArt: (ids: string[]) => void
  setDuotone: (v: boolean) => void
  importAll: (raw: unknown) => boolean
  resetAll: () => void
}

export type EgoState = Data & Actions

const uid = () => Math.random().toString(36).slice(2, 10)

export const initialChapters = (): Record<string, ChapterState> =>
  Object.fromEntries(CHAPTERS.map((c) => [c.id, { hours: c.hours, watched: c.watched, notes: 0 }]))

const initial = (): Data => ({
  done: {},
  moved: {},
  custom: {},
  chapters: initialChapters(),
  pyq: [],
  tests: [],
  art: [],
  duotone: true,
})

// localStorage can throw (private windows, sandboxed previews). fall back to memory.
const memory = new Map<string, string>()
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return memory.get(k) ?? null
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, v)
    } catch {
      memory.set(k, v)
    }
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k)
    } catch {
      memory.delete(k)
    }
  },
}

// v1 shipped lecture-hour estimates. v2 and v3 swap in the real video lengths, but only where the
// saved number is still the old estimate, so a length you already corrected stays yours.
const OLD_ESTIMATES: Record<string, { hours: number; watched: number }> = {
  waves: { hours: 8, watched: 7.2 },
  wo: { hours: 6, watched: 0 },
  ac: { hours: 7, watched: 2.8 },
  semis: { hours: 5, watched: 0 },
  emw: { hours: 2, watched: 0 },
  mp1: { hours: 6, watched: 0 },
  mp2: { hours: 5, watched: 0 },
  electro: { hours: 7, watched: 0 },
  ionic: { hours: 7, watched: 0 },
  dnf: { hours: 5, watched: 0 },
  amines: { hours: 4, watched: 0 },
  bio: { hours: 2.5, watched: 0 },
  mat: { hours: 4, watched: 0 },
  det: { hours: 4, watched: 0 },
  prob: { hours: 6, watched: 0 },
  stats: { hours: 2.5, watched: 0 },
}
export function withRealHours(chapters: Record<string, ChapterState>): Record<string, ChapterState> {
  const out = { ...chapters }
  for (const c of CHAPTERS) {
    const old = OLD_ESTIMATES[c.id]
    const st = out[c.id]
    if (!old || !st || st.hours !== old.hours) continue
    const watched = st.watched === old.watched ? c.watched : Math.min(st.watched, c.hours)
    out[c.id] = { ...st, hours: c.hours, watched }
  }
  return out
}

const DATA_KEYS: (keyof Data)[] = ['done', 'moved', 'custom', 'chapters', 'pyq', 'tests', 'art', 'duotone']
const pickData = (s: Data): Data => Object.fromEntries(DATA_KEYS.map((k) => [k, s[k]])) as unknown as Data

export const useEgo = create<EgoState>()(
  persist(
    (set, get) => ({
      ...initial(),

      toggle: (task, date) =>
        set((s) => {
          const done = { ...s.done }
          let chapters = s.chapters
          const ch = task.closes
          if (done[task.id]) {
            delete done[task.id]
            if (ch && chapters[ch]?.closedOn === date) chapters = { ...chapters, [ch]: { ...chapters[ch], closedOn: undefined } }
          } else {
            done[task.id] = true
            if (ch && chapters[ch] && !chapters[ch].closedOn) chapters = { ...chapters, [ch]: { ...chapters[ch], closedOn: date } }
          }
          return { done, chapters }
        }),

      addCustom: (date, block, text, hours, extra) =>
        set((s) => ({
          custom: {
            ...s.custom,
            [date]: [...(s.custom[date] ?? []), { id: `${date}:c-${uid()}`, block, text, hours, ...extra }],
          },
        })),

      removeCustom: (date, id) =>
        set((s) => {
          const done = { ...s.done }
          delete done[id]
          return { done, custom: { ...s.custom, [date]: (s.custom[date] ?? []).filter((t) => t.id !== id) } }
        }),

      carryOver: (date, tasks) => {
        const s = get()
        const next = addDays(date, 1)
        const open = tasks.filter((t) => !s.done[t.id] && !s.moved[t.id] && t.hours > 0)
        if (!open.length) return 0
        set({
          moved: { ...s.moved, ...Object.fromEntries(open.map((t) => [t.id, true as const])) },
          custom: {
            ...s.custom,
            [next]: [
              ...(s.custom[next] ?? []),
              ...open.map((t) => ({
                id: `${next}:c-${uid()}`,
                block: t.block,
                text: t.text,
                hours: t.hours,
                carried: true,
                kind: t.kind,
                ch: t.ch,
                closes: t.closes,
              })),
            ],
          },
        })
        return open.length
      },

      updateChapter: (id, patch) =>
        set((s) => ({ chapters: { ...s.chapters, [id]: { ...s.chapters[id], ...patch } } })),

      logPyq: (e) => set((s) => ({ pyq: [...s.pyq, { ...e, id: uid() }] })),
      removePyq: (id) => set((s) => ({ pyq: s.pyq.filter((p) => p.id !== id) })),

      addTest: (t) => set((s) => ({ tests: [...s.tests, { ...t, id: uid() }].sort((a, b) => a.date.localeCompare(b.date)) })),
      removeTest: (id) => set((s) => ({ tests: s.tests.filter((t) => t.id !== id) })),
      toggleAnalysed: (id) => set((s) => ({ tests: s.tests.map((t) => (t.id === id ? { ...t, analysed: !t.analysed } : t)) })),

      setArt: (art) => set({ art }),
      setDuotone: (duotone) => set({ duotone }),

      importAll: (raw) => {
        if (!raw || typeof raw !== 'object') return false
        const r = raw as Partial<Data>
        if (!r.chapters || !Array.isArray(r.pyq) || !Array.isArray(r.tests) || !r.done) return false
        const base = initial()
        set({
          ...base,
          ...pickData({ ...base, ...r } as Data),
          chapters: withRealHours({ ...base.chapters, ...r.chapters }),
          art: get().art,
        })
        return true
      },

      resetAll: () => set({ ...initial(), art: get().art, duotone: get().duotone }),
    }),
    {
      name: 'project-ego',
      version: 3,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => pickData(s),
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as Partial<Data>
        if (version < 3 && p.chapters) p.chapters = withRealHours(p.chapters)
        return p as unknown as EgoState
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Data>
        return { ...current, ...p, chapters: { ...initialChapters(), ...(p.chapters ?? {}) } }
      },
    },
  ),
)

export const exportData = (): Data => pickData(useEgo.getState())
