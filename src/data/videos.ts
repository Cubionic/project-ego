// built from the five playlists on youtube.com/@benzotropic and the eduniti physics planner (oct 4).
// nothing outside those lists, except waves (wave motion one shot) which was sent directly.
// t = start in seconds, len = video length in seconds. edit by hand freely.

export type Stamp = [t: number, label: string]
export interface Video {
  id: string
  len: number
  by: string
  stamps?: Stamp[]
}
export interface Clip {
  id: string
  len: number
  label: string
  by: string
}

/** the lecture of record for each chapter */
export const LECTURES: Record<string, Video> = {
  ac: { id: 'FImh-a0673s', len: 26490, by: 'jee wallah', stamps: [[400, "current electricity"], [565, "alternating current"], [1010, "generation of ac"], [2230, "average current"], [3508, "root mean square current"], [6528, "superposition & questions"], [8960, "heat dissipated & loss"], [9550, "battery"], [10080, "purely resistive circuit"], [11112, "purely capacitive circuit"], [14635, "purely inductor"], [15950, "rlc circuit"], [17210, "questions & pyqs"], [19896, "power supply by source and power dissipated in rlc"], [20568, "pyqs"], [21210, "resonance"], [23685, "pyqs"], [25260, "transformer"]] },
  waves: { id: '853QJObBo74', len: 27286, by: 'jee wallah', stamps: [[487, "travelling wave equation"], [2786, "wave parameters"], [3013, "wave velocity, particle velocity and slope"], [6608, "wave velocity"], [6763, "transverse wave velocity"], [8485, "longitudinal wave and longitudinal wave velocity"], [9639, "pressure wave"], [9920, "energy transfer in string"], [10308, "intensity"], [11036, "wave reflection and refraction"], [12076, "wave interference"], [21630, "resonance"], [22028, "sonometer"], [23596, "resonance tube"], [25937, "doppler's effect"]] },
  wo: { id: 'k8IyQgwDdUk', len: 18472, by: 'jee wallah', stamps: [[348, "huygens principle"], [902, "wavefront"], [1836, "wave equation"], [3910, "interference"], [5950, "young's double slit experiment"], [10175, "shape of fringes"], [13820, "polarisation of light"], [16265, "diffraction of light"]] },
  emw: { id: '8TnzQkZrztQ', len: 10655, by: 'jee wallah', stamps: [[249, "emw basics"], [2768, "maxwell equation"], [3323, "electromagnetic wave"], [6426, "pyqs"], [7216, "energy density"], [7850, "intensity"], [9488, "electromagnetic spectrum"], [10175, "poynting vector"]] },
  mp: { id: 'V76QPpoWVwA', len: 38504, by: 'jee wallah', stamps: [[360, "photon"], [751, "intensity"], [1349, "radiation pressure"], [4070, "formula sheet"], [4334, "de broglie wavelength"], [7967, "photoelectric effect"], [9807, "photoelectric effect graph"], [10730, "experimental study of photoelectric effect"], [17252, "rutherford atomic theory"], [18046, "formula sheet"], [19408, "energy level diagram"], [24988, "effect of nuclear motion"], [25900, "atomic collision"], [27565, "x-ray"], [33580, "nuclear physics"], [34542, "binding energy"], [36412, "q value of reaction"]] },
  semis: { id: 'rdnWOyqZTy4', len: 19066, by: 'jee wallah', stamps: [[225, "logic gates"], [4461, "semiconductor"], [6786, "energy bands"], [7164, "n type"], [7938, "p type"], [8446, "pn junction diode"], [8624, "resistivity and conductivity"], [9782, "pn junction diode"], [10317, "forward and reverse bias"], [12000, "junction biased"], [12402, "behavior of pn junction with bias"], [12544, "comparison between forward and reverse bias"], [14227, "rectifier"], [15000, "zener diode"], [16104, "reverse breakdown"]] },
  electro: { id: 'DRBc_9_Xj-k', len: 22933, by: 'unacademy jee nexus', stamps: [[598, "basic definitions"], [1595, "electrochemical cells"], [4873, "representation of cells"], [6611, "types of electrode"], [12970, "electrode potential"], [19638, "nernst equation"]] },
  ionic: { id: 'YNoxkyTOx-s', len: 39126, by: 'unacademy jee nexus', stamps: [[664, "acid base theories"], [2918, "self ionization of water"], [4820, "ph calculations"], [18374, "dissociation of weak acid and weak base"], [21256, "mixture of weak acids and weak bases"], [28060, "salt hydrolysis"], [35422, "buffer solutions"]] },
  dnf: { id: 'I-X4j_5FPuI', len: 20595, by: 'unacademy jee nexus', stamps: [[867, "general electronic configuration"], [2118, "physical properties of d and f block"], [2162, "ncert table data"], [6525, "general properties of d and f block elements"], [9683, "potassium dichromate"], [12718, "potassium permanganate"], [16852, "f-block elements"], [17125, "lanthanoids"], [19351, "actinoids"]] },
  salt: { id: '8rRnn4ECwXI', len: 23532, by: 'jee wallah', stamps: [[348, "salt analysis"], [1963, "types of reaction"], [3268, "precipitate dissolution by complex formation"], [4049, "table for oxidising power"], [4690, "anions"], [5754, "sodium carbonate extract"], [6127, "tests"], [9570, "brown ring test for no2"], [12618, "layer test"], [12852, "test for cations"], [15710, "group test"], [17224, "test for group - 0 & 1 cation"], [18885, "test for group - 2"], [19680, "test for cu2+"], [20515, "test for group - 3"], [20857, "test for al3+ & fe3+"], [21572, "test for group - 4"], [22615, "test for group - 5 & 6"], [22993, "charcoal cavity test"], [23223, "cobalt nitrate test"]] },
  amines: { id: 'SKHrfD34Kkc', len: 11651, by: 'jee wallah', stamps: [[290, "carbylamine reaction"], [1023, "nitrene"], [1868, "hoffmann bromamide degradation reaction"], [2530, "gabriel phthalimide amine"], [3465, "separation of amines"], [4318, "solubility & differential extraction"], [5118, "acylation"], [6128, "reaction with arylsulphonyl chloride"], [6635, "example of electrophilic aromatic substitution"], [7038, "nitration of aniline"], [7845, "reaction with nitrous acid & diazonium salts"], [8880, "retention of diazo group coupling reaction"], [9605, "reduction of nitro & amides"], [10188, "selective reduction of dinitrobenzene"]] },
  bio: { id: 'LcVNwEWJtyI', len: 19600, by: 'jee wallah', stamps: [[388, "carbohydrates"], [861, "classification of carbohydrates"], [3605, "haworth projection"], [9385, "ribose to dna"], [9866, "biological function of nucleic acid"], [11515, "enzymes & vitamins"], [14488, "amino acids"], [14748, "classification"], [16424, "classification of proteins"], [17177, "distinguish test of biomolecules"]] },
  mat: { id: '2YFQIFQmPmw', len: 23005, by: 'jee wallah', stamps: [[568, "matrix definition"], [938, "order of a matrix"], [1864, "types of matrices"], [4450, "algebra of matrices"], [7544, "properties of matrix multiplication"], [8362, "trace of a matrix questions"], [9650, "the transpose of a matrix & its properties"], [10497, "symmetric and skew symmetric matrices"], [11228, "properties of symmetric and skew symmetric matrices"], [13876, "adjoint of a matrix"], [14825, "properties of the adjoint of a matrix"], [16120, "questions & pyqs"], [17238, "inverse of a matrix"], [17698, "properties of the inverse of a matrix"], [18304, "characteristics equation"], [18540, "cayley hamilton theorem"], [19856, "types of square matrices"], [21140, "matrix method for solving linear equations"]] },
  det: { id: 'uhq_WUNlvh8', len: 20206, by: 'jee wallah', stamps: [[810, "determinant"], [1254, "minor of an element"], [1690, "cofactor of an element"], [2325, "expansion of a determinant"], [3758, "area of a triangle"], [3988, "properties of determinants"], [6982, "summation of determinants"], [8385, "properties of determinants"], [9092, "some important determinants to remember"], [14584, "differentiation of determinant"], [15487, "linear equations involving two variables"], [15894, "cramer's rule"], [15962, "cramer's rule for non-homogeneous system of equations"], [16308, "nature of solutions"], [17620, "cramer's rule for homogeneous system of equations"], [17776, "nature of solutions"], [18322, "method to express infinite solutions"], [18580, "multiplication of 2 determinants"]] },
  prob: { id: 'lWqcibMwKtk', len: 27766, by: 'jee wallah', stamps: [[309, "general terminology"], [969, "definition"], [2485, "probability using p&c"], [12300, "probability using set theory"], [16375, "independent events"], [19052, "conditional probability"], [21855, "total probability theorem"], [25789, "random variable"], [25992, "probability distribution"], [26248, "mean, variance and s.d."], [26840, "bernoulli's trial"]] },
  stats: { id: 'M0wE7kH_ojk', len: 6269, by: 'jee wallah', stamps: [] },
  complex: { id: 'Csoxo16bsqM', len: 19340, by: 'jee wallah', stamps: [[186, "section formula & distance formula"], [2242, "complex number as vectors"], [2516, "angle between two vectors"], [2689, "concept of rotation"], [5237, "multiplication by -1, i, -i, omega & -omega"], [6105, "important result"], [7856, "angle between two vectors"], [9067, "standard locus involving argument"], [11510, "standard locus involving modulus"], [12849, "understanding equations"], [13193, "pyqs"], [16201, "equation of locus"], [16693, "pyqs"], [18003, "equation of line"], [18332, "equation of circle"], [18450, "log of complex numbers"]] },
}

