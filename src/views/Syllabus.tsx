import { useMemo, useState } from 'react'
import { CHAPTERS, CLOSE, CONTENT_DONE, DAILY_CAPACITY, NEW_CHAPTERS, PLANNED_CLOSE, SUBJECT_NAME, type ChapterDef, type Subject } from '../data/plan'
import { useEgo, type ChapterState } from '../store'
import { accOf, pctOf } from '../lib/derive'
import { diffDays, fmtHours, fmtShort, studyDate } from '../lib/dates'
import { Stepper, Words, accTone } from '../components/ui'

export default function Syllabus() {
  const chapters = useEgo((s) => s.chapters)
  const pyq = useEgo((s) => s.pyq)
  const acc = useMemo(() => accOf(pyq), [pyq])
  const [open, setOpen] = useState<string | null>(null)
  const today = studyDate()

  const closed = NEW_CHAPTERS.filter((c) => chapters[c.id]?.closedOn).length
  const daysLeft = Math.max(0, diffDays(CLOSE, today))
  const openNew = NEW_CHAPTERS.filter((c) => !chapters[c.id]?.closedOn)
  const need = openNew.reduce((a, c) => a + Math.max(0, (chapters[c.id]?.hours ?? 0) - (chapters[c.id]?.watched ?? 0)) * 1.5 + 1, 0)
  const have = Math.max(0, diffDays(CONTENT_DONE, today) + 1) * DAILY_CAPACITY
  const spare = Math.round(have - need)
  const passing = NEW_CHAPTERS.filter((c) => {
    const a = acc[c.id]
    return a && a.att >= 20 && a.cor / a.att >= 0.6
  }).length

  const title = closed === NEW_CHAPTERS.length ? `all ${NEW_CHAPTERS.length} closed.` : `${NEW_CHAPTERS.length - closed} chapters. ${daysLeft} days.`

  return (
    <div className="pt-10 md:pt-14">
      <header className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <h1 className="font-serif text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.06] tracking-[-0.025em] lg:col-span-7">
          <Words text={title} />
        </h1>
        <dl className="grid grid-cols-3 gap-6 self-end lg:col-span-5">
          <div className="border-t border-line pt-3">
            <dt className="text-[12px] text-mute">closed</dt>
            <dd className="mt-1 text-[26px]">
              <span className="num">{closed}</span>
              <span className="text-[14px] text-dim"> / {NEW_CHAPTERS.length}</span>
            </dd>
          </div>
          <div className="border-t border-line pt-3">
            <dt className="text-[12px] text-mute">60%+ on 20 pyqs</dt>
            <dd className="mt-1 text-[26px]">
              <span className="num">{passing}</span>
              <span className="text-[14px] text-dim"> / {NEW_CHAPTERS.length}</span>
            </dd>
          </div>
          <div className={`border-t pt-3 ${spare < 0 ? 'border-rose' : 'border-line'}`}>
            <dt className="text-[12px] text-mute">hour budget</dt>
            <dd className={`mt-1 text-[26px] num ${spare < 0 ? 'text-rose' : 'text-smoke'}`}>
              {spare >= 0 ? '+' : ''}
              {spare}h
            </dd>
          </div>
        </dl>
      </header>
      <p className={`mt-6 max-w-[70ch] text-[14px] ${spare < 0 ? 'text-rose' : 'text-mute'}`}>
        {spare >= 0
          ? `need ${Math.round(need)}h for what is left (lecture time x 1.5, plus an hour of notes per chapter). you have ${have}h before oct 22.`
          : `over by ${-spare}h. cut biomolecules, em waves and statistics to ncert + pyqs first, then drop lakshya.`}{' '}
        replace the lecture estimates with real durations to make this exact.
      </p>

      <section className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-3">
        {(['phys', 'chem', 'math'] as Subject[]).map((s) => (
          <div key={s}>
            <h2 className="flex items-baseline justify-between font-serif text-[24px]">
              {SUBJECT_NAME[s]}
              <span className="font-sans num text-[13px] text-mute">
                {NEW_CHAPTERS.filter((c) => c.subject === s && chapters[c.id]?.closedOn).length} / {NEW_CHAPTERS.filter((c) => c.subject === s).length}
              </span>
            </h2>
            <ul className="mt-4">
              {NEW_CHAPTERS.filter((c) => c.subject === s).map((c) => (
                <ChapterRow key={c.id} def={c} st={chapters[c.id]} acc={acc[c.id]} open={open === c.id} onToggle={() => setOpen(open === c.id ? null : c.id)} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <SideList title="weak 11th chapters" note="drilled every evening on rotation" items={CHAPTERS.filter((c) => c.group === 'weak')} />
        <SideList title="short notes to build in november" note="pyqs first, then the note from what you missed" items={CHAPTERS.filter((c) => c.group === 'backlog')} />
      </section>
    </div>
  )
}

function ChapterRow({ def, st, acc, open, onToggle }: { def: ChapterDef; st: ChapterState; acc?: { att: number; cor: number }; open: boolean; onToggle: () => void }) {
  const update = useEgo((s) => s.updateChapter)
  const pct = st.hours > 0 ? Math.min(1, st.watched / st.hours) : 0
  const p = pctOf(acc)
  const status = st.closedOn
    ? `closed ${fmtShort(st.closedOn)}`
    : acc?.att || (st.hours > 0 && st.watched >= st.hours)
      ? 'pyq phase'
      : st.watched > 0
        ? `lecture, ${Math.round(pct * 100)}% watched`
        : `planned to close ${PLANNED_CLOSE[def.id] ? fmtShort(PLANNED_CLOSE[def.id]) : 'soon'}`
  const overCap = st.notes > def.cap
  return (
    <li className="group">
      <button type="button" onClick={onToggle} aria-expanded={open} className="grid w-full grid-cols-[1fr_auto] items-start gap-x-4 pt-4 text-left">
        <span>
          <span className={`block text-[15px] transition-colors ${st.closedOn ? 'text-mute' : 'text-smoke group-hover:text-ego-soft'}`}>{def.name}</span>
          <span className="mt-1 block text-[12px] text-dim">{status}</span>
        </span>
        <span className="text-right">
          <span className={`block num text-[15px] ${accTone(p)}`}>{p == null ? 'no pyqs' : `${p}%`}</span>
          {acc?.att ? <span className="block num text-[12px] text-dim">{acc.att} pyqs</span> : null}
        </span>
        <span className="col-span-2 mt-4 block h-[2px] bg-line" aria-hidden>
          <span className="block h-full origin-left bg-ego transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `scaleX(${st.closedOn ? 1 : pct})` }} />
        </span>
      </button>
      {open ? (
        <div className="expand grid grid-cols-2 gap-4 pb-6 pt-5">
          <Stepper label={`watched, of ${fmtHours(st.hours)}h`} value={st.watched} step={0.5} max={st.hours} suffix="h" onChange={(v) => update(def.id, { watched: v })} />
          <Stepper label="real lecture length" value={st.hours} step={0.5} suffix="h" onChange={(v) => update(def.id, { hours: v, watched: Math.min(st.watched, v) })} />
          <Stepper label={`note pages, cap ${def.cap}`} value={st.notes} onChange={(v) => update(def.id, { notes: v })} />
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => update(def.id, { closedOn: st.closedOn ? undefined : studyDate() })}
              className={`btn border px-3 py-2.5 text-[14px] ${st.closedOn ? 'border-line text-mute' : 'border-ego text-ego-soft'}`}
            >
              {st.closedOn ? 'reopen chapter' : 'close chapter'}
            </button>
          </div>
          {overCap ? <p className="col-span-2 text-[12px] text-rose">{st.notes - def.cap} over the page cap. you will not revise pages you cannot skim in 15 minutes.</p> : null}
          {p != null && p < 60 && !st.closedOn ? <p className="col-span-2 text-[12px] text-rose">under 60%. this one is not ready to close.</p> : null}
        </div>
      ) : null}
    </li>
  )
}

function SideList({ title, note, items }: { title: string; note: string; items: ChapterDef[] }) {
  const pyq = useEgo((s) => s.pyq)
  const chapters = useEgo((s) => s.chapters)
  const update = useEgo((s) => s.updateChapter)
  const acc = useMemo(() => accOf(pyq), [pyq])
  const last = (id: string) => pyq.filter((p) => p.ch === id).map((p) => p.date).sort().pop()
  return (
    <div>
      <h2 className="font-serif text-[24px]">{title}</h2>
      <p className="mt-1 text-[13px] text-mute">{note}</p>
      <div className="mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {items.map((c) => {
          const p = pctOf(acc[c.id])
          const l = last(c.id)
          return (
            <div key={c.id} className="flex items-start justify-between gap-3 border-t border-line py-3.5">
              <div>
                <p className="text-[15px]">{c.name}</p>
                <p className="mt-0.5 text-[12px] text-dim">
                  {l ? `last practised ${fmtShort(l)}` : 'not practised yet'}
                  {chapters[c.id]?.notes ? `, ${chapters[c.id].notes}p of notes` : ''}
                </p>
              </div>
              <div className="text-right">
                <p className={`num text-[15px] ${accTone(p)}`}>{p == null ? 'n/a' : `${p}%`}</p>
                <button
                  type="button"
                  onClick={() => update(c.id, { notes: (chapters[c.id]?.notes ?? 0) + 1 })}
                  className="press mt-0.5 text-[12px] text-dim hover:text-ego-soft"
                  aria-label={`add a note page for ${c.name}`}
                >
                  + page
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

