import { useMemo, useState } from 'react'
import { CLOSE, EXAM, KEEP, NEW_CHAPTERS, PLANNED_CLOSE, START, SUBJECT_NAME, chapterById, type Subject } from '../data/plan'
import { useEgo } from '../store'
import { historyOf, streakOf } from '../lib/derive'
import { addDays, dateRange, fmtHours, fmtShort, parseYmd, studyDate } from '../lib/dates'
import { BarChart, Heatmap, LineChart } from '../components/charts'
import { CountUp, SectionTitle, Words } from '../components/ui'

type Filter = 'all' | Subject

export default function Progress() {
  const done = useEgo((s) => s.done)
  const custom = useEgo((s) => s.custom)
  const chapters = useEgo((s) => s.chapters)
  const pyq = useEgo((s) => s.pyq)
  const today = studyDate()
  const hist = useMemo(() => historyOf({ done, custom, chapters, pyq }, EXAM, today), [done, custom, chapters, pyq, today])
  const streak = streakOf(hist, today)
  const past = hist.filter((h) => !h.future)
  const hoursTotal = past.reduce((a, h) => a + h.hours, 0)

  // burn-up: chapters closed, planned vs actual
  const burnDays = dateRange(START, CLOSE)
  const planned = burnDays.map((d) => NEW_CHAPTERS.filter((c) => PLANNED_CLOSE[c.id] && PLANNED_CLOSE[c.id] <= d).length)
  const actual = burnDays.map((d) => (d > today ? null : NEW_CHAPTERS.filter((c) => chapters[c.id]?.closedOn && (chapters[c.id].closedOn as string) <= d).length))
  // compare against what the plan wanted closed by yesterday: today's closes are still in play
  const plannedByYesterday = NEW_CHAPTERS.filter((c) => PLANNED_CLOSE[c.id] && PLANNED_CLOSE[c.id] < today).length
  const closedSoFar = NEW_CHAPTERS.filter((c) => chapters[c.id]?.closedOn && (chapters[c.id].closedOn as string) <= today).length
  const behind = plannedByYesterday - closedSoFar

  // last 21 study days
  const from = (() => {
    const f = addDays(today, -20)
    return f < START ? START : f
  })()
  const recent = dateRange(from, today > EXAM ? EXAM : today)
  const recentHist = recent.map((d) => hist.find((h) => h.date === d))
  const avgPlanned = Math.round(recentHist.reduce((a, h) => a + (h?.planned ?? 0), 0) / Math.max(1, recentHist.length))

  const [filter, setFilter] = useState<Filter>('all')
  const inFilter = (ch: string) => filter === 'all' || chapterById[ch]?.subject === filter
  const perDay = recent.map((d) => pyq.filter((p) => p.date === d && inFilter(p.ch)).reduce((a, p) => a + p.att, 0))
  const rolling = recent.map((d) => {
    const win = pyq.filter((p) => p.date <= d && p.date > addDays(d, -7) && inFilter(p.ch))
    const att = win.reduce((a, p) => a + p.att, 0)
    const cor = win.reduce((a, p) => a + p.cor, 0)
    return att ? Math.round((cor / att) * 100) : null
  })

  const heat = hist.map((h) => ({ date: h.date, pct: h.pct, future: h.future, label: fmtShort(h.date), weekday: parseYmd(h.date).getDay() }))

  return (
    <div className="pt-10 md:pt-14">
      <header className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-start font-serif leading-[0.85]">
            <span className="text-[clamp(6rem,14vw,11rem)] tracking-[-0.04em]">
              <CountUp value={streak.current} />
            </span>
          </div>
          <h1 className="mt-4 font-serif text-[28px] leading-tight">
            <Words text={streak.current === 1 ? 'day in a row.' : 'days in a row.'} />
          </h1>
          <p className="mt-2 text-[13px] text-mute">
            a day counts at {KEEP}% of its targets. best run <span className="num text-smoke">{streak.best}</span>, kept{' '}
            <span className="num text-smoke">{streak.kept}</span> of <span className="num text-smoke">{past.length}</span>, <span className="num text-smoke">{fmtHours(Math.round(hoursTotal))}</span>h
            earned.
          </p>
        </div>
        <div className="self-end lg:col-span-7">
          <Heatmap days={heat} keep={KEEP} />
          <p className="mt-3 text-[12px] text-dim">oct 3 to jan 22. one square per day, brighter means more of the day done.</p>
        </div>
      </header>

      <section className="mt-20">
        <SectionTitle aside={behind > 0 ? <span className="text-rose">{behind} behind plan</span> : <span>on plan</span>}>chapters closed</SectionTitle>
        <LineChart
          ariaLabel="chapters closed, planned against actual, oct 3 to oct 25"
          labels={burnDays.map(fmtShort)}
          series={[
            { name: 'plan', values: planned, tone: 'mute', dashed: true },
            { name: 'you', values: actual, tone: 'accent' },
          ]}
          max={NEW_CHAPTERS.length}
          height={260}
        />
      </section>

      <section className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionTitle aside="last 21 days">hours earned</SectionTitle>
          <BarChart
            empty="tick off targets on today and hours stack up here."
            ariaLabel="hours earned per day"
            labels={recent.map(fmtShort)}
            values={recentHist.map((h) => Math.round((h?.hours ?? 0) * 10) / 10)}
            refs={[{ y: avgPlanned, label: `${avgPlanned}h planned` }]}
            highlight={recent.length - 1}
            unit="h"
          />
        </div>
        <div>
          <SectionTitle
            aside={
              <div className="flex gap-1" role="tablist" aria-label="subject">
                {(['all', 'phys', 'chem', 'math'] as Filter[]).map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={filter === f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`press h-8 border px-2.5 text-[12px] ${filter === f ? 'border-ego text-ego-soft' : 'border-line text-mute hover:text-smoke'}`}
                  >
                    {f === 'all' ? 'all' : SUBJECT_NAME[f]}
                  </button>
                ))}
              </div>
            }
          >
            pyqs per day
          </SectionTitle>
          <BarChart empty="log pyqs in quick log and the bars start." ariaLabel="pyqs attempted per day" labels={recent.map(fmtShort)} values={perDay} highlight={recent.length - 1} />
        </div>
      </section>

      <section className="mt-20">
        <SectionTitle aside={filter === 'all' ? 'all subjects' : SUBJECT_NAME[filter]}>accuracy, 7-day rolling</SectionTitle>
        <LineChart
          empty="accuracy shows up after your first logged pyqs."
          ariaLabel="pyq accuracy, rolling 7 days"
          labels={recent.map(fmtShort)}
          series={[{ name: 'accuracy', values: rolling, tone: 'accent' }]}
          max={100}
          refs={[
            { y: 60, label: '60% to close' },
            { y: 80, label: '80%' },
          ]}
          unit="%"
          height={240}
        />
      </section>
    </div>
  )
}
