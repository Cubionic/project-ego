// generated from the youtube descriptions on 2026-10-04. edit by hand freely.
// t = start in seconds, len = video length in seconds.

export type Stamp = [t: number, label: string]
export interface Video {
  id: string
  len: number
  by: string
  stamps?: Stamp[]
}

/** chapter one-shots, the lecture of record for each new chapter */
export const LECTURES: Record<string, Video> = {
  ac: { id: 'FImh-a0673s', len: 26490, by: 'jee wallah', stamps: [[400, "current electricity"], [565, "alternating current"], [1010, "generation of ac"], [2230, "average current"], [3508, "root mean square current"], [6528, "superposition & questions"], [8960, "heat dissipated & loss"], [9550, "battery"], [10080, "purely resistive circuit"], [11112, "purely capacitive circuit"], [14635, "purely inductor"], [15950, "rlc circuit"], [17210, "questions & pyqs"], [19896, "power supply by source and power dissipated in rlc"], [20568, "pyqs"], [21210, "resonance"], [23685, "pyqs"], [25260, "transformer"]] },
  semis: { id: 'rdnWOyqZTy4', len: 19066, by: 'jee wallah', stamps: [[225, "logic gates"], [4461, "semiconductor"], [6786, "energy bands"], [7164, "n type"], [7938, "p type"], [8446, "pn junction diode"], [8624, "resistivity and conductivity"], [9782, "pn junction diode"], [10317, "forward and reverse bias"], [12000, "junction biased"], [12402, "behavior of pn junction with bias"], [12544, "comparison between forward and reverse bias"], [14227, "rectifier"], [15000, "zener diode"], [16104, "reverse breakdown"]] },
  emw: { id: '8TnzQkZrztQ', len: 10655, by: 'jee wallah', stamps: [[249, "emw basics"], [2768, "maxwell equation"], [3323, "electromagnetic wave"], [6426, "pyqs"], [7216, "energy density"], [7850, "intensity"], [9488, "electromagnetic spectrum"], [10175, "poynting vector"]] },
  mp: { id: 'V76QPpoWVwA', len: 38504, by: 'jee wallah', stamps: [[360, "photon"], [751, "intensity"], [1349, "radiation pressure"], [4070, "formula sheet"], [4334, "de broglie wavelength"], [7967, "photoelectric effect"], [9807, "photoelectric effect graph"], [10730, "experimental study of photoelectric effect"], [17252, "rutherford atomic theory"], [18046, "formula sheet"], [19408, "energy level diagram"], [24988, "effect of nuclear motion"], [25900, "atomic collision"], [27565, "x-ray"], [33580, "nuclear physics"], [34542, "binding energy"], [36412, "q value of reaction"]] },
  amines: { id: 'SKHrfD34Kkc', len: 11651, by: 'jee wallah', stamps: [[290, "carbylamine reaction"], [1023, "nitrene"], [1868, "hoffmann bromamide degradation reaction"], [2530, "gabriel phthalimide amine"], [3465, "separation of amines"], [4318, "solubility & differential extraction"], [5118, "acylation"], [6128, "reaction with arylsulphonyl chloride"], [6635, "example of electrophilic aromatic substitution"], [7038, "nitration of aniline"], [7845, "reaction with nitrous acid & diazonium salts"], [8880, "retention of diazo group coupling reaction"], [9605, "reduction of nitro & amides"], [10188, "selective reduction of dinitrobenzene"]] },
  bio: { id: 'LcVNwEWJtyI', len: 19600, by: 'jee wallah', stamps: [[388, "carbohydrates"], [861, "classification of carbohydrates"], [3605, "haworth projection"], [9385, "ribose to dna"], [9866, "biological function of nucleic acid"], [11515, "enzymes & vitamins"], [14488, "amino acids"], [14748, "classification"], [16424, "classification of proteins"], [17177, "distinguish test of biomolecules"]] },
  mat: { id: '2YFQIFQmPmw', len: 23005, by: 'jee wallah', stamps: [[568, "matrix definition"], [938, "order of a matrix"], [1864, "types of matrices"], [4450, "algebra of matrices"], [7544, "properties of matrix multiplication"], [8362, "trace of a matrix questions"], [9650, "the transpose of a matrix & its properties"], [10497, "symmetric and skew symmetric matrices"], [11228, "properties of symmetric and skew symmetric matrices"], [13876, "adjoint of a matrix"], [14825, "properties of the adjoint of a matrix"], [16120, "questions & pyqs"], [17238, "inverse of a matrix"], [17698, "properties of the inverse of a matrix"], [18304, "characteristics equation"], [18540, "cayley hamilton theorem"], [19856, "types of square matrices"], [21140, "matrix method for solving linear equations"]] },
  det: { id: 'uhq_WUNlvh8', len: 20206, by: 'jee wallah', stamps: [[810, "determinant"], [1254, "minor of an element"], [1690, "cofactor of an element"], [2325, "expansion of a determinant"], [3758, "area of a triangle"], [3988, "properties of determinants"], [6982, "summation of determinants"], [8385, "properties of determinants"], [9092, "some important determinants to remember"], [14584, "differentiation of determinant"], [15487, "linear equations involving two variables"], [15894, "cramer's rule"], [15962, "cramer's rule for non-homogeneous system of equations"], [16308, "nature of solutions"], [17620, "cramer's rule for homogeneous system of equations"], [17776, "nature of solutions"], [18322, "method to express infinite solutions"], [18580, "multiplication of 2 determinants"]] },
  prob: { id: 'lWqcibMwKtk', len: 27766, by: 'jee wallah', stamps: [[309, "general terminology"], [969, "definition"], [2485, "probability using p&c"], [12300, "probability using set theory"], [16375, "independent events"], [19052, "conditional probability"], [21855, "total probability theorem"], [25789, "random variable"], [25992, "probability distribution"], [26248, "mean, variance and s.d."], [26840, "bernoulli's trial"]] },
  stats: { id: 'M0wE7kH_ojk', len: 6269, by: 'jee wallah', stamps: [] },
}

