// Edit freely: these lines rotate through the ticker and the hub.

export const LINES = [
  'Be the one who chooses. Not the one waiting around to be chosen.',
  'nobody remembers the striker who almost scored.',
  'break the loop today',
  'be greedy with marks.',
  'what if you actually tried your hardest?',
  'sure bro go open deadshot and waste ur day.',
  'if path was easy everyone would walk it, and it would lead nowhere',
  'ill take another question, and then devour it!.',
]

export interface Source {
  name: string
  url?: string
  note?: string
}

// group 0 is shown under pyqs, the rest under papers and notes. lecture and revision videos live in videos.ts.
export const SOURCES: { group: string; items: Source[] }[] = [
  {
    group: 'pyq banks',
    items: [
      { name: 'examside, jee main', url: 'https://questions.examside.com/past-years/jee/jee-main', note: 'chapterwise and shiftwise, with solutions' },
      { name: 'marks app', url: 'https://web.getmarks.app/', note: 'chapterwise pyqs with a timer and accuracy' },
    ],
  },
  {
    group: 'full shift papers',
    items: [
      { name: 'nta question paper archive', url: 'https://jeemain.nta.nic.in/document-category/archive/', note: 'official papers and keys' },
      { name: 'mathongo previous year papers', url: 'https://www.mathongo.com/iit-jee/jee-main-previous-year-question-paper', note: 'shiftwise papers with answer keys' },
    ],
  },
  {
    group: 'your material',
    items: [
      { name: 'eduniti list', url: 'https://drive.google.com/file/d/102Np_tW2VKAMvGVUpeovsLpeUYjNMQsf/view', note: 'the lectures inside the click link' },
      { name: 'pw lakshya jee 2025, physics', note: 'only for chapters the one-shots skip or teach badly' },
    ],
  },
]

export const RULES: { title: string; lines: string[] }[] = [
  {
    title: 'chapters',
    lines: [
      'every chapter ends with 25-30 chapterwise jee main pyqs, logged.',
      'under 60% accuracy, the chapter is not closed.',
      'pause and try every in-lecture pyq before the solution.',
    ],
  },
  {
    title: 'short notes',
    lines: [
      '4 pages per chapter, 5 for modern physics, electrochemistry and ionic.',
      'formulas, terms and the traps that cost you a question. no derivations.',
      'inorganic: ncert is the note. tag pyq years in the margins.',
      'd & f block: one page of exceptions only.',
    ],
  },
  {
    title: 'tests',
    lines: [
      'analysis time at least equal to test time.',
      'tag every lost mark: syllabus, formula or silly.',
      'from december, sit mocks in the 9:00 or 15:00 slot.',
    ],
  },
  {
    title: 'when you slip',
    lines: [
      'behind by one block: absorb it on sunday.',
      'behind by four or more on oct 15: biomolecules, em waves and statistics go ncert + pyqs only.',
      'oct 23 is overflow. oct 25 the syllabus is closed.',
    ],
  },
  {
    title: 'checkpoints',
    lines: [
      'dec 15: average 220+ on actual shift papers.',
      'jan 10: average 235+.',
      'miss one: protect 99.5. stop new material, double down on accuracy.',
    ],
  },
  {
    title: 'body',
    lines: ['sleep floor: 6 hours. below that you lose more than you gain.', 'the 18:00 run stays.'],
  },
]
