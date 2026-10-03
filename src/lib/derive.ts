import { getDayTasks, KEEP, START, type Acc, type CustomTask, type DayTask, type PlanCtx } from '../data/plan'
import type { ChapterState, PyqEntry } from '../store'
import { addDays } from './dates'

export interface Slice {
  custom: Record<string, CustomTask[]>
  chapters: Record<string, ChapterState>
  pyq: PyqEntry[]
}

export function accOf(pyq: PyqEntry[], pred?: (e: PyqEntry) => boolean): Acc {
  const out: Acc = {}
  for (const e of pyq) {
    if (pred && !pred(e)) continue
    const a = (out[e.ch] ??= { att: 0, cor: 0 })
    a.att += e.att
    a.cor += e.cor
  }
  return out
}

export const pctOf = (a?: { att: number; cor: number }) => (a && a.att > 0 ? Math.round((a.cor / a.att) * 100) : null)

export function ctxOf(s: Slice): PlanCtx {
  return {
    acc: accOf(s.pyq),
    closedOn: Object.fromEntries(Object.entries(s.chapters).map(([k, v]) => [k, v.closedOn])),
    custom: s.custom,
  }
}

export const tasksOf = (date: string, s: Slice): DayTask[] => getDayTasks(date, ctxOf(s))

export function statsOf(tasks: DayTask[], done: Record<string, true>) {
  const total = tasks.length
  const finished = tasks.filter((t) => done[t.id])
  return {
    total,
    completed: finished.length,
    pct: total ? Math.round((finished.length / total) * 100) : 0,
    hours: finished.reduce((a, t) => a + t.hours, 0),
    planned: tasks.reduce((a, t) => a + t.hours, 0),
  }
}

export interface DayHist {
  date: string
  pct: number
  hours: number
  planned: number
  total: number
  future: boolean
}

export function historyOf(s: Slice & { done: Record<string, true> }, to: string, today: string): DayHist[] {
  const ctx = ctxOf(s)
  const out: DayHist[] = []
  for (let d = START; d <= to; d = addDays(d, 1)) {
    const st = statsOf(getDayTasks(d, ctx), s.done)
    out.push({ date: d, pct: st.pct, hours: st.hours, planned: st.planned, total: st.total, future: d > today })
  }
  return out
}

/** a day is kept at 70%+. today only extends the streak once it is kept, it never breaks it. */
export function streakOf(hist: DayHist[], today: string) {
  let best = 0
  let run = 0
  for (const h of hist) {
    if (h.date > today) break
    if (h.pct >= KEEP) {
      run++
      best = Math.max(best, run)
    } else if (h.date < today) run = 0
  }
  let current = 0
  const past = hist.filter((h) => h.date <= today)
  for (let i = past.length - 1; i >= 0; i--) {
    const h = past[i]
    if (h.pct >= KEEP) current++
    else if (h.date === today) continue
    else break
  }
  return { current, best, kept: past.filter((h) => h.pct >= KEEP).length }
}