/** mahatandav 2026: full subject in one video, for short notes and revision */
export const TANDAV: Record<string, Video & { name: string }> = {
  phys11: { id: 'V9vUxNVaqOw', name: 'class 11 physics', len: 36994, by: 'pw jee', stamps: [[620, "1d + 2d"], [7602, "nlm + friction"], [13316, "circular motion"], [15205, "work, power, energy"], [17295, "work, power, energy pyqs"], [19237, "com"], [24070, "rotation, moi & angular momentum"], [28440, "elasticity"], [28660, "thermal expansion"], [28868, "heat transfer (conduction & radiation)"], [34070, "ktg thermodynamics"]] },
  phys12: { id: 'uZHX8sOELJw', name: 'class 12 physics', len: 42550, by: 'pw jee', stamps: [[545, "em wave"], [4405, "wave optics"], [9096, "ray optics"], [19455, "electrostatics"], [25860, "current electricity"], [29679, "capacitor"], [34858, "magnetic effect of current"], [40460, "emi"]] },
  oc: { id: 'eLGdJNnQrVM', name: 'organic chemistry', len: 42648, by: 'pw jee', stamps: [[660, "iupac nomenclature"], [4462, "general organic chemistry"], [9225, "isomerism"], [14166, "qualitative analysis"], [18315, "quantitative analysis"], [22130, "purification"], [25115, "biomolecules"], [31615, "reaction mechanism"]] },
  pc: { id: 'lN27tr0vCyY', name: 'physical chemistry', len: 36715, by: 'pw jee', stamps: [[317, "mole concept theory"], [2967, "mole concept questions"], [5589, "redox theory"], [8024, "redox questions"], [9538, "solutions theory"], [10535, "solutions questions"], [15180, "thermodynamics theory"], [15960, "thermodynamics questions"], [19696, "entropy"], [20656, "atomic structure theory"], [21360, "atomic structure questions"], [23580, "chemical equilibrium"], [26260, "ionic equilibrium"], [30870, "chemical kinetics"], [34135, "electrochemistry"]] },
  ioc: { id: 'AMSVJZ9_b6w', name: 'inorganic chemistry', len: 32617, by: 'pw jee', stamps: [[256, "metal, non-metal & metalloids"], [1740, "electronic configuration"], [2650, "atomic radius"], [3200, "ionisation energy"], [3872, "electron affinity questions"], [4600, "electronegativity questions"], [7295, "molecular orbital theory"], [8785, "crystal field theory"], [9440, "spectrochemical series"], [11360, "prediction of hybridisation"], [14045, "charge transfer spectra"], [14913, "structure of metal carbonyls"], [17128, "industry and natural uses"], [17542, "inert pair effect & physical properties"], [18462, "bond energy"], [19905, "melting & boiling point"], [21296, "reduction potential"], [22395, "table for oxidising power"], [23646, "neutral or faintly alkaline solutions kmno4"], [23860, "preparation of potassium dichromate"], [24850, "lanthanoids"], [25660, "use of lanthanides"], [27010, "salt analysis"], [28302, "some important tests"], [30480, "test for group 0, 1, 3, 4 cations"]] },
  math11: { id: 'CRj8PVlsXzc', name: 'class 11 maths', len: 36060, by: 'pw jee', stamps: [[722, "basic math"], [2605, "quadratic equation"], [6945, "trigonometry"], [9570, "binomial theorem"], [15380, "sequence and series"], [19572, "permutation and combination"], [22282, "straight lines"], [24598, "circles"], [27780, "conic section - parabola"], [29650, "conic section - ellipse"], [30550, "conic section - hyperbola"], [31306, "complex numbers"], [32814, "set theory"], [33753, "statistics"]] },
  math12: { id: 'xNDHw34tLV4', name: 'class 12 maths', len: 42900, by: 'pw jee', stamps: [[238, "matrices"], [5467, "determinants"], [9080, "relations"], [11195, "functions"], [14242, "inverse trigonometric functions"], [17568, "limit, continuity & differentiability"], [24360, "application of derivatives"], [26396, "indefinite and definite integration"], [31390, "area & differential equation"], [34780, "vectors & 3d"], [41170, "probability"]] },
}

