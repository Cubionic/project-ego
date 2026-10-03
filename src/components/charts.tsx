import { useState } from 'react'
import { useWidth } from '../lib/hooks'

type Tone = 'accent' | 'smoke' | 'mute'
const TONE: Record<Tone, string> = { accent: 'var(--color-ego)', smoke: 'var(--color-smoke)', mute: 'var(--color-mute)' }

export interface Series {
  name: string
  values: (number | null)[]
  tone: Tone
  dashed?: boolean
}
interface Ref {
  y: number
  label: string
}

const niceMax = (v: number) => {
  if (v <= 5) return 5
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / p
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p
}

export function LineChart({
  labels,
  series,
  height = 240,
  max,
  min = 0,
  refs = [],
  unit = '',
  ariaLabel,
  empty = 'nothing logged yet.',
}: {
  empty?: string
  labels: string[]
  series: Series[]
  height?: number
  max?: number
  min?: number
  refs?: Ref[]
  unit?: string
  ariaLabel: string
}) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const pad = { l: 34, r: 12, t: 16, b: 26 }
  const iw = Math.max(1, w - pad.l - pad.r)
  const ih = height - pad.t - pad.b
  const n = labels.length
  const vals = series.flatMap((s) => s.values).filter((v): v is number => v != null)
  const top = max ?? niceMax(Math.max(1, ...vals, ...refs.map((r) => r.y)))
  const x = (i: number) => pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw)
  const y = (v: number) => pad.t + ih - ((v - min) / (top - min)) * ih
  const ticks = [0, 0.5, 1].map((k) => min + (top - min) * k)
  const every = Math.max(1, Math.ceil(n / (w < 500 ? 4 : 7)))
  const path = (vs: (number | null)[]) => {
    let d = ''
    let pen = false
    vs.forEach((v, i) => {
      if (v == null) {
        pen = false
        return
      }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`
      pen = true
    })
    return d
  }
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left - pad.l) / iw) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }
  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 && n > 0 ? (
        <svg width={w} height={height} role="img" aria-label={ariaLabel} onPointerMove={move} onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="num" fontSize="11" fill="var(--color-dim)">
                {Math.round(t)}
              </text>
            </g>
          ))}
          {refs.map((r) => (
            <g key={r.label}>
              <line x1={pad.l} x2={w - pad.r} y1={y(r.y)} y2={y(r.y)} stroke="var(--color-mute)" strokeDasharray="3 4" />
              <text x={w - pad.r} y={y(r.y) - 6} textAnchor="end" fontSize="11" fill="var(--color-mute)">
                {r.label}
              </text>
            </g>
          ))}
          {series.map((s) => (
            <path
              key={s.name + s.values.length}
              d={path(s.values)}
              fill="none"
              stroke={TONE[s.tone]}
              strokeWidth={s.tone === 'accent' ? 2 : 1.5}
              strokeDasharray={s.dashed ? '4 4' : undefined}
              className={s.dashed ? undefined : 'draw-line'}
              pathLength={s.dashed ? undefined : 1}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {series
            .filter((s) => s.tone === 'accent')
            .map((s) => {
              const last = s.values.map((v, i) => [v, i] as const).filter(([v]) => v != null).pop()
              return last ? <circle key={s.name} cx={x(last[1])} cy={y(last[0] as number)} r={3.5} fill="var(--color-ego)" /> : null
            })}
          {labels.map((l, i) =>
            i % every === 0 || i === n - 1 ? (
              <text key={l + i} x={x(i)} y={height - 6} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontSize="11" fill="var(--color-dim)">
                {l}
              </text>
            ) : null,
          )}
          {hover != null ? (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="var(--color-mute)" />
              {series.map((s) =>
                s.values[hover] != null ? (
                  <circle key={s.name} cx={x(hover)} cy={y(s.values[hover] as number)} r={3} fill={TONE[s.tone]} stroke="#000" />
                ) : null,
              )}
            </g>
          ) : null}
        </svg>
      ) : null}
      {!vals.length ? <p className="pointer-events-none absolute inset-0 grid place-items-center text-[13px] text-dim">{empty}</p> : null}
      {hover != null && w > 0 ? (
        <div
          className="pointer-events-none absolute top-0 z-10 min-w-32 border border-line bg-ink px-3 py-2 text-[12px]"
          style={{ left: Math.min(Math.max(0, x(hover) + 10), w - 150) }}
        >
          <div className="text-mute mb-1">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.name} className="flex justify-between gap-4">
              <span className={s.tone === 'accent' ? 'text-ego-soft' : 'text-mute'}>{s.name}</span>
              <span className="num">{s.values[hover] == null ? 'n/a' : `${Math.round((s.values[hover] as number) * 10) / 10}${unit}`}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function BarChart({
  labels,
  values,
  height = 200,
  max,
  refs = [],
  highlight,
  unit = '',
  ariaLabel,
  empty = 'nothing logged yet.',
}: {
  empty?: string
  labels: string[]
  values: number[]
  height?: number
  max?: number
  refs?: Ref[]
  highlight?: number
  unit?: string
  ariaLabel: string
}) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const pad = { l: 34, r: 12, t: 16, b: 26 }
  const iw = Math.max(1, w - pad.l - pad.r)
  const ih = height - pad.t - pad.b
  const n = values.length
  const top = max ?? niceMax(Math.max(1, ...values, ...refs.map((r) => r.y)))
  const slot = iw / Math.max(1, n)
  const bw = Math.max(3, Math.min(28, slot * 0.62))
  const y = (v: number) => pad.t + ih - (v / top) * ih
  const every = Math.max(1, Math.ceil(n / (w < 500 ? 4 : 7)))
  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 ? (
        <svg width={w} height={height} role="img" aria-label={ariaLabel} onPointerLeave={() => setHover(null)}>
          {[0, 0.5, 1].map((k) => (
            <g key={k}>
              <line x1={pad.l} x2={w - pad.r} y1={y(top * k)} y2={y(top * k)} stroke="var(--color-line)" />
              <text x={pad.l - 8} y={y(top * k) + 4} textAnchor="end" className="num" fontSize="11" fill="var(--color-dim)">
                {Math.round(top * k)}
              </text>
            </g>
          ))}
          {values.map((v, i) => {
            const cx = pad.l + slot * i + slot / 2
            const active = i === highlight || i === hover
            return (
              <g key={labels[i] + i} onPointerEnter={() => setHover(i)}>
                <rect x={pad.l + slot * i} y={pad.t} width={slot} height={ih} fill="transparent" />
                <rect
                  className="bar"
                  style={{ animationDelay: `${i * 18}ms` }}
                  x={cx - bw / 2}
                  y={y(v)}
                  width={bw}
                  height={Math.max(0, pad.t + ih - y(v))}
                  fill={active ? 'var(--color-ego)' : 'var(--color-night-2)'}
                  stroke={active ? 'none' : 'var(--color-line)'}
                />
                {i % every === 0 || i === n - 1 ? (
                  <text x={cx} y={height - 6} textAnchor="middle" fontSize="11" fill="var(--color-dim)">
                    {labels[i]}
                  </text>
                ) : null}
              </g>
            )
          })}
          {refs.map((r) => (
            <g key={r.label} pointerEvents="none">
              <line x1={pad.l} x2={w - pad.r} y1={y(r.y)} y2={y(r.y)} stroke="var(--color-mute)" strokeDasharray="3 4" />
              <text x={w - pad.r} y={y(r.y) - 6} textAnchor="end" fontSize="11" fill="var(--color-mute)">
                {r.label}
              </text>
            </g>
          ))}
        </svg>
      ) : null}
      {values.every((v) => !v) ? <p className="pointer-events-none absolute inset-0 grid place-items-center text-[13px] text-dim">{empty}</p> : null}
      {hover != null && w > 0 ? (
        <div
          className="pointer-events-none absolute top-0 z-10 border border-line bg-ink px-3 py-2 text-[12px]"
          style={{ left: Math.min(Math.max(0, pad.l + slot * hover + slot), w - 130) }}
        >
          <div className="text-mute">{labels[hover]}</div>
          <div className="num text-smoke">
            {Math.round(values[hover] * 10) / 10}
            {unit}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export interface HeatDay {
  date: string
  pct: number
  future: boolean
  label: string
  weekday: number
}

export function Heatmap({ days, keep }: { days: HeatDay[]; keep: number }) {
  if (!days.length) return null
  const lead = days[0].weekday
  const cells: (HeatDay | null)[] = [...Array(lead).fill(null), ...days]
  const level = (d: HeatDay) => {
    if (d.future) return 'border border-line bg-transparent'
    if (d.pct === 0) return 'bg-night-2'
    if (d.pct < 40) return 'bg-ego/25'
    if (d.pct < keep) return 'bg-ego/50'
    if (d.pct < 100) return 'bg-ego/80'
    return 'bg-ego'
  }
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-max">
        {cells.map((d, i) =>
          d ? (
            <div
              key={d.date}
              title={`${d.label}: ${d.future ? 'ahead' : `${d.pct}%`}`}
              className={`h-[13px] w-[13px] md:h-[15px] md:w-[15px] ${level(d)}`}
            />
          ) : (
            <div key={`pad-${i}`} className="h-[13px] w-[13px] md:h-[15px] md:w-[15px]" />
          ),
        )}
      </div>
    </div>
  )
}
