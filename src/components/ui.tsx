import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'
import { CHAPTERS, SUBJECT_NAME, type Subject } from '../data/plan'

/** headline that rises word by word on mount */
export function Words({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={`${i}-${w}`}>
          <span className="word" aria-hidden>
            <span style={{ '--i': i } as CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}

/** number that eases to its value; writes to the DOM directly, no re-renders per frame */
export function CountUp({ value, decimals = 0, duration = 1100 }: { value: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const from = prev.current
    const to = value
    prev.current = value
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = to.toFixed(decimals)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - k, 4)
      el.textContent = (from + (to - from) * e).toFixed(decimals)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, decimals, duration])
  return (
    <span ref={ref} className="num">
      {(0).toFixed(decimals)}
    </span>
  )
}

export function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  quick,
  suffix,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  quick?: number
  suffix?: string
}) {
  const clamp = (v: number) => {
    let n = Math.round(v * 100) / 100
    if (n < min) n = min
    if (max != null && n > max) n = max
    return n
  }
  const id = `st-${label.replace(/\W+/g, '-')}`
  // keep what is being typed ("9." or "") until blur, so a decimal or a cleared field is not snapped back
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] text-mute mb-2">
        {label}
      </label>
      <div className="flex items-stretch border border-line">
        <button
          type="button"
          className="press min-h-9 min-w-9 px-2.5 text-mute hover:text-smoke hover:bg-night-2"
          aria-label={`decrease ${label}`}
          onClick={() => onChange(clamp(value - step))}
        >
          <Minus size={14} />
        </button>
        <input
          id={id}
          inputMode="decimal"
          type="number"
          value={draft ?? value}
          onChange={(e) => {
            const raw = e.target.value
            setDraft(raw)
            if (raw.trim() !== '' && !Number.isNaN(Number(raw))) onChange(clamp(Number(raw)))
          }}
          onBlur={() => setDraft(null)}
          className="num w-full min-w-0 bg-transparent text-center text-[17px] py-2 focus:outline-none"
        />
        {suffix ? <span className="self-center pr-2 text-[12px] text-dim">{suffix}</span> : null}
        <button
          type="button"
          className="press min-h-9 min-w-9 px-2.5 text-mute hover:text-smoke hover:bg-night-2"
          aria-label={`increase ${label}`}
          onClick={() => onChange(clamp(value + step))}
        >
          <Plus size={14} />
        </button>
      </div>
      {quick ? (
        <div className="mt-1.5 flex gap-1.5">
          {[quick, quick * 2].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChange(clamp(value + q))}
              className="press num h-8 min-w-10 border border-line px-2 text-[12px] text-mute hover:border-ego hover:text-ego-soft"
            >
              +{q}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function ChapterSelect({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const subjects: Subject[] = ['phys', 'chem', 'math']
  return (
    <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
      {subjects.map((s) => (
        <optgroup key={s} label={SUBJECT_NAME[s]}>
          {CHAPTERS.filter((c) => c.subject === s).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.group === 'weak' ? ' (11th)' : c.group === 'backlog' ? ' (notes backlog)' : ''}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <h2 className="font-serif text-[26px] md:text-[30px] leading-[1.15] tracking-[-0.01em]">{children}</h2>
      {aside ? <div className="text-[13px] text-mute">{aside}</div> : null}
    </div>
  )
}

export const accTone = (pct: number | null) =>
  pct == null ? 'text-dim' : pct < 60 ? 'text-rose' : pct >= 80 ? 'text-ego-soft' : 'text-smoke'
