// A study day runs 10:00 -> 03:00, so the calendar day only rolls over at 04:00.
export const ROLLOVER_HOUR = 4

const WD = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const MO = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function studyDate(now = new Date()): string {
  return ymd(new Date(now.getTime() - ROLLOVER_HOUR * 3600_000))
}

export function addDays(s: string, n: number): string {
  const d = parseYmd(s)
  d.setDate(d.getDate() + n)
  return ymd(d)
}

/** a - b in whole days */
export function diffDays(a: string, b: string): number {
  return Math.round((parseYmd(a).getTime() - parseYmd(b).getTime()) / 86_400_000)
}

export function dateRange(from: string, to: string): string[] {
  const out: string[] = []
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d)
  return out
}

/** minutes since 00:00 of the study day; 01:30 after midnight reads as 1530 */
export function minutesIntoStudyDay(now = new Date()): number {
  const h = now.getHours()
  const mins = h * 60 + now.getMinutes()
  return h < ROLLOVER_HOUR ? mins + 1440 : mins
}

export const fmtDay = (s: string) => {
  const d = parseYmd(s)
  return `${WD[d.getDay()]}, ${MO[d.getMonth()]} ${d.getDate()}`
}
export const fmtShort = (s: string) => {
  const d = parseYmd(s)
  return `${MO[d.getMonth()]} ${d.getDate()}`
}
export const weekday = (s: string) => WD[parseYmd(s).getDay()]
export const monthShort = (s: string) => MO[parseYmd(s).getMonth()]

export function fmtClock(m: number): string {
  const mm = ((m % 1440) + 1440) % 1440
  return `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`
}

export const fmtHours = (h: number) => String(parseFloat(h.toFixed(2)))
