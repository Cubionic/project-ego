import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, CornerDownRight, Plus, X } from 'lucide-react'
import {
  BLOCKS,
  BREAKS,
  CLOSE,
  DAY_END,
  DAY_START,
  EXAM,
  KEEP,
  START,
  SUBJECT_NAME,
  blockName,
  chapterById,
  type BlockDef,
  type BlockKey,
  type DayTask,
  type Subject,
} from '../data/plan'
import { useEgo } from '../store'
import { accOf, pctOf, statsOf, tasksOf } from '../lib/derive'
import { addDays, diffDays, fmtClock, fmtDay, fmtHours, minutesIntoStudyDay, studyDate, weekday } from '../lib/dates'
import { isTyping, useNow } from '../lib/hooks'
import { ArtFrame } from '../components/ArtFrame'
import { taskLink } from '../data/videos'
import { ChapterSelect, CountUp, Stepper, Words, accTone } from '../components/ui'

function headline(pct: number, rel: 'past' | 'today' | 'future', date: string) {
  if (rel === 'future') return date === CLOSE ? 'the day the syllabus closes.' : 'tomorrow is already decided.'
  if (rel === 'past') return pct >= KEEP ? 'that day was yours.' : 'that one got away. not the next.'
  if (pct === 0) return 'nobody will score marks for you.'
  if (pct < 40) return 'you wont be a true egoist if you stay like this.'
  if (pct < KEEP) return 'half a day is still a loss.'
  if (pct < 100) return 'finish it. the last block counts too.'
  return 'today belongs to you.'
}

