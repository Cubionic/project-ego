import { diffDays, parseYmd } from '../lib/dates'

export type Subject = 'phys' | 'chem' | 'math'
export type BlockKey = 'b1' | 'b2' | 'b3' | 'b4'
export type Kind = 'lecture' | 'pyq' | 'notes' | 'test' | 'drill' | 'recall' | 'buffer' | 'revise' | 'custom'

export const START = '2026-10-03'
export const CONTENT_DONE = '2026-10-22'
export const CLOSE = '2026-10-25'
export const EXAM = '2027-01-22'
export const TARGET = 240
export const CHECKPOINTS = [
  { date: '2026-12-15', score: 220 },
  { date: '2027-01-10', score: 235 },
]
/** hours per day available for lectures + practice (the rest is drill, recall, breaks) */
export const DAILY_CAPACITY = 10
/** % of a day's targets that keeps the streak alive */
export const KEEP = 70

export const SUBJECT_NAME: Record<Subject, string> = { phys: 'physics', chem: 'chemistry', math: 'maths' }

/* ---------- the routine: 10-1, 2-6, run, 7:30-9, 10-3 ---------- */
export interface BlockDef {
  key: BlockKey
  start: number // minutes from 00:00 of the study day, can pass 1440
  end: number
  name: string
}
export const BLOCKS: BlockDef[] = [
  { key: 'b1', start: 600, end: 780, name: 'maths' },
  { key: 'b2', start: 840, end: 1080, name: 'physics' },
  { key: 'b3', start: 1170, end: 1260, name: 'drill + recall' },
  { key: 'b4', start: 1320, end: 1620, name: 'chemistry' },
]
export const BREAKS = [
  { start: 780, end: 840, name: 'eat' },
  { start: 1080, end: 1140, name: 'run' },
  { start: 1260, end: 1320, name: 'eat' },
]
export const DAY_START = 600
export const DAY_END = 1620

/* ---------- chapters ---------- */
export interface ChapterDef {
  id: string
  name: string
  subject: Subject
  group: 'new' | 'weak' | 'backlog'
  /** lecture hours: real video lengths (oct 4), only vector & 3d and aod are estimates */
  hours: number
  /** hours already watched on oct 4 */
  watched: number
  /** short note page cap */
  cap: number
}

