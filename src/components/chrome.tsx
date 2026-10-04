import { useLayoutEffect, useRef, useState } from 'react'
import { Activity, BookOpen, ClipboardList, Crosshair, Flame, Library, type LucideIcon } from 'lucide-react'

export const VIEWS = ['today', 'syllabus', 'progress', 'tests', 'hub'] as const
export type View = (typeof VIEWS)[number]

const NAV: { key: View; icon: LucideIcon }[] = [
  { key: 'today', icon: Crosshair },
  { key: 'syllabus', icon: BookOpen },
  { key: 'progress', icon: Activity },
  { key: 'tests', icon: ClipboardList },
  { key: 'hub', icon: Library },
]

export function TopBar({
  view,
  setView,
  streak,
  countdown,
}: {
  view: View
  setView: (v: View) => void
  streak: number
  countdown: { days: number; label: string }
}) {
  const refs = useRef<Partial<Record<View, HTMLButtonElement | null>>>({})
  const [ind, setInd] = useState({ x: 0, w: 0 })
  useLayoutEffect(() => {
    const place = () => {
      const el = refs.current[view]
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth })
    }
    place()
    window.addEventListener('resize', place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
  }, [view])

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line bg-ink">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 md:px-8">
        <button type="button" onClick={() => setView('today')} className="flex min-h-8 items-center gap-2 font-serif text-[19px] tracking-[-0.01em]">
          <img src="/logo-64.webp" srcSet="/logo-64.webp 1x, /logo-128.webp 2x" width={30} height={30} alt="" className="h-[30px] w-[30px]" />
          project ego
        </button>
        <nav className="relative hidden md:flex items-center gap-1" aria-label="main">
          {NAV.map(({ key }, i) => (
            <button
              key={key}
              ref={(el) => {
                refs.current[key] = el
              }}
              type="button"
              onClick={() => setView(key)}
              aria-current={view === key ? 'page' : undefined}
              className={`relative px-3.5 py-2 text-[14px] transition-colors ${view === key ? 'text-smoke' : 'text-mute hover:text-smoke'}`}
              title={`${key} (${i + 1})`}
            >
              {key}
            </button>
          ))}
          <span
            aria-hidden
            className="absolute -bottom-[13px] h-[2px] bg-ego transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: ind.x, width: ind.w }}
          />
        </nav>
        <div className="flex items-center gap-5 text-[13px]">
          <span className="flex items-center gap-1.5" title="days in a row at 70% or more">
            <Flame size={16} className={streak > 0 ? 'flame text-ego' : 'text-dim'} />
            <span className="num text-smoke">{streak}</span>
            <span className="hidden lg:inline text-mute">day streak</span>
          </span>
          <span className="hidden sm:flex items-baseline gap-1.5">
            <span className="num text-smoke">{countdown.days}</span>
            <span className="text-mute">{countdown.label}</span>
          </span>
        </div>
      </div>
    </header>
  )
}

export function Ticker({ items }: { items: string[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee relative z-10 overflow-hidden border-b border-line" aria-hidden>
      <div className="marquee-track flex w-max py-2.5 text-[13px] text-mute">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-6">{t}</span>
            <span className="text-ego">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function MobileNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-ink md:hidden" aria-label="main">
      {NAV.map(({ key, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setView(key)}
          aria-current={view === key ? 'page' : undefined}
          className={`press relative flex flex-col items-center gap-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 text-[11px] ${view === key ? 'text-smoke' : 'text-dim'}`}
        >
          <span className={`absolute inset-x-5 top-0 h-[2px] transition-transform duration-500 ${view === key ? 'scale-x-100 bg-ego' : 'scale-x-0 bg-ego'}`} />
          <Icon size={18} strokeWidth={1.75} />
          {key}
        </button>
      ))}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-8 md:px-8 md:pb-10">
        <p className="max-w-[80ch] text-[12px] leading-relaxed text-dim">
          Disclaimer: All characters from Blue Lock belong to Muneyuki Kaneshiro, Yusuke Nomura, Kodansha, and the Blue Lock Production
          Committee. This is a non-commercial, fan-made personal project.
        </p>
      </div>
    </footer>
  )
}