export default function Today() {
  const now = useNow()
  const today = studyDate(now)
  const [date, setDate] = useState(today)
  const [follow, setFollow] = useState(true)
  useEffect(() => {
    if (follow) setDate(today)
  }, [today, follow])
  const go = (d: string) => {
    const c = d < START ? START : d > EXAM ? EXAM : d
    setDate(c)
    setFollow(c === today)
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (isTyping(e) || e.metaKey || e.ctrlKey) return
      if (e.key === '[') go(addDays(date, -1))
      if (e.key === ']') go(addDays(date, 1))
      if (e.key === 't') go(today)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const done = useEgo((s) => s.done)
  const moved = useEgo((s) => s.moved)
  const custom = useEgo((s) => s.custom)
  const chapters = useEgo((s) => s.chapters)
  const pyq = useEgo((s) => s.pyq)
  const toggle = useEgo((s) => s.toggle)
  const carryOver = useEgo((s) => s.carryOver)

  const tasks = useMemo(() => tasksOf(date, { custom, chapters, pyq }), [date, custom, chapters, pyq])
  const st = statsOf(tasks, done)
  const rel: 'past' | 'today' | 'future' = date === today ? 'today' : date < today ? 'past' : 'future'
  const nowMin = rel === 'today' ? minutesIntoStudyDay(now) : null
  const current = nowMin == null ? null : (BLOCKS.find((b) => nowMin >= b.start && nowMin < b.end)?.key ?? null)
  const next = nowMin == null ? null : (BLOCKS.find((b) => nowMin < b.start)?.key ?? null)

  const groups = BLOCKS.map((b) => {
    const t = tasks.filter((x) => x.block === b.key)
    const s = statsOf(t, done)
    return { b, tasks: t, pct: s.pct, name: blockName(b, t), done: s.completed }
  })

  const dayN = diffDays(date, START) + 1
  const toClose = diffDays(CLOSE, today)
  const toExam = diffDays(EXAM, today)
  const big = toClose >= 0 ? { n: toClose, label: toClose === 1 ? 'day to close the syllabus' : 'days to close the syllabus' } : { n: toExam, label: 'days to jee main' }

  const dayPyq = pyq.filter((p) => p.date === date)
  const bySubject = (s: Subject) => {
    const a = dayPyq.filter((p) => chapterById[p.ch]?.subject === s).reduce((acc, p) => ({ att: acc.att + p.att, cor: acc.cor + p.cor }), { att: 0, cor: 0 })
    return a
  }
  const totalPyq = dayPyq.reduce((a, p) => ({ att: a.att + p.att, cor: a.cor + p.cor }), { att: 0, cor: 0 })

  const focusBlock = current ?? next ?? 'b1'
  const defaultCh = tasks.find((t) => t.block === focusBlock && t.ch)?.ch ?? tasks.find((t) => t.ch)?.ch ?? 'ac'
  const openTasks = tasks.filter((t) => !done[t.id] && !moved[t.id] && t.hours > 0)
  const [movedMsg, setMovedMsg] = useState('')

  const blockRefs = useRef<Partial<Record<BlockKey, HTMLElement | null>>>({})
  const jump = (k: BlockKey) => blockRefs.current[k]?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="relative">
      {/* ---------- hero ---------- */}
      <section className="grid grid-cols-1 gap-y-12 gap-x-12 pt-6 md:pt-14 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
            <div className="flex items-center border border-line">
              <button type="button" aria-label="previous day" onClick={() => go(addDays(date, -1))} className="press grid h-8 w-8 place-items-center text-mute hover:text-smoke disabled:opacity-30" disabled={date <= START}>
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-[10.5rem] px-1 text-center text-smoke">{fmtDay(date)}</span>
              <button type="button" aria-label="next day" onClick={() => go(addDays(date, 1))} className="press grid h-8 w-8 place-items-center text-mute hover:text-smoke disabled:opacity-30" disabled={date >= EXAM}>
                <ChevronRight size={16} />
              </button>
            </div>
            <span className="text-mute">
              day <span className="num text-smoke">{dayN}</span>
              {date <= CLOSE ? (
                <>
                  {' '}
                  of <span className="num">23</span>
                </>
              ) : null}
            </span>
            <span className="text-mute lg:hidden">
              <span className="num text-smoke">{big.n}</span> {big.label.replace(' the syllabus', '')}
            </span>
            {rel !== 'today' ? (
              <button type="button" onClick={() => go(today)} className="min-h-8 text-ego-soft underline-offset-4 hover:underline">
                back to today
              </button>
            ) : null}
          </div>

          <h1 key={headline(st.pct, rel, date)} className="mt-5 max-w-[15ch] font-serif text-[clamp(1.9rem,6.2vw,5.4rem)] leading-[1.06] tracking-[-0.025em] md:mt-8">
            <Words text={headline(st.pct, rel, date)} />
          </h1>

          <div className="mt-auto pt-6 md:pt-12">
            <div className="flex flex-wrap items-end gap-x-12 gap-y-5 md:gap-y-8">
              <div>
                <div className="flex items-start font-serif leading-[0.85]">
                  <span className="text-[clamp(4rem,13vw,10rem)] tracking-[-0.04em]">
                    <CountUp value={st.pct} />
                  </span>
                  <span className="mt-3 text-[2rem] text-mute">%</span>
                </div>
                <p className="mt-3 text-[13px] text-mute">
                  of {weekday(date)}'s targets. {KEEP}% keeps the streak.
                </p>
                <div className="mt-4 h-px w-full max-w-sm bg-line">
                  <div className="h-px bg-ego transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" style={{ transform: `scaleX(${st.pct / 100})` }} />
                </div>
              </div>
              <dl className="grid w-full grid-cols-4 gap-x-4 gap-y-5 text-[12px] sm:w-auto sm:grid-cols-2 sm:gap-x-10 sm:text-[13px]">
                <div>
                  <dt className="text-mute">hours earned</dt>
                  <dd className="mt-1 text-[18px] text-smoke sm:text-[22px]">
                    <span className="num">{fmtHours(st.hours)}</span>
                    <span className="text-[14px] text-dim"> / {fmtHours(st.planned)}h</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-mute">targets</dt>
                  <dd className="mt-1 text-[18px] text-smoke sm:text-[22px]">
                    <span className="num">{st.completed}</span>
                    <span className="text-[14px] text-dim"> / {st.total}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-mute">pyqs logged</dt>
                  <dd className="mt-1 text-[18px] num text-smoke sm:text-[22px]">{totalPyq.att}</dd>
                </div>
                <div>
                  <dt className="text-mute">accuracy</dt>
                  <dd className={`mt-1 text-[18px] num sm:text-[22px] ${accTone(pctOf(totalPyq))}`}>{pctOf(totalPyq) == null ? 'n/a' : `${pctOf(totalPyq)}%`}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:col-span-5 lg:block">
          <div className="ml-auto w-full max-w-[460px] lg:max-w-none">
            <ArtFrame seed={Math.max(0, dayN)} />
          </div>
          <div className="pointer-events-none absolute -bottom-9 left-0 md:-left-4 lg:-left-10">
            <div className="outline-type font-serif text-[clamp(6rem,12vw,9.5rem)] leading-none tracking-[-0.04em] num">{String(big.n).padStart(2, '0')}</div>
          </div>
          <p className="mt-12 text-right text-[13px] text-mute">{big.label}</p>
        </div>
      </section>

      {/* ---------- the day as a timeline ---------- */}
      <Timeline groups={groups} nowMin={nowMin} current={current} onJump={jump} />

      {/* ---------- targets + quick log ---------- */}
      <section className="mt-6 grid grid-cols-1 gap-12 md:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {groups.map(({ b, tasks: bt, name, done: d }) => (
            <BlockSection
              key={b.key}
              refEl={(el) => {
                blockRefs.current[b.key] = el
              }}
              block={b}
              name={name}
              tasks={bt}
              doneCount={d}
              isNow={current === b.key}
              isNext={!current && next === b.key}
              date={date}
              done={done}
              moved={moved}
              onToggle={(t) => toggle(t, date)}
            />
          ))}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
            <button
              type="button"
              disabled={!openTasks.length || date >= EXAM}
              onClick={() => {
                const n = carryOver(date, tasks)
                setMovedMsg(n ? `moved ${n} to ${weekday(addDays(date, 1))}.` : '')
              }}
              className="btn inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[14px] disabled:opacity-40"
            >
              <CornerDownRight size={16} />
              move {openTasks.length} unfinished to tomorrow
            </button>
            {movedMsg ? (
              <p className="flash text-[13px] text-mute" role="status">
                {movedMsg}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-10 lg:sticky lg:top-24">
            <QuickLog date={date} defaultCh={defaultCh} />
            <div>
              <h3 className="font-serif text-[20px]">{rel === 'today' ? 'today' : weekday(date)} by subject</h3>
              <dl className="mt-4 grid grid-cols-3 gap-4">
                {(['phys', 'chem', 'math'] as Subject[]).map((s) => {
                  const a = bySubject(s)
                  const p = pctOf(a)
                  return (
                    <div key={s} className="border-t border-line pt-3">
                      <dt className="text-[12px] text-mute">{SUBJECT_NAME[s]}</dt>
                      <dd className="mt-1 num text-[20px]">{a.att}</dd>
                      <dd className={`num text-[12px] ${accTone(p)}`}>{p == null ? 'no pyqs' : `${p}%`}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </div>
        </aside>
      </section>

      <div className="mx-auto mt-16 max-w-[460px] lg:hidden">
        <ArtFrame seed={Math.max(0, dayN)} />
      </div>
    </div>
  )
}

const SHORT: Record<BlockKey, string> = { b1: 'maths', b2: 'physics', b3: 'drill', b4: 'chem' }

function Timeline({
  groups,
  nowMin,
  current,
  onJump,
}: {
  groups: { b: BlockDef; pct: number; name: string }[]
  nowMin: number | null
  current: BlockKey | null
  onJump: (k: BlockKey) => void
}) {
  const span = DAY_END - DAY_START
  const pos = (m: number) => ((m - DAY_START) / span) * 100
  const showNow = nowMin != null && nowMin >= DAY_START - 60 && nowMin <= DAY_END
  const clampedNow = nowMin == null ? 0 : Math.max(DAY_START, Math.min(DAY_END, nowMin))
  return (
    <section className="mt-10 lg:mt-20" aria-label="the day">
      <div className="relative h-[88px]">
        <div className="absolute inset-x-0 top-[50px] h-px bg-line" />
        {BREAKS.map((br) => (
          <div key={br.start} className="absolute top-[46px] h-[9px] hatch" style={{ left: `${pos(br.start)}%`, width: `${pos(br.end) - pos(br.start)}%` }}>
            <span className="absolute left-0 top-[16px] hidden text-[11px] text-dim md:block">{br.name}</span>
          </div>
        ))}
        {groups.map(({ b, pct, name }) => (
          <button
            key={b.key}
            type="button"
            onClick={() => onJump(b.key)}
            className={`group absolute top-[22px] flex h-[60px] flex-col items-start justify-start text-left transition-colors ${current === b.key ? 'text-smoke' : 'text-mute hover:text-smoke'}`}
            style={{ left: `${pos(b.start)}%`, width: `${pos(b.end) - pos(b.start)}%` }}
            aria-label={`${name}, ${fmtClock(b.start)} to ${fmtClock(b.end)}, ${pct}% done`}
          >
            <span className="block w-full truncate pr-2 text-[13px] leading-[18px]">
              <span className="md:hidden">{SHORT[b.key]}</span>
              <span className="hidden md:inline">{name}</span>
            </span>
            <span className={`absolute left-0 right-1 top-[24px] h-[9px] overflow-hidden border ${current === b.key ? 'border-ego' : 'border-line group-hover:border-mute'} bg-night`}>
              <span className="block h-full origin-left bg-ego transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `scaleX(${pct / 100})` }} />
            </span>
            <span className="absolute left-0 top-[42px] num text-[11px] text-dim">{fmtClock(b.start)}</span>
          </button>
        ))}
        <span className="absolute right-0 top-[64px] num text-[11px] text-dim">{fmtClock(DAY_END)}</span>
        {showNow ? (
          <div className="absolute top-[14px] h-[46px] w-px bg-smoke transition-[left] duration-1000" style={{ left: `${pos(clampedNow)}%` }}>
            <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap num text-[11px] text-smoke">
              <span className="live-dot mr-1 inline-block h-1.5 w-1.5 translate-y-[-1px] bg-ego" aria-hidden />
              {fmtClock(nowMin as number)}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function BlockSection({
  refEl,
  block,
  name,
  tasks,
  doneCount,
  isNow,
  isNext,
  date,
  done,
  moved,
  onToggle,
}: {
  refEl: (el: HTMLElement | null) => void
  block: BlockDef
  name: string
  tasks: DayTask[]
  doneCount: number
  isNow: boolean
  isNext: boolean
  date: string
  done: Record<string, true>
  moved: Record<string, true>
  onToggle: (t: DayTask) => void
}) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')
  const [hours, setHours] = useState(0.5)
  const addCustom = useEgo((s) => s.addCustom)
  const removeCustom = useEgo((s) => s.removeCustom)
  const chapters = useEgo((s) => s.chapters)
  const submit = () => {
    if (!text.trim()) return
    addCustom(date, block.key, text.trim().toLowerCase(), hours)
    setText('')
    setAdding(false)
  }
  const addForm = (
    <form
      className="expand mt-3 grid grid-cols-[1fr_88px_auto] gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label className="sr-only" htmlFor={`add-${block.key}`}>
        target
      </label>
      <input id={`add-${block.key}`} autoFocus className="field" placeholder="what will you finish?" value={text} onChange={(e) => setText(e.target.value)} />
      <label className="sr-only" htmlFor={`h-${block.key}`}>
        hours
      </label>
      <input id={`h-${block.key}`} className="field num" type="number" step="0.25" min="0" value={hours} onChange={(e) => setHours(Number(e.target.value) || 0)} />
      <button type="submit" className="btn solid px-4 text-[14px]">
        add
      </button>
    </form>
  )

  // an empty block is one line, so the blocks that have work stay on the first screen
  if (!tasks.length)
    return (
      <section ref={refEl} className={`scroll-mt-24 border-t py-4 ${isNow ? 'border-ego' : 'border-line'}`}>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-[20px] leading-tight">{name}</h2>
          <span className="num text-[13px] text-mute">
            {fmtClock(block.start)} to {fmtClock(block.end)}
          </span>
          {isNow ? <span className="text-[13px] text-ego-soft">happening now</span> : null}
          <span className="text-[13px] text-dim">nothing planned.</span>
          {adding ? null : (
            <button type="button" onClick={() => setAdding(true)} className="inline-flex min-h-8 items-center gap-1.5 text-[13px] text-dim hover:text-ego-soft">
              <Plus size={14} /> add a target
            </button>
          )}
        </div>
        {adding ? addForm : null}
      </section>
    )

  return (
    <section ref={refEl} className={`scroll-mt-24 grid grid-cols-1 gap-x-8 border-t py-5 md:grid-cols-[200px_1fr] md:py-8 ${isNow ? 'border-ego' : 'border-line'}`}>
      <header className="mb-2 flex flex-wrap items-baseline gap-x-3 md:mb-0 md:block">
        <p className="num text-[13px] text-mute">
          {fmtClock(block.start)} to {fmtClock(block.end)}
        </p>
        <h2 className="order-first font-serif text-[22px] leading-tight md:order-none md:mt-1 md:text-[24px]">{name}</h2>
        <p className="text-[13px] md:mt-2">
          {isNow ? <span className="text-ego-soft">happening now</span> : isNext ? <span className="text-mute">up next</span> : null}
          {isNow || isNext ? <span className="text-dim"> / </span> : null}
          <span className="num text-mute">
            {doneCount} of {tasks.length}
          </span>
        </p>
      </header>
      <div>
        {tasks.length ? (
          <ul className="stagger">
            {tasks.map((t, i) => {
              const d = !!done[t.id]
              const m = !!moved[t.id] && !d
              const link = taskLink(t.kind, t.ch, t.ch ? chapters[t.ch]?.watched : 0)
              return (
                <li key={t.id} className="task grid grid-cols-[32px_1fr_auto] gap-x-2 py-2.5" data-done={d} style={{ ['--i' as string]: i }}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={d}
                    aria-label={t.text}
                    onClick={() => onToggle(t)}
                    className="press -ml-1.5 grid h-8 w-8 place-items-center"
                  >
                    <span className="check grid h-5 w-5 place-items-center border border-mute">
                      <Check size={14} strokeWidth={3} className="text-ink" />
                    </span>
                  </button>
                  <div className={`min-w-0 cursor-pointer pt-1 ${m ? 'opacity-45' : ''}`} onClick={() => onToggle(t)}>
                    <p className="text-[15px] leading-snug">
                      <span className="task-text">{t.text}</span>
                    </p>
                    {t.detail || m ? (
                      <p className="mt-1 text-[13px] leading-snug text-dim">
                        {m ? 'moved to the next day. ' : ''}
                        {t.detail}
                      </p>
                    ) : null}
                    {link && !d ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 inline-flex min-h-8 items-center gap-1 text-[13px] text-ego-soft underline-offset-4 hover:underline"
                      >
                        {link.label}
                        <ArrowUpRight size={13} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                  <div className="flex items-start gap-1 pt-[6px] text-[13px] text-mute">
                    {t.hours > 0 ? <span className="num">{fmtHours(t.hours)}h</span> : null}
                    {t.custom ? (
                      <button type="button" aria-label={`remove ${t.text}`} onClick={() => removeCustom(date, t.id)} className="press -mt-1.5 grid h-8 w-8 place-items-center text-dim hover:text-rose">
                        <X size={14} />
                      </button>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : null}
        {adding ? (
          addForm
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-[13px] text-dim hover:text-ego-soft">
            <Plus size={14} /> add a target
          </button>
        )}
      </div>
    </section>
  )
}

function QuickLog({ date, defaultCh }: { date: string; defaultCh: string }) {
  const [ch, setCh] = useState(defaultCh)
  const [touched, setTouched] = useState(false)
  useEffect(() => {
    if (!touched) setCh(defaultCh)
  }, [defaultCh, touched])
  const [att, setAtt] = useState(0)
  const [cor, setCor] = useState(0)
  const [flash, setFlash] = useState('')
  const logPyq = useEgo((s) => s.logPyq)
  const st = useEgo((s) => s.chapters[ch])
  const pyq = useEgo((s) => s.pyq)
  const update = useEgo((s) => s.updateChapter)
  const def = chapterById[ch]
  const total = accOf(pyq, (p) => p.ch === ch)[ch]
  const totalPct = pctOf(total)

  const submit = () => {
    if (att <= 0) return
    const c = Math.min(cor, att)
    logPyq({ date, ch, att, cor: c })
    setFlash(`logged ${att} on ${def.name}. ${Math.round((c / att) * 100)}% correct.`)
    setAtt(0)
    setCor(0)
  }

  return (
    <div className="border border-line bg-night/70 p-5 md:p-6">
      <h3 className="font-serif text-[20px]">quick log</h3>
      <label htmlFor="ql-ch" className="mt-5 block text-[12px] text-mute">
        chapter
      </label>
      <div className="mt-2">
        <ChapterSelect
          id="ql-ch"
          value={ch}
          onChange={(v) => {
            setCh(v)
            setTouched(true)
            setFlash('')
          }}
        />
      </div>
      <p className="mt-2 text-[12px] text-dim">
        all-time on this chapter: <span className="num text-mute">{total?.att ?? 0}</span> pyqs
        {totalPct != null ? (
          <>
            , <span className={`num ${accTone(totalPct)}`}>{totalPct}%</span>
          </>
        ) : null}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <Stepper
          label="attempted"
          value={att}
          onChange={(v) => {
            setAtt(v)
            setCor((c) => Math.min(c, v))
          }}
          quick={5}
        />
        <Stepper label="correct" value={cor} onChange={setCor} max={att} quick={5} />
      </div>
      <button type="button" disabled={att <= 0} onClick={submit} className="btn solid mt-5 w-full py-3 text-[14px] disabled:opacity-40">
        log {att > 0 ? att : ''} pyqs
      </button>
      <p className="mt-3 min-h-[20px] text-[13px] text-mute" role="status" aria-live="polite">
        {flash ? <span className="flash inline-block">{flash}</span> : null}
      </p>

      {st && def && def.group === 'new' ? (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <Stepper label={`lecture of ${fmtHours(st.hours)}h`} value={st.watched} step={0.5} max={st.hours} onChange={(v) => update(ch, { watched: v })} suffix="h" />
          <Stepper label={`note pages, cap ${def.cap}`} value={st.notes} onChange={(v) => update(ch, { notes: v })} />
        </div>
      ) : st ? (
        <div className="mt-4 border-t border-line pt-5">
          <Stepper label={`note pages, cap ${def.cap}`} value={st.notes} onChange={(v) => update(ch, { notes: v })} />
        </div>
      ) : null}
    </div>
  )
}