export const CHAPTERS: ChapterDef[] = [
  { id: 'ac', name: 'alternating current', subject: 'phys', group: 'new', hours: 7.36, watched: 2.94, cap: 4 },
  { id: 'waves', name: 'waves on string & sound', subject: 'phys', group: 'new', hours: 7.58, watched: 7.2, cap: 4 },
  { id: 'wo', name: 'wave optics', subject: 'phys', group: 'new', hours: 5.13, watched: 0, cap: 4 },
  { id: 'emw', name: 'em waves', subject: 'phys', group: 'new', hours: 2.96, watched: 0, cap: 2 },
  { id: 'mp1', name: 'modern physics 1', subject: 'phys', group: 'new', hours: 9.33, watched: 0, cap: 5 },
  { id: 'mp2', name: 'modern physics 2', subject: 'phys', group: 'new', hours: 1.37, watched: 0, cap: 5 },
  { id: 'semis', name: 'semiconductors', subject: 'phys', group: 'new', hours: 5.3, watched: 0, cap: 4 },

  { id: 'electro', name: 'electrochemistry', subject: 'chem', group: 'new', hours: 6.37, watched: 0, cap: 5 },
  { id: 'ionic', name: 'ionic equilibrium', subject: 'chem', group: 'new', hours: 10.87, watched: 0, cap: 5 },
  { id: 'dnf', name: 'd & f block', subject: 'chem', group: 'new', hours: 5.72, watched: 0, cap: 1 },
  { id: 'amines', name: 'amines', subject: 'chem', group: 'new', hours: 3.24, watched: 0, cap: 4 },
  { id: 'bio', name: 'biomolecules', subject: 'chem', group: 'new', hours: 5.44, watched: 0, cap: 1 },
  { id: 'salt', name: 'salt analysis', subject: 'chem', group: 'new', hours: 6.54, watched: 0, cap: 2 },

  { id: 'mat', name: 'matrices', subject: 'math', group: 'new', hours: 6.39, watched: 0, cap: 4 },
  { id: 'det', name: 'determinants', subject: 'math', group: 'new', hours: 5.61, watched: 0, cap: 4 },
  { id: 'v3d', name: 'vector & 3d', subject: 'math', group: 'new', hours: 8, watched: 8, cap: 4 },
  { id: 'prob', name: 'probability', subject: 'math', group: 'new', hours: 7.71, watched: 0, cap: 4 },
  { id: 'stats', name: 'statistics', subject: 'math', group: 'new', hours: 1.74, watched: 0, cap: 2 },
  { id: 'aod', name: "aod: rolle's and lmvt", subject: 'math', group: 'new', hours: 2, watched: 0, cap: 1 },

  { id: 'pnc', name: 'pnc', subject: 'math', group: 'weak', hours: 0, watched: 0, cap: 4 },
  { id: 'conics', name: 'conics', subject: 'math', group: 'weak', hours: 0, watched: 0, cap: 4 },
  { id: 'binomial', name: 'binomial', subject: 'math', group: 'weak', hours: 0, watched: 0, cap: 4 },
  { id: 'fluids', name: 'fluids', subject: 'phys', group: 'weak', hours: 0, watched: 0, cap: 4 },
  { id: 'rotation', name: 'rotational motion', subject: 'phys', group: 'weak', hours: 0, watched: 0, cap: 4 },
  { id: 'bonding', name: 'chemical bonding', subject: 'chem', group: 'weak', hours: 0, watched: 0, cap: 4 },
  { id: 'equilibrium', name: 'chemical equilibrium', subject: 'chem', group: 'weak', hours: 0, watched: 0, cap: 4 },

  { id: 'kinetics', name: 'chemical kinetics', subject: 'chem', group: 'backlog', hours: 0, watched: 0, cap: 4 },
  { id: 'thermo', name: 'thermochemistry', subject: 'chem', group: 'backlog', hours: 0, watched: 0, cap: 4 },
  { id: 'complex', name: 'complex numbers', subject: 'math', group: 'backlog', hours: 0, watched: 0, cap: 4 },
  { id: 'integration', name: 'integration', subject: 'math', group: 'backlog', hours: 0, watched: 0, cap: 4 },
]
export const chapterById: Record<string, ChapterDef> = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]))
export const NEW_CHAPTERS = CHAPTERS.filter((c) => c.group === 'new')

/* ---------- day-by-day plan, oct 3 to oct 25 ----------
   row: [block, kind, text, hours, chapter?, closesChapter?] */
type Row = [BlockKey, Kind, string, number, string?, 1?]

