import { useEffect, useMemo, useState } from 'react'
import { CLOSE, EXAM, NEW_CHAPTERS } from './data/plan'
import { LINES } from './data/content'
import { useEgo } from './store'
import { historyOf, streakOf } from './lib/derive'
import { diffDays, studyDate } from './lib/dates'
import { isTyping, useNow } from './lib/hooks'
import { Footer, MobileNav, Ticker, TopBar, VIEWS, type View } from './components/chrome'
import Today from './views/Today'
import Syllabus from './views/Syllabus'
import Progress from './views/Progress'
import Tests from './views/Tests'
import Hub from './views/Hub'

const readHash = (): View => {
  const h = window.location.hash.replace('#', '')
  return (VIEWS as readonly string[]).includes(h) ? (h as View) : 'today'
}

export default function App() {
  const [view, setViewState] = useState<View>(readHash)
  const setView = (v: View) => {
    setViewState(v)
    if (window.location.hash !== `#${v}`) history.replaceState(null, '', `#${v}`)
    window.scrollTo({ top: 0 })
  }
  useEffect(() => {
    const onHash = () => setViewState(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return
      const i = Number(e.key)
      if (i >= 1 && i <= VIEWS.length) setView(VIEWS[i - 1])
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const done = useEgo((s) => s.done)
  const custom = useEgo((s) => s.custom)
  const chapters = useEgo((s) => s.chapters)
  const pyq = useEgo((s) => s.pyq)
  // re-render on a timer so the streak and countdown roll over at 04:00 with the tab open
  const today = studyDate(useNow(60_000))
  const streak = useMemo(() => {
    const end = today > EXAM ? EXAM : today
    return streakOf(historyOf({ done, custom, chapters, pyq }, end, today), today).current
  }, [done, custom, chapters, pyq, today])

  const toClose = diffDays(CLOSE, today)
  const toExam = diffDays(EXAM, today)
  const countdown = toClose >= 0 ? { days: toClose, label: 'to oct 25' } : { days: Math.max(0, toExam), label: 'to jee main' }

  const closed = NEW_CHAPTERS.filter((c) => chapters[c.id]?.closedOn).length
  const att = pyq.reduce((a, p) => a + p.att, 0)
  const cor = pyq.reduce((a, p) => a + p.cor, 0)
  const facts = [
    `${closed} of ${NEW_CHAPTERS.length} chapters closed`,
    `${Math.max(0, toExam)} days to jee main`,
    att ? `${att} pyqs logged at ${Math.round((cor / att) * 100)}%` : 'no pyqs logged yet',
    `streak ${streak}`,
  ]
  const ticker = LINES.flatMap((l, i) => (i % 2 === 1 ? [l, facts[(i - 1) / 2 % facts.length]] : [l]))

  return (
    <div className="relative min-h-[100dvh] bg-ink font-sans text-smoke">
      <div className="atmosphere" aria-hidden />
      <div className="grain" aria-hidden />
      <TopBar view={view} setView={setView} streak={streak} countdown={countdown} />
      <Ticker items={ticker} />
      <main key={view} className="view-enter relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
        {view === 'today' && <Today />}
        {view === 'syllabus' && <Syllabus />}
        {view === 'progress' && <Progress />}
        {view === 'tests' && <Tests />}
        {view === 'hub' && <Hub />}
      </main>
      <Footer />
      <MobileNav view={view} setView={setView} />
    </div>
  )
}