/** full subject videos, the source for short notes: eduniti for physics, mohit ryan sir for pc and ioc */
export const FULL: Record<string, Video & { name: string; group: string; note: string }> = {
  phys11: { id: 'oyL9yCpHxEU', name: 'formula marathon, class 11', group: 'physics', note: 'every 11th formula in one sitting', len: 14122, by: 'eduniti', stamps: [[160, "units & dimensions"], [268, "error analysis"], [401, "motion in 1d"], [594, "motion in 2d - projectile motion"], [1048, "rain man problem"], [1099, "river-swimmer problem"], [1395, "laws of motion"], [1847, "friction"], [2251, "work energy power"], [2582, "circular motion"], [3460, "center of mass"], [3909, "cons of momentum & collision"], [4945, "rotational motion"], [6578, "gravitation"], [7463, "solids or elasticity"], [7819, "fluid statics"], [8287, "fluid dynamics"], [8718, "fluid properties surface tension viscosity"], [9239, "shm"], [9891, "thermal properties"], [10231, "heat transfer conduction & radiation"], [11432, "ktg"], [11826, "thermodynamics"], [12632, "string waves"], [13444, "doppler's effect"], [13780, "organ pipes & resonance tube"]] },
  phys12: { id: 'tzI8crdu6RI', name: 'formula marathon, class 12', group: 'physics', note: 'every 12th formula in one sitting', len: 13134, by: 'eduniti', stamps: [[195, "electrostatics"], [1359, "capacitor"], [2150, "current electricity"], [3181, "mec & moving charges"], [3859, "magnets & earth's magnetism"], [4142, "magnetic properties of matter"], [5119, "emi"], [6108, "alternating current"], [6713, "ray optics"], [7822, "optical instruments"], [8278, "interference and ydse"], [8787, "diffraction and polarization"], [9205, "em waves"], [9985, "semiconductors"], [10780, "communications system"], [11198, "modern physics"]] },
  pc: { id: 'Dj85LAKltz4', name: 'physical chemistry in 200 questions', group: 'physical chemistry', note: 'question-led, chapter by chapter', len: 22570, by: 'mohit ryan, unacademy', stamps: [[861, "thermodynamics"], [3119, "equilibrium"], [4746, "electrochemistry"], [6216, "solutions"], [10355, "chemical kinetics"], [16000, "atomic structure"], [17145, "redox reaction"], [20181, "mole concept"]] },
  pcf: { id: 'D5CL6kathuU', name: 'physical chemistry formula revision', group: 'physical chemistry', note: 'formulas only', len: 10785, by: 'mohit ryan, unacademy', stamps: [] },
  ioc: { id: 'WjleOATGkcw', name: 'inorganic chemistry from basics', group: 'inorganic chemistry', note: 'bonding, coordination, periodic properties', len: 41914, by: 'mohit ryan, unacademy', stamps: [[439, "chemical bonding"], [3092, "lewis dot structure"], [7785, "hybridisation"], [11509, "valence shell electron pair repulsion (vsepr) theory"], [18337, "vbt and mot"], [19610, "molecular orbital theory"], [22006, "back bonding"], [23370, "coordination compounds"], [23701, "type of ligands"], [25012, "nomenclature of coordination compounds"], [25922, "ean rule"], [26223, "werner's theory"], [26528, "valence bond theory (vbt)"], [31193, "crystal field theory (cft)"], [32718, "organometallic compounds"], [34038, "structural isomerism"], [34533, "stereoisomerism"], [37274, "periodic properties"], [37365, "atomic radius"], [38690, "ionisation energy"], [39491, "lanthanoid and actinoid contraction in size"], [40737, "electron gain enthalpy"], [41621, "electronegativity"]] },
  ioc250: { id: 'lAPNQ4J8oXI', name: 'inorganic chemistry in 250 questions', group: 'inorganic chemistry', note: 'question-led revision', len: 24670, by: 'mohit ryan, unacademy', stamps: [] },
  oc250: { id: 'aVlN6bo65a8', name: 'organic chemistry in 250 questions', group: 'organic chemistry', note: 'question-led revision', len: 25713, by: 'unacademy jee nexus', stamps: [] },
}