const PLAN: Record<string, Row[]> = {
  '2026-10-03': [
    ['b4', 'lecture', "aod: rolle's and lmvt, the part left since ages", 1.5, 'aod'],
    ['b4', 'pyq', "aod: 15 pyqs on rolle's and lmvt, then close it", 1, 'aod', 1],
    ['b4', 'notes', 'vector & 3d: one-page formula sheet from your notes', 1, 'v3d'],
    ['b4', 'recall', 'add up the real duration of every lecture left and enter it in syllabus', 0.25],
  ],
  // oct 4 to 22, rebalanced on oct 4 from the real video lengths. lecture rows are video time x 1.5,
  // which leaves room to pause for every in-lecture pyq. oct 4 keeps its row order so ticks stay put.
  '2026-10-04': [
    ['b1', 'test', "analyse yesterday's allen test: tag every lost mark as syllabus, formula or silly", 1],
    ['b1', 'pyq', 'vectors: 25 pyqs, formulas from a blank page first', 2, 'v3d'],
    ['b2', 'pyq', 'waves & sound: pyqs, part 1 of 3', 2, 'waves'],
    ['b2', 'lecture', 'alternating current: continue the lecture', 2, 'ac'],
    ['b4', 'lecture', 'electrochemistry: lecture up to types of electrode', 3.5, 'electro'],
    ['b4', 'pyq', 'electrochemistry: pyqs on what you covered', 1, 'electro'],
    ['b4', 'notes', 'electrochemistry: short note, part 1', 0.5, 'electro'],
  ],
  '2026-10-05': [
    ['b1', 'lecture', 'matrices: lecture, up to symmetric and skew symmetric', 3, 'mat'],
    ['b2', 'lecture', 'alternating current: lecture, rlc circuits and power', 4, 'ac'],
    ['b4', 'lecture', 'electrochemistry: electrode potential and nernst, finish the lecture', 5, 'electro'],
  ],
  '2026-10-06': [
    ['b1', 'lecture', 'matrices: lecture, adjoint and inverse', 3, 'mat'],
    ['b2', 'lecture', 'alternating current: resonance and transformer, finish the lecture', 0.6, 'ac'],
    ['b2', 'pyq', 'alternating current: 25 pyqs', 1.5, 'ac'],
    ['b2', 'notes', 'alternating current: short note, close it', 0.5, 'ac', 1],
    ['b2', 'lecture', 'waves & sound: the last 25 minutes of the lecture', 0.5, 'waves'],
    ['b2', 'pyq', 'waves & sound: pyqs, part 2 of 3', 0.9, 'waves'],
    ['b4', 'lecture', 'electrochemistry: the last hour of the lecture', 1, 'electro'],
    ['b4', 'pyq', 'electrochemistry: 25 pyqs, mop up anything under 60%', 1.5, 'electro'],
    ['b4', 'notes', 'electrochemistry: short note, close it', 0.5, 'electro', 1],
    ['b4', 'revise', 'chemical equilibrium (11th): 20 pyqs first. ionic builds on it', 2, 'equilibrium'],
  ],
  '2026-10-07': [
    ['b1', 'lecture', 'matrices: cayley hamilton and linear equations, finish the lecture', 3, 'mat'],
    ['b2', 'lecture', 'modern physics 1: photon, radiation pressure, de broglie', 4, 'mp1'],
    ['b4', 'notes', 'chemical equilibrium: short note from what you missed', 1, 'equilibrium'],
    ['b4', 'lecture', 'ionic equilibrium: acid base theories, self ionisation of water', 4, 'ionic'],
  ],
  '2026-10-08': [
    ['b1', 'lecture', 'matrices: the last 40 minutes', 0.6, 'mat'],
    ['b1', 'pyq', 'matrices: 20 pyqs, close it', 1, 'mat', 1],
    ['b1', 'lecture', 'determinants: start the lecture', 1.4, 'det'],
    ['b2', 'lecture', 'modern physics 1: photoelectric effect', 4, 'mp1'],
    ['b4', 'lecture', 'ionic equilibrium: ph calculations', 5, 'ionic'],
  ],
  '2026-10-09': [
    ['b1', 'lecture', 'determinants: properties and important determinants', 3, 'det'],
    ['b2', 'lecture', 'modern physics 1: rutherford, bohr, energy levels', 4, 'mp1'],
    ['b4', 'lecture', 'ionic equilibrium: weak acids and bases, mixtures', 5, 'ionic'],
  ],
  '2026-10-10': [
    ['b1', 'lecture', 'determinants: cramer and systems of equations', 3, 'det'],
    ['b2', 'lecture', 'modern physics 1: atomic collisions and x-rays, finish part 1', 2, 'mp1'],
    ['b2', 'pyq', 'modern physics 1: 25 pyqs', 1.5, 'mp1'],
    ['b2', 'notes', 'modern physics 1: short note, close it', 0.5, 'mp1', 1],
    ['b4', 'lecture', 'ionic equilibrium: salt hydrolysis and buffers, finish the lecture', 2.3, 'ionic'],
    ['b4', 'pyq', 'ionic equilibrium: 25 pyqs', 2.7, 'ionic'],
  ],
  '2026-10-11': [
    ['b1', 'test', 'chapter test, 1h: ac, electrochemistry, matrices, modern physics 1', 1],
    ['b1', 'test', 'analyse the chapter test, 1h', 1],
    ['b1', 'lecture', 'determinants: the last hour of the lecture', 1, 'det'],
    ['b2', 'lecture', 'modern physics 2: nuclear physics, binding energy, q value', 2, 'mp2'],
    ['b2', 'pyq', 'modern physics 2: 25 pyqs', 1.5, 'mp2'],
    ['b2', 'notes', 'modern physics 2: short note, close it', 0.5, 'mp2', 1],
    ['b4', 'notes', 'ionic equilibrium: short note', 1, 'ionic'],
    ['b4', 'pyq', 'ionic equilibrium: 10 pyqs on what the note missed, close it', 0.8, 'ionic', 1],
    ['b4', 'pyq', 'electrochemistry + ionic: a mixed set of 15', 1, 'electro'],
    ['b4', 'buffer', 'buffer: catch up first, else chemical kinetics, 25 pyqs', 2.2, 'kinetics'],
  ],
  '2026-10-12': [
    ['b1', 'pyq', 'determinants: 25 pyqs, close it', 1.25, 'det', 1],
    ['b1', 'lecture', 'probability: start the lecture', 1.75, 'prob'],
    ['b2', 'lecture', 'semiconductors: logic gates and band theory', 4, 'semis'],
    ['b4', 'lecture', 'd & f block: configuration and general properties, ncert open', 5, 'dnf'],
  ],
  '2026-10-13': [
    ['b1', 'lecture', 'probability: probability using pnc', 3, 'prob'],
    ['b2', 'lecture', 'semiconductors: pn junction, bias, rectifier, zener, finish', 4, 'semis'],
    ['b4', 'lecture', 'd & f block: dichromate, permanganate, f-block, finish', 3.6, 'dnf'],
    ['b4', 'pyq', 'd & f block: pyqs, tag the years in the ncert margins', 1.4, 'dnf'],
  ],
  '2026-10-14': [
    ['b1', 'lecture', 'probability: set theory, independent and conditional', 3, 'prob'],
    ['b2', 'pyq', 'semiconductors: 25 pyqs', 2, 'semis'],
    ['b2', 'notes', 'semiconductors: short note, close it', 0.5, 'semis', 1],
    ['b2', 'pyq', 'waves & sound: pyqs, part 3 of 3', 1.5, 'waves'],
    ['b4', 'pyq', 'd & f block: 20 pyqs, close it', 1.1, 'dnf', 1],
    ['b4', 'notes', 'd & f block: one page of exceptions (colours, magnetic moments, odd oxidation states)', 1, 'dnf'],
    ['b4', 'lecture', 'amines: lecture', 2.9, 'amines'],
  ],
  '2026-10-15': [
    ['b1', 'lecture', 'probability: total probability, bayes, random variable', 3, 'prob'],
    ['b2', 'lecture', 'wave optics: huygens, interference, ydse', 4, 'wo'],
    ['b4', 'lecture', 'amines: diazonium and reductions, finish the lecture', 2, 'amines'],
    ['b4', 'pyq', 'amines: 25 pyqs', 2, 'amines'],
    ['b4', 'notes', 'amines: conversion map, close it', 1, 'amines', 1],
  ],
  '2026-10-16': [
    ['b1', 'lecture', 'probability: distributions and bernoulli, finish the lecture', 0.85, 'prob'],
    ['b1', 'pyq', 'probability: 25 pyqs, close it', 1.5, 'prob', 1],
    ['b1', 'pyq', 'vector & 3d: 10 pyqs, formulas from blank first', 0.65, 'v3d'],
    ['b2', 'lecture', 'wave optics: fringes, polarisation, diffraction, finish', 3.7, 'wo'],
    ['b2', 'recall', 'formula dump: every new physics chapter so far', 0.3],
    ['b4', 'lecture', 'biomolecules: carbohydrates and nucleic acids, ncert line by line', 5, 'bio'],
  ],
  '2026-10-17': [
    ['b1', 'lecture', 'statistics: lecture', 2.6, 'stats'],
    ['b1', 'pyq', 'statistics: 5 pyqs to warm up', 0.4, 'stats'],
    ['b2', 'pyq', 'wave optics: 30 pyqs', 2, 'wo'],
    ['b2', 'notes', 'wave optics: short note, close it', 1, 'wo', 1],
    ['b2', 'notes', 'waves & sound: short note, close it', 1, 'waves', 1],
    ['b4', 'lecture', 'biomolecules: amino acids, proteins, tests, finish', 3.2, 'bio'],
    ['b4', 'pyq', 'biomolecules: 30 pyqs, close it', 1.8, 'bio', 1],
  ],
  '2026-10-18': [
    ['b1', 'test', 'chapter test, 1h: modern 2, semiconductors, ionic, d & f, amines, probability', 1],
    ['b1', 'test', 'analyse the chapter test, 1h', 1],
    ['b1', 'pyq', 'statistics: 15 pyqs, close it', 1, 'stats', 1],
    ['b2', 'lecture', 'em waves: lecture', 4, 'emw'],
    ['b4', 'lecture', 'salt analysis: anions and their tests', 5, 'salt'],
  ],
  '2026-10-19': [
    ['b1', 'test', 'retest: matrices, determinants, probability. 30 mixed pyqs, timed', 2, 'prob'],
    ['b1', 'test', 'analyse the retest', 1],
    ['b2', 'lecture', 'em waves: the last 25 minutes', 0.4, 'emw'],
    ['b2', 'pyq', 'em waves: 25 pyqs', 1.5, 'emw'],
    ['b2', 'notes', 'em waves: short note, close it', 0.5, 'emw', 1],
    ['b2', 'pyq', 'modern physics: mixed set of 25', 1.6, 'mp2'],
    ['b4', 'lecture', 'salt analysis: cation groups 0 to 6, dry tests, finish', 4.8, 'salt'],
  ],
  '2026-10-20': [
    ['b1', 'pyq', 'vector & 3d: every 2025 and 2026 pyq', 3, 'v3d'],
    ['b2', 'pyq', 'physics: redo every wrong pyq from the fortnight', 2],
    ['b2', 'recall', 'formula dump: all 7 new physics chapters', 0.5],
    ['b2', 'buffer', 'buffer: catch up anything that slipped', 1.5],
    ['b4', 'pyq', 'salt analysis: 25 pyqs', 2, 'salt'],
    ['b4', 'notes', 'salt analysis: one page of tests, close it', 0.5, 'salt', 1],
    ['b4', 'pyq', 'chemistry: mixed pyqs from every new chapter', 2.5],
  ],
  '2026-10-21': [
    ['b1', 'pyq', 'vector & 3d: final timed set of 20, close it', 3, 'v3d', 1],
    ['b2', 'buffer', 'buffer: catch up first, else rotational motion, 30 pyqs', 4, 'rotation'],
    ['b4', 'buffer', 'buffer: catch up first, else an equilibrium + ionic mixed set', 5, 'ionic'],
  ],
  '2026-10-22': [
    ['b1', 'buffer', 'buffer: catch up first, else conics, 25 pyqs', 3, 'conics'],
    ['b2', 'buffer', 'buffer: catch up first, else fluids, 30 pyqs', 4, 'fluids'],
    ['b4', 'buffer', 'buffer: catch up first, else organic mixed pyqs', 5],
  ],
  '2026-10-23': [
    ['b1', 'buffer', 'overflow: anything still open from the plan', 3],
    ['b2', 'buffer', 'overflow: anything still open from the plan', 4],
    ['b4', 'buffer', 'overflow: anything still open from the plan', 5],
  ],
  '2026-10-24': [
    ['b1', 'test', 'full mock: an actual jm shift paper, 3h, exam conditions', 3],
    ['b2', 'test', 'analyse the mock: tag every lost mark', 3],
    ['b2', 'notes', 'update the error log', 1],
    ['b4', 'revise', 'fix the top 3 error types from the mock', 3],
    ['b4', 'pyq', 'redo every question you got wrong', 2],
  ],
  '2026-10-25': [
    ['b1', 'test', 'second paper: allen test or another jm shift, 3h', 3],
    ['b2', 'test', 'analyse it, at least as long as the paper took', 3],
    ['b2', 'notes', 'compare both papers: where are the marks leaking', 1],
    ['b4', 'revise', 'plan november: rank chapters by pyq accuracy, weakest first', 2],
  ],
}