/** shorter full-chapter revisions, for the night before a test or a recall day */
export const REVISIONS: Record<string, Video> = {
  ac: { id: 'ydKl-uBmyJg', len: 5496, by: 'jee wallah' },
  waves: { id: 'U7b2QKmFYSQ', len: 5536, by: 'jee wallah' },
  wo: { id: 'AP_PmyGR8lQ', len: 6125, by: 'jee wallah' },
  emw: { id: '6jWauEX_c7Q', len: 1202, by: 'jee wallah' },
  mp: { id: 'uphTyB-qbZs', len: 3322, by: 'jee wallah' },
  semis: { id: 'y07SQKWUnUo', len: 5435, by: 'jee wallah' },
  electro: { id: 'ZDS5RhQM0VU', len: 3859, by: 'jee wallah' },
  ionic: { id: 'NbCZeJRIa-U', len: 4771, by: 'jee wallah' },
  dnf: { id: 'cmXaItOME3s', len: 5266, by: 'jee wallah' },
  amines: { id: 'oIyYV522wNQ', len: 4073, by: 'jee wallah' },
  bio: { id: 'B2NZEiRUwiw', len: 3614, by: 'jee wallah' },
  mat: { id: 'l9cH1NfAs5w', len: 5514, by: 'jee wallah' },
  det: { id: 'ZNMTK2rQ-Sk', len: 4483, by: 'jee wallah' },
  prob: { id: '-DTuVgWCIWU', len: 3911, by: 'jee wallah' },
  stats: { id: 'eHjEyG4g6lY', len: 3828, by: 'jee wallah' },
}

/** question marathons and 10-minute recaps */
export const EXTRAS: { name: string; video: Video; note: string }[] = [
  { name: 'organic chemistry in 250 questions', video: { id: 'aVlN6bo65a8', len: 25713, by: 'unacademy jee nexus' }, note: 'organic' },
  { name: 'd & f block in 10 minutes', video: { id: '9UH5tMr6dkQ', len: 635, by: 'simply concise' }, note: 'inorganic' },
]

/** which lecture, revision, mahatandav section and examside pyq pages belong to each chapter */
export interface ChapterLinks {
  lecture?: string
  /** start inside the lecture video, for chapters that share one video */
  lectureFrom?: number
  lectureTo?: number
  revision?: string
  tandav?: [video: string, t: number, label: string][]
  pyq: string[]
}

const ex = (s: string) => `https://questions.examside.com/past-years/jee/jee-main/${s}`