/** short subject-level clips that belong to no single chapter */
export const EXTRAS: { group: string; clip: Clip }[] = [
  { group: 'inorganic chemistry', clip: { id: 'xZGT-Aioj-o', len: 1370, label: "coordination compounds in 23 minutes", by: 'simply concise' } },
  { group: 'organic chemistry', clip: { id: 'hHAONkE_TWE', len: 640, label: "goc, top pyqs of jee main 2024", by: 'simply concise' } },
]

/** eduniti physics planner: one playlist per chapter (formula revision, every year of pyq solutions, rank booster) */
export const EDUNITI: { name: string; list: string; ch: string[] }[] = [
  { name: 'kinematics', list: 'PLjvx7xqdpePLItW_yyRSUfrzSqA5ezpqL', ch: [] },
  { name: 'laws of motion', list: 'PLjvx7xqdpePIZbs8Yf8Pi34ek7MMmj9rb', ch: [] },
  { name: 'wep and circular motion', list: 'PLjvx7xqdpePIfZAomhvUbS0q8QF69SzQu', ch: [] },
  { name: 'gravitation', list: 'PLjvx7xqdpePJBciKC3lFr_d00mDQceq8s', ch: [] },
  { name: 'electrostatics', list: 'PLjvx7xqdpePL-IQ8QCmk5BpycShF0RaKO', ch: [] },
  { name: 'capacitors', list: 'PLjvx7xqdpePJyUSPmJSQK_M7W-Z-qN9iW', ch: [] },
  { name: 'current electricity', list: 'PLjvx7xqdpePJJNDrvHyZEdwu2uGohWaCU', ch: [] },
  { name: 'ktg and thermodynamics', list: 'PLjvx7xqdpePL4PBaaFvkMbALzJP3DPFQM', ch: [] },
  { name: 'shm', list: 'PLjvx7xqdpePKJBO8-qr0Im7QmJ86vZ_Rm', ch: [] },
  { name: 'moving charges, mec, magnetism', list: 'PLjvx7xqdpePL2mwAZqflTLYlAbvdLA8J4', ch: [] },
  { name: 'properties of solids', list: 'PLjvx7xqdpePL5iNvM26ZGPhVQJyHKBokr', ch: [] },
  { name: 'ray optics', list: 'PLjvx7xqdpePKE_6kKSGES5qJtCz-kd_5d', ch: [] },
  { name: 'emi', list: 'PLjvx7xqdpePKLweoAM4zkoZs02Ss6YKMR', ch: [] },
  { name: 'alternating current', list: 'PLjvx7xqdpePLqHPbozt5lLpkHvhrzecop', ch: ["ac"] },
  { name: 'fluids', list: 'PLjvx7xqdpePL2VCkyQT1KsQ1lPt7qs8fj', ch: ["fluids"] },
  { name: 'modern physics', list: 'PLjvx7xqdpePL4vTqUUyIbtg5FubHYGNFr', ch: ["mp1", "mp2"] },
  { name: 'rotational motion', list: 'PLjvx7xqdpePLNEB-VLtUhBnF5LZmoYapS', ch: ["rotation"] },
  { name: 'units, dimensions, errors, vectors', list: 'PLjvx7xqdpePJ2frgR0Q6FwVllpWUxUo_Y', ch: [] },
  { name: 'wave optics and em waves', list: 'PLjvx7xqdpePJ3lHx7uc5dSi-JqmJweDSZ', ch: ["wo", "emw"] },
  { name: 'semiconductors', list: 'PLjvx7xqdpePLhZB09b59Df7ivOAwMiRuf', ch: ["semis"] },
  { name: 'thermal properties and heat transfer', list: 'PLjvx7xqdpePJZ1hTpE-y-BKiwtdJFXLKF', ch: [] },
  { name: 'com and collision', list: 'PLjvx7xqdpePJVQvIDMa9inrxGWyi-Vnr2', ch: [] },
  { name: 'wave motion', list: 'PLjvx7xqdpePIBAIo5trSIhWP7viOOI5oD', ch: ["waves"] },
]
export const EDUNITI_MORE: { name: string; href: string; note: string }[] = [
  { name: 'pyq pdfs, 2019 to 2026', href: 'https://drive.google.com/drive/folders/1785MiemoRxcc3o6dto6DKCdEfcW70gO_', note: 'chapterwise pdfs from the planner' },
  { name: 'top pyqs of jee main', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePIhuRDZnZA49oCEALDv48b_', note: '11 videos' },
  { name: 'rank booster series 1.0', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePJCP49_Ama1H83s_9LzFkR6', note: '16 videos' },
  { name: 'jee 2027 sure shot questions', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePJD6xrZkipYKAgTioEVsjKu', note: '42 videos' },
  { name: 'experiments and instruments', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePKWv06iJ0AfFDU1rDvTyvUR', note: '9 videos' },
  { name: 'ncert booster, important lines', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePLjOBV5wgFXyFxsb4DrIbPk', note: '6 videos' },
  { name: 'short tricks', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePIDJyG3o2lXHTnwlF0bKs2-', note: '16 videos' },
  { name: 'mathematical tools', href: 'https://www.youtube.com/playlist?list=PLjvx7xqdpePKicYw7eBFh5RKR6pAdrkGe', note: '4 videos' },
]

/** your five playlists, in full */
export const PLAYLISTS: { name: string; list: string }[] = [
  { name: 'jee physics', list: 'PLOhy7gH-Nr7U' },
  { name: 'jee pc', list: 'PLePG024ZPZfA' },
  { name: 'jee ioc', list: 'PLBUjfLPfdxOY' },
  { name: 'jee oc', list: 'PLPI1pyxjfTKY' },
  { name: 'jee maths', list: 'PLAJHrCtmXNP0' },
]

/** everything that belongs to one chapter */
export interface ChapterLinks {
  lecture?: string
  /** a slice of the lecture video, for chapters that share one video */
  lectureFrom?: number
  lectureTo?: number
  /** jumps into a full subject video, for short notes */
  notes?: [video: string, t: number, label: string][]
  revision?: Clip[]
  /** video solutions of past papers */
  pyqVideos?: Clip[]
  /** examside chapter pages */
  pyq: string[]
}

const ex = (s: string) => `https://questions.examside.com/past-years/jee/jee-main/${s}`

export const LINKS: Record<string, ChapterLinks> = {
  ac: { lecture: 'ac', notes: [['phys12', 6108, "alternating current"]], revision: [{ id: '74dTY-pzM_o', len: 1291, label: "formulae and concept revision", by: 'eduniti' }, { id: 'lihju4FBiMY', len: 7816, label: "emi and ac one shot", by: 'lakshya jee' }], pyqVideos: [{ id: '-nziUCMWzUw', len: 5923, label: '2026 jan', by: 'eduniti' }, { id: 'xfA-0wdEOgM', len: 2585, label: '2026 april', by: 'eduniti' }, { id: '42FKYf-aDcw', len: 3243, label: '2025 jan', by: 'eduniti' }, { id: 'ldS9rr4ZFXM', len: 1666, label: '2025 april', by: 'eduniti' }, { id: 'jv3tlnbJK80', len: 6467, label: '2024 jan', by: 'eduniti' }, { id: 'T_HFi-4C2YY', len: 3399, label: '2024 april', by: 'eduniti' }, { id: '0jX0Kk3ZXqU', len: 4706, label: '2023 jan', by: 'eduniti' }, { id: 'CDd_vm9LL18', len: 3393, label: '2023 april', by: 'eduniti' }, { id: 'Z6CXuupiyD8', len: 1552, label: '2022 july', by: 'eduniti' }, { id: 'fveppz_7yds', len: 3627, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/alternating-current')] },
  waves: { lecture: 'waves', notes: [['phys11', 12632, "string waves"], ['phys11', 13444, "doppler's effect"], ['phys11', 13780, "organ pipes, resonance tube"]], revision: [{ id: 'mZWNmH19wDQ', len: 2123, label: "string waves, part 1", by: 'eduniti' }, { id: 'PDGq4d3xA6c', len: 2486, label: "string waves, part 2", by: 'eduniti' }, { id: 'fB7pfJ77za8', len: 1061, label: "organ pipes, resonance tube", by: 'eduniti' }, { id: '9-BxOaamnwg', len: 1355, label: "doppler's effect", by: 'eduniti' }, { id: 'XScK3ppvmkA', len: 959, label: "beats", by: 'eduniti' }], pyqVideos: [{ id: 'KS_eBCyjcyI', len: 4916, label: '2026 jan', by: 'eduniti' }, { id: 'msMNNH2DMvE', len: 2815, label: '2026 april', by: 'eduniti' }, { id: 'so0mY61bbCs', len: 5574, label: '2025 jan', by: 'eduniti' }, { id: 'g_cvnCXZqIo', len: 2633, label: '2025 april', by: 'eduniti' }, { id: 'nUrE9MJ5Ayo', len: 3342, label: '2024 jan', by: 'eduniti' }, { id: 'oUP3NfwRTDk', len: 1560, label: '2024 april', by: 'eduniti' }, { id: 'DkuwVMGyi0I', len: 4924, label: '2023 jan', by: 'eduniti' }, { id: 'cLhrH7l0mro', len: 3119, label: '2023 april', by: 'eduniti' }, { id: 'p7_70Xm1ou0', len: 1475, label: '2022 july', by: 'eduniti' }, { id: 'jvr_AXxKnx0', len: 2669, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/waves')] },
  wo: { lecture: 'wo', notes: [['phys12', 8278, "interference and ydse"], ['phys12', 8787, "diffraction and polarisation"]], revision: [{ id: 'SYY3KE7nnFc', len: 2097, label: "wave optics in 35 minutes", by: 'mohit tyagi' }, { id: 'LG5nlE8XTeI', len: 1533, label: "interference and ydse revision", by: 'eduniti' }, { id: 'ymMyyJGGqnY', len: 1051, label: "diffraction and polarisation revision", by: 'eduniti' }], pyqVideos: [{ id: 'SlH7himP4Ts', len: 3287, label: '2026 jan', by: 'eduniti' }, { id: 'nR9hgZf4YqI', len: 3478, label: '2026 april', by: 'eduniti' }, { id: 'XVDN6QVbo0o', len: 3612, label: '2025 jan', by: 'eduniti' }, { id: 'XSkQDgRLzB4', len: 2697, label: '2025 april', by: 'eduniti' }, { id: 'D2v9dBRnK-0', len: 5004, label: '2024 jan', by: 'eduniti' }, { id: 'LAHZBBOGW9o', len: 3034, label: '2024 april', by: 'eduniti' }, { id: '-uduEE8fCws', len: 3894, label: '2023 jan', by: 'eduniti' }, { id: 'Udyir2FQI74', len: 2263, label: '2023 april', by: 'eduniti' }, { id: 'TxvAHplp9d4', len: 1591, label: '2022 july', by: 'eduniti' }, { id: '5S5t5AZZtrA', len: 4027, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/wave-optics')] },
  emw: { lecture: 'emw', notes: [['phys12', 9205, "em waves"]], revision: [{ id: 'bcVXgEkyQZY', len: 1217, label: "em waves quick revision", by: 'eduniti' }], pyqVideos: [{ id: 'SlH7himP4Ts', len: 3287, label: '2026 jan', by: 'eduniti' }, { id: 'nR9hgZf4YqI', len: 3478, label: '2026 april', by: 'eduniti' }, { id: '42FKYf-aDcw', len: 3243, label: '2025 jan', by: 'eduniti' }, { id: 'XSkQDgRLzB4', len: 2697, label: '2025 april', by: 'eduniti' }, { id: 'D2v9dBRnK-0', len: 5004, label: '2024 jan', by: 'eduniti' }, { id: 'TTLFmsMajLU', len: 2655, label: '2024 april', by: 'eduniti' }, { id: '-uduEE8fCws', len: 3894, label: '2023 jan', by: 'eduniti' }, { id: 'Udyir2FQI74', len: 2263, label: '2023 april', by: 'eduniti' }, { id: 'TxvAHplp9d4', len: 1591, label: '2022 july', by: 'eduniti' }, { id: 'X_-VTSlbOX8', len: 4303, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/electromagnetic-waves')] },
  mp1: { lecture: 'mp', lectureTo: 33580, notes: [['phys12', 11198, "modern physics"]], revision: [{ id: '9VKUnE3mpHk', len: 700, label: "atomic structure revision", by: 'eduniti' }, { id: '24oTQp84jrk', len: 519, label: "photoelectric effect revision", by: 'eduniti' }, { id: '0zoR_saMAQY', len: 487, label: "dual nature revision", by: 'eduniti' }, { id: 'dSHXdzX7NX0', len: 854, label: "x rays revision", by: 'eduniti' }, { id: '3SrwCpagLAs', len: 160, label: "2 page formula sheet", by: 'eduniti' }, { id: 'Ti00ZV0-CTc', len: 6625, label: "modern physics one shot", by: 'lakshya jee' }], pyqVideos: [{ id: 'jcFJsyEyasg', len: 4068, label: '2026 jan', by: 'eduniti' }, { id: 'uxb_qhCWoiQ', len: 3457, label: '2026 april', by: 'eduniti' }, { id: '1lawRL8f2ac', len: 3186, label: '2025 jan', by: 'eduniti' }, { id: 'hfsawlkI7pQ', len: 2595, label: '2025 april', by: 'eduniti' }, { id: 'bNlqpaMnu3o', len: 6330, label: '2024 jan', by: 'eduniti' }, { id: 'sNddGDmE0Wg', len: 5686, label: '2024 april', by: 'eduniti' }, { id: 'VHXuyzh92QM', len: 4530, label: '2023 jan', by: 'eduniti' }, { id: 'EKrcQW96j_0', len: 6078, label: '2023 april', by: 'eduniti' }, { id: 'a86hTkFJIzs', len: 2999, label: '2022 july', by: 'eduniti' }, { id: 'h4GmnwNPpdo', len: 3335, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/dual-nature-of-radiation'), ex('physics/atoms-and-nuclei')] },
  mp2: { lecture: 'mp', lectureFrom: 33580, notes: [['phys12', 11198, "modern physics"]], revision: [{ id: 'AdX3YBhQyog', len: 392, label: "radioactivity revision", by: 'eduniti' }, { id: 'VDWqVahGixc', len: 861, label: "nuclear physics revision", by: 'eduniti' }, { id: '3SrwCpagLAs', len: 160, label: "2 page formula sheet", by: 'eduniti' }], pyqVideos: [{ id: 'jcFJsyEyasg', len: 4068, label: '2026 jan', by: 'eduniti' }, { id: 'uxb_qhCWoiQ', len: 3457, label: '2026 april', by: 'eduniti' }, { id: '1lawRL8f2ac', len: 3186, label: '2025 jan', by: 'eduniti' }, { id: 'hfsawlkI7pQ', len: 2595, label: '2025 april', by: 'eduniti' }, { id: 'bNlqpaMnu3o', len: 6330, label: '2024 jan', by: 'eduniti' }, { id: 'sNddGDmE0Wg', len: 5686, label: '2024 april', by: 'eduniti' }, { id: 'VHXuyzh92QM', len: 4530, label: '2023 jan', by: 'eduniti' }, { id: 'EKrcQW96j_0', len: 6078, label: '2023 april', by: 'eduniti' }, { id: 'a86hTkFJIzs', len: 2999, label: '2022 july', by: 'eduniti' }, { id: 'h4GmnwNPpdo', len: 3335, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/atoms-and-nuclei')] },
  semis: { lecture: 'semis', notes: [['phys12', 9985, "semiconductors"]], revision: [{ id: '_A2JomQ7-50', len: 1531, label: "zener diode", by: 'eduniti' }, { id: 'pZdQAzLbFTo', len: 867, label: "logic gates, de morgan", by: 'eduniti' }], pyqVideos: [{ id: 'UZQBHNUPJwc', len: 5707, label: '2026 jan', by: 'eduniti' }, { id: 'sNTMEEnkFuk', len: 1786, label: '2026 april', by: 'eduniti' }, { id: '1lawRL8f2ac', len: 3186, label: '2025 jan', by: 'eduniti' }, { id: 'XSkQDgRLzB4', len: 2697, label: '2025 april', by: 'eduniti' }, { id: 'bNlqpaMnu3o', len: 6330, label: '2024 jan', by: 'eduniti' }, { id: 'TTLFmsMajLU', len: 2655, label: '2024 april', by: 'eduniti' }, { id: 'hMikBSjmX3A', len: 2588, label: '2023 jan', by: 'eduniti' }, { id: 'uqx6yF3-DkM', len: 2527, label: '2023 april', by: 'eduniti' }, { id: 'Oain4AYKKqM', len: 1041, label: '2022 july', by: 'eduniti' }, { id: 'FWReHgY3m4I', len: 3376, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/electronic-devices')] },
  electro: { lecture: 'electro', notes: [['pc', 4746, "electrochemistry"]], revision: [{ id: 'uns_BPBldTI', len: 1214, label: "electrochemistry in 20 minutes", by: 'unacademy jee nexus' }], pyqVideos: [{ id: '0DpKMBNC9Sc', len: 7150, label: "all pyqs 2019 to 2024, part 1", by: 'unacademy jee prime' }], pyq: [ex('chemistry/electrochemistry')] },
  ionic: { lecture: 'ionic', notes: [['pc', 3119, "equilibrium"]], revision: [{ id: 'NbCZeJRIa-U', len: 4771, label: "ionic equilibrium in 80 minutes", by: 'jee wallah' }], pyqVideos: [{ id: 'D38vPx8LWjU', len: 4623, label: "13 years of advanced pyqs", by: 'unacademy jee nexus' }], pyq: [ex('chemistry/ionic-equilibrium')] },
  dnf: { lecture: 'dnf', notes: [['ioc', 39491, "lanthanoid and actinoid contraction"]], revision: [{ id: '9UH5tMr6dkQ', len: 635, label: "d and f block in 10 minutes", by: 'simply concise' }], pyqVideos: [{ id: 'jJEMx4aPYa8', len: 3261, label: "important questions", by: 'lakshya jee' }], pyq: [ex('chemistry/d-and-f-block-elements')] },
  salt: { lecture: 'salt', revision: [{ id: 'owqv4bzJtvc', len: 961, label: "salt analysis in 16 minutes", by: 'simply concise' }, { id: 'b5HGqj42-_w', len: 3673, label: "salt analysis speed revision", by: 'unacademy jee nexus' }], pyq: [ex('chemistry/salt-analysis')] },
  amines: { lecture: 'amines', pyq: [ex('chemistry/compounds-containing-nitrogen')] },
  bio: { lecture: 'bio', pyq: [ex('chemistry/biomolecules')] },
  mat: { lecture: 'mat', pyq: [ex('mathematics/matrices-and-determinants')] },
  det: { lecture: 'det', pyq: [ex('mathematics/matrices-and-determinants')] },
  v3d: { pyq: [ex('mathematics/vector-algebra'), ex('mathematics/3d-geometry')] },
  prob: { lecture: 'prob', revision: [{ id: '-DTuVgWCIWU', len: 3911, label: "probability in 60 minutes", by: 'jee wallah' }], pyq: [ex('mathematics/probability')] },
  stats: { lecture: 'stats', revision: [{ id: 'bQSkS8cQIRw', len: 1989, label: "statistics in 30 minutes", by: 'mathongo' }], pyq: [ex('mathematics/statistics')] },
  aod: { pyq: [ex('mathematics/application-of-derivatives')] },
  pnc: { revision: [{ id: 'GXHs5Cr73O4', len: 4400, label: "pnc in 70 minutes", by: 'jee wallah' }], pyq: [ex('mathematics/permutations-and-combinations')] },
  conics: { pyq: [ex('mathematics/parabola'), ex('mathematics/ellipse'), ex('mathematics/hyperbola')] },
  binomial: { pyq: [ex('mathematics/binomial-theorem')] },
  fluids: { notes: [['phys11', 7819, "fluid statics"], ['phys11', 8287, "fluid dynamics"], ['phys11', 8718, "surface tension, viscosity"]], revision: [{ id: 'RFKx9B9yo3M', len: 2349, label: "fluid statics revision", by: 'eduniti' }, { id: 'Y717vQpUEJQ', len: 1877, label: "fluid dynamics revision", by: 'eduniti' }, { id: 'V8xUWWK2oT0', len: 1918, label: "surface tension, viscosity", by: 'eduniti' }], pyqVideos: [{ id: 'D1wofc2RS3I', len: 3900, label: '2026 jan', by: 'eduniti' }, { id: 'BxeYUcZyJMY', len: 2275, label: '2026 april', by: 'eduniti' }, { id: '-oEcWgUlmYo', len: 5419, label: '2025 jan', by: 'eduniti' }, { id: 'LBVX9N7Rwo4', len: 3975, label: '2025 april', by: 'eduniti' }, { id: 'S-hGzPy_qF4', len: 4395, label: '2024 jan', by: 'eduniti' }, { id: '6EnpHqe7uos', len: 3875, label: '2024 april', by: 'eduniti' }, { id: 'fo6QRNPqtrU', len: 6373, label: '2023 jan', by: 'eduniti' }, { id: 'bhtqzEqEA00', len: 3908, label: '2023 april', by: 'eduniti' }, { id: 'Wi8my8TULqk', len: 1991, label: '2022 july', by: 'eduniti' }, { id: 'K_Ck9Jjnlao', len: 5754, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/properties-of-matter')] },
  rotation: { notes: [['phys11', 4945, "rotational motion"]], revision: [{ id: 'O6j1mLp06XI', len: 3159, label: "moi, torque, equilibrium", by: 'eduniti' }, { id: 'OHni1DRdfAQ', len: 2982, label: "angular momentum, collision", by: 'eduniti' }, { id: 'qugIqfYRCrk', len: 2768, label: "rolling, toppling", by: 'eduniti' }], pyqVideos: [{ id: 'PpLci4MYylM', len: 5343, label: '2026 jan', by: 'eduniti' }, { id: 'ARTuAIfPMGc', len: 2636, label: '2026 april', by: 'eduniti' }, { id: 'WLZa2XzJMtA', len: 9185, label: '2025 jan', by: 'eduniti' }, { id: 'ioFD1Vo_Xww', len: 4170, label: '2025 april', by: 'eduniti' }, { id: 'Pwr3GodXpnU', len: 7426, label: '2024 jan', by: 'eduniti' }, { id: 'eWO4lS1UAOM', len: 4219, label: '2024 april', by: 'eduniti' }, { id: 'AtGYL4a5n2M', len: 2846, label: '2023 april', by: 'eduniti' }, { id: 'j5fzPfmtXpE', len: 3383, label: '2023 jan', by: 'eduniti' }, { id: 'I-F6U94Esu0', len: 1192, label: '2022 july', by: 'eduniti' }, { id: 'K_Ck9Jjnlao', len: 5754, label: '2022 june', by: 'eduniti' }], pyq: [ex('physics/rotational-motion')] },
  bonding: { notes: [['ioc', 439, "chemical bonding"], ['ioc', 7785, "hybridisation"], ['ioc', 19610, "molecular orbital theory"]], revision: [{ id: 'iW9E-u3Op4s', len: 1486, label: "chemical bonding in 25 minutes", by: 'simply concise' }], pyq: [ex('chemistry/chemical-bonding-and-molecular-structure')] },
  equilibrium: { notes: [['pc', 3119, "equilibrium"]], pyq: [ex('chemistry/chemical-equilibrium')] },
  kinetics: { notes: [['pc', 10355, "chemical kinetics"]], pyq: [ex('chemistry/chemical-kinetics-and-nuclear-chemistry')] },
  thermo: { notes: [['pc', 861, "thermodynamics"]], pyq: [ex('chemistry/thermodynamics')] },
  complex: { lecture: 'complex', revision: [{ id: 'LEP1B1qpxAg', len: 7432, label: "complex numbers in 120 minutes", by: 'jee wallah' }], pyq: [ex('mathematics/complex-numbers')] },
  integration: { pyq: [ex('mathematics/indefinite-integrals'), ex('mathematics/definite-integration')] },
}

export const yt = (id: string, t = 0) => `https://www.youtube.com/watch?v=${id}${t > 0 ? `&t=${Math.floor(t)}s` : ''}`
export const ytList = (list: string) => `https://www.youtube.com/playlist?list=${list}`

/** 2:05:44 style */
export function clock(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

/** the one link a target needs: the lecture where you stopped, the pyq page, or the first revision */
export function taskLink(kind: string, ch: string | undefined, watchedHours = 0): { href: string; label: string } | null {
  const l = ch ? LINKS[ch] : undefined
  if (!l) return null
  if (kind === 'lecture' && l.lecture) {
    const v = LECTURES[l.lecture]
    const t = Math.min((l.lectureFrom ?? 0) + watchedHours * 3600, (l.lectureTo ?? v.len) - 60)
    return { href: yt(v.id, t), label: t > 60 ? `lecture from ${clock(t)}` : 'lecture' }
  }
  if (kind === 'pyq' || kind === 'drill') return { href: l.pyq[0], label: 'pyqs' }
  if (kind === 'notes') {
    const n = l.notes?.[0]
    if (n) return { href: yt(FULL[n[0]].id, n[1]), label: `notes source, ${FULL[n[0]].name}` }
  }
  if (kind === 'revise' || kind === 'recall' || kind === 'notes') {
    const r = l.revision?.[0]
    if (r) return { href: yt(r.id), label: `${r.label}, ${clock(r.len)}` }
    const n = l.notes?.[0]
    if (n) return { href: yt(FULL[n[0]].id, n[1]), label: FULL[n[0]].name }
    return { href: l.pyq[0], label: 'pyqs' }
  }
  return null
}