/** date each new chapter is planned to close, for the burn-up chart */
export const PLANNED_CLOSE: Record<string, string> = (() => {
  const out: Record<string, string> = {}
  for (const [date, rows] of Object.entries(PLAN)) for (const r of rows) if (r[5] && r[4]) out[r[4]] = date
  return out
})()

const WEAK_ROTATION = ['equilibrium', 'pnc', 'rotation', 'conics', 'bonding', 'fluids', 'binomial']
const BACKLOG_ROTATION = ['conics', 'kinetics', 'complex', 'equilibrium', 'integration', 'thermo']

/* ---------- task generation ---------- */
export interface CustomTask {
  id: string
  block: BlockKey
  text: string
  hours: number
  carried?: boolean
  kind?: Kind
  ch?: string
  closes?: string
}
export interface DayTask {
  id: string
  block: BlockKey
  kind: Kind
  text: string
  detail: string
  hours: number
  ch?: string
  closes?: string
  custom?: boolean
  carried?: boolean
}
export type Acc = Record<string, { att: number; cor: number }>
export interface PlanCtx {
  acc: Acc
  closedOn: Record<string, string | undefined>
  custom: Record<string, CustomTask[]>
}

function detailFor(kind: Kind, ch?: string): string {
  switch (kind) {
    case 'lecture':
      return 'pause and try every in-lecture pyq before the solution appears.'
    case 'pyq':
      return 'log attempted and correct in quick log when you finish.'
    case 'notes': {
      const cap = ch ? chapterById[ch]?.cap : undefined
      return cap
        ? `${cap} page${cap > 1 ? 's' : ''} max. formulas, terms and the traps that cost you marks.`
        : 'formulas, terms and the traps that cost you marks.'
    }
    case 'test':
      return 'analysis time at least equal to test time.'
    case 'drill':
      return 'formulas from a blank page first, then solve.'
    case 'buffer':
      return 'clear anything that slipped first. the fallback only if nothing did.'
    case 'revise':
      return 'pyqs first, then patch the short note with what you got wrong.'
    default:
      return ''
  }
}