export const LINKS: Record<string, ChapterLinks> = {
  ac: { lecture: 'ac', revision: 'ac', pyq: [ex('physics/alternating-current')] },
  waves: { revision: 'waves', pyq: [ex('physics/waves')] },
  wo: { revision: 'wo', tandav: [['phys12', 4405, 'wave optics']], pyq: [ex('physics/wave-optics')] },
  emw: { lecture: 'emw', revision: 'emw', tandav: [['phys12', 545, 'em waves']], pyq: [ex('physics/electromagnetic-waves')] },
  mp1: { lecture: 'mp', lectureFrom: 0, lectureTo: 33580, revision: 'mp', pyq: [ex('physics/dual-nature-of-radiation'), ex('physics/atoms-and-nuclei')] },
  mp2: { lecture: 'mp', lectureFrom: 33580, revision: 'mp', pyq: [ex('physics/atoms-and-nuclei')] },
  semis: { lecture: 'semis', revision: 'semis', pyq: [ex('physics/electronic-devices')] },
  electro: { revision: 'electro', tandav: [['pc', 34135, 'electrochemistry']], pyq: [ex('chemistry/electrochemistry')] },
  ionic: { revision: 'ionic', tandav: [['pc', 26260, 'ionic equilibrium']], pyq: [ex('chemistry/ionic-equilibrium')] },
  dnf: { revision: 'dnf', tandav: [['ioc', 23646, 'kmno4, k2cr2o7, lanthanoids']], pyq: [ex('chemistry/d-and-f-block-elements')] },
  amines: { lecture: 'amines', revision: 'amines', pyq: [ex('chemistry/compounds-containing-nitrogen')] },
  bio: { lecture: 'bio', revision: 'bio', tandav: [['oc', 25115, 'biomolecules']], pyq: [ex('chemistry/biomolecules')] },
  mat: { lecture: 'mat', revision: 'mat', tandav: [['math12', 238, 'matrices']], pyq: [ex('mathematics/matrices-and-determinants')] },
  det: { lecture: 'det', revision: 'det', tandav: [['math12', 5467, 'determinants']], pyq: [ex('mathematics/matrices-and-determinants')] },
  v3d: { tandav: [['math12', 35980, 'vectors & 3d']], pyq: [ex('mathematics/vector-algebra'), ex('mathematics/3d-geometry')] },
  prob: { lecture: 'prob', revision: 'prob', tandav: [['math12', 41170, 'probability']], pyq: [ex('mathematics/probability')] },
  stats: { lecture: 'stats', revision: 'stats', tandav: [['math11', 33753, 'statistics']], pyq: [ex('mathematics/statistics')] },
  aod: { tandav: [['math12', 24360, 'application of derivatives']], pyq: [ex('mathematics/application-of-derivatives')] },

  pnc: { tandav: [['math11', 19572, 'permutation and combination']], pyq: [ex('mathematics/permutations-and-combinations')] },
  conics: {
    tandav: [
      ['math11', 27780, 'parabola'],
      ['math11', 29650, 'ellipse'],
      ['math11', 30550, 'hyperbola'],
    ],
    pyq: [ex('mathematics/parabola'), ex('mathematics/ellipse'), ex('mathematics/hyperbola')],
  },
  binomial: { tandav: [['math11', 9570, 'binomial theorem']], pyq: [ex('mathematics/binomial-theorem')] },
  fluids: { pyq: [ex('physics/properties-of-matter')] },
  rotation: { tandav: [['phys11', 24070, 'rotation, moi, angular momentum']], pyq: [ex('physics/rotational-motion')] },
  bonding: {
    tandav: [
      ['ioc', 7295, 'molecular orbital theory'],
      ['ioc', 11360, 'prediction of hybridisation'],
    ],
    pyq: [ex('chemistry/chemical-bonding-and-molecular-structure')],
  },
  equilibrium: { tandav: [['pc', 23580, 'chemical equilibrium']], pyq: [ex('chemistry/chemical-equilibrium')] },
  kinetics: { tandav: [['pc', 30870, 'chemical kinetics']], pyq: [ex('chemistry/chemical-kinetics-and-nuclear-chemistry')] },
  thermo: { tandav: [['pc', 15180, 'thermodynamics']], pyq: [ex('chemistry/thermodynamics')] },
  complex: { tandav: [['math11', 31306, 'complex numbers']], pyq: [ex('mathematics/complex-numbers')] },
  integration: { tandav: [['math12', 26396, 'indefinite and definite integration']], pyq: [ex('mathematics/indefinite-integrals'), ex('mathematics/definite-integration')] },
}

export const yt = (id: string, t = 0) => `https://www.youtube.com/watch?v=${id}${t > 0 ? `&t=${Math.floor(t)}s` : ''}`

/** 2:05:44 style */
export function clock(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

/** length of a chapter's share of its lecture video, in seconds */
export function lectureSpan(l: ChapterLinks): number {
  const v = l.lecture ? LECTURES[l.lecture] : undefined
  if (!v) return 0
  return (l.lectureTo ?? v.len) - (l.lectureFrom ?? 0)
}

/** the one link a target needs: the lecture at the point you stopped, the pyq page, or the revision video */
export function taskLink(kind: string, ch: string | undefined, watchedHours = 0): { href: string; label: string } | null {
  const l = ch ? LINKS[ch] : undefined
  if (!l) return null
  if (kind === 'lecture' && l.lecture) {
    const v = LECTURES[l.lecture]
    const t = Math.min((l.lectureFrom ?? 0) + watchedHours * 3600, (l.lectureTo ?? v.len) - 60)
    return { href: yt(v.id, t), label: t > 60 ? `lecture from ${clock(t)}` : 'lecture' }
  }
  if (kind === 'pyq' || kind === 'drill') return { href: l.pyq[0], label: 'pyqs' }
  if (kind === 'revise' || kind === 'recall' || kind === 'notes') {
    if (l.revision) return { href: yt(REVISIONS[l.revision].id), label: `revision, ${clock(REVISIONS[l.revision].len)}` }
    const tv = l.tandav?.[0]
    if (tv) return { href: yt(TANDAV[tv[0]].id, tv[1]), label: 'mahatandav section' }
    return { href: l.pyq[0], label: 'pyqs' }
  }
  return null
}