export function isMockDay(date: string): boolean {
  if (date <= CLOSE) return false
  const dow = parseYmd(date).getDay()
  if (date <= '2026-11-15') return dow === 3 || dow === 6
  if (date <= '2026-12-31') return dow === 1 || dow === 3 || dow === 6
  if (date <= '2027-01-20') return diffDays(date, '2027-01-01') % 2 === 0
  return false
}

/** lowest pyq accuracy first; chapters with under 10 attempts count as weakest */
export function weakest(subject: Subject, acc: Acc, offset = 0): ChapterDef {
  const pool = CHAPTERS.filter((c) => c.subject === subject)
  const scored = pool
    .map((c) => {
      const a = acc[c.id]
      const score = !a || a.att < 10 ? -1 + (a?.att ?? 0) / 100 : a.cor / a.att
      return { c, score }
    })
    .sort((x, y) => x.score - y.score)
  return scored[offset % Math.min(3, scored.length)].c
}

const LAST_DRILL_DAY = '2027-01-20'

const SUBJECT_BLOCK: Record<Subject, BlockKey> = { math: 'b1', phys: 'b2', chem: 'b4' }

/** where a moved task belongs: its subject's block, except drill and recall which stay in the evening block */
export function blockFor(kind: Kind | undefined, ch: string | undefined, fallback: BlockKey): BlockKey {
  if (kind === 'drill' || kind === 'recall') return fallback
  const c = ch ? chapterById[ch] : undefined
  return c ? SUBJECT_BLOCK[c.subject] : fallback
}

export function getDayTasks(date: string, ctx: PlanCtx): DayTask[] {
  const out: DayTask[] = []
  const dayN = diffDays(date, START)
  if (dayN < 0 || date > EXAM) return out
  const dow = parseYmd(date).getDay()
  const push = (key: string, block: BlockKey, kind: Kind, text: string, hours: number, ch?: string, closes?: boolean) =>
    out.push({ id: `${date}:${key}`, block, kind, text, detail: detailFor(kind, ch), hours, ch, closes: closes ? ch : undefined })

  if (dayN >= 1 && date <= LAST_DRILL_DAY)
    push('dump', 'b1', 'recall', 'formula dump: last 3 physics chapters from a blank page, then check', 0.15)

  const rows = PLAN[date]
  if (rows) {
    rows.forEach((r, i) => push(`p${i}`, r[0], r[1], r[2], r[3], r[4], r[5] === 1))
  } else if (date === '2027-01-21') {
    push('g1', 'b1', 'revise', 'light revision: short notes only', 3)
    push('g2', 'b2', 'revise', 'physics formula sheets, one pass', 2)
    push('g3', 'b4', 'recall', 'sleep by 23:00. the paper is tomorrow.', 0)
  } else if (date === EXAM) {
    push('g1', 'b1', 'test', 'jee main. play your game.', 3)
  } else if (isMockDay(date)) {
    const c = weakest('chem', ctx.acc, dayN)
    push('m1', 'b1', 'test', 'full mock: an actual jm shift paper, 3h, exam conditions', 3)
    push('m2', 'b2', 'test', 'analyse the mock: tag every lost mark as syllabus, formula or silly', 3)
    push('m3', 'b2', 'revise', 'redo every question you got wrong', 1)
    push('m4', 'b4', 'revise', `revise: ${c.name}`, 4, c.id)
    push('m5', 'b4', 'notes', 'update the error log', 1)
  } else {
    const m = weakest('math', ctx.acc, dayN)
    const p = weakest('phys', ctx.acc, dayN)
    const c = weakest('chem', ctx.acc, dayN)
    const backlog = date <= '2026-11-30' ? chapterById[BACKLOG_ROTATION[dayN % BACKLOG_ROTATION.length]] : null
    if (backlog?.subject === 'math') {
      push('g0', 'b1', 'notes', `note pass: ${backlog.name}. 30-40 pyqs, then the note from what you missed`, 2, backlog.id)
      push('g1', 'b1', 'revise', `revise: ${m.id === backlog.id ? weakest('math', ctx.acc, dayN + 1).name : m.name}`, 1, m.id)
    } else {
      push('g1', 'b1', 'revise', `revise: ${m.name}`, 3, m.id)
    }
    push('g2', 'b2', 'revise', `revise: ${p.name}`, 4, p.id)
    if (backlog?.subject === 'chem') {
      push('g3', 'b4', 'notes', `note pass: ${backlog.name}. 30-40 pyqs, then the note from what you missed`, 2.5, backlog.id)
      push('g4', 'b4', 'revise', `revise: ${c.id === backlog.id ? weakest('chem', ctx.acc, dayN + 1).name : c.name}`, 2.5, c.id)
    } else {
      push('g3', 'b4', 'revise', `revise: ${c.name}. pc exercise 4 if accuracy is under 80%`, 5, c.id)
    }
  }

  if (date <= LAST_DRILL_DAY) {
    if (dayN >= 1) {
      const w = chapterById[WEAK_ROTATION[(dayN - 1) % WEAK_ROTATION.length]]
      push('drill', 'b3', 'drill', `weak drill: ${w.name}, 15-20 pyqs`, 0.75, w.id)
    }
    push('oc', 'b3', 'recall', 'organic: 10 mixed reaction mcqs, write the products from blank', 0.25)
    if (dow === 0 && dayN >= 1) push('mech', 'b3', 'recall', 'formula dump: all of 11th mechanics from a blank page', 0.25)
  }

  // spaced recall: 1, 7 and 21 days after a chapter closes
  for (const [id, closed] of Object.entries(ctx.closedOn)) {
    if (!closed || !chapterById[id]) continue
    const d = diffDays(date, closed)
    const name = chapterById[id].name
    if (d === 1) push(`r1-${id}`, 'b3', 'recall', `recall: write the ${name} note from memory, then check it`, 0.2, id)
    if (d === 7 || d === 21) push(`r${d}-${id}`, 'b3', 'recall', `recall: 10 pyqs from ${name}, ${d} days after closing it`, 0.4, id)
  }

  for (const c of ctx.custom[date] ?? []) {
    const kind = c.kind ?? 'custom'
    out.push({
      id: c.id,
      // carried tasks used to keep the block they came from, so remap them by subject
      block: c.carried ? blockFor(kind, c.ch, c.block) : c.block,
      kind,
      text: c.text,
      detail: c.carried ? 'carried over from the day before.' : detailFor(kind, c.ch),
      hours: c.hours,
      ch: c.ch,
      closes: c.closes,
      custom: true,
      carried: c.carried,
    })
  }
  return out
}

/** what a block is called on a given day, based on what is actually in it */
export function blockName(block: BlockDef, tasks: DayTask[]): string {
  if (!tasks.length) return block.name
  const kinds = tasks.filter((t) => t.kind !== 'recall').map((t) => t.kind)
  if (kinds.length && kinds.every((k) => k === 'buffer')) return 'buffer'
  if (kinds.filter((k) => k === 'test').length * 2 >= kinds.length && kinds.length) return 'test + analysis'
  return block.name
}
