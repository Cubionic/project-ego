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

export const SOURCES: { group: string; items: Source[] }[] = [
  {
    group: 'lectures',
    items: [
      { name: 'Organic Chemistry', url: 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3jWivnsFTb5uvzpHZK3qvDj' },
      { name: 'Physics', url: 'https://www.youtube.com/playlist?list=PLOhy7gH-Nr7U' },
      { name: 'Physical Chemistry', url: 'https://www.youtube.com/playlist?list=PLePG024ZPZfA' },
      { name: 'IOC', url: 'https://www.youtube.com/playlist?list=PLBUjfLPfdxOY' },
      { name: 'Eduniti List', url: 'https://drive.google.com/file/d/102Np_tW2VKAMvGVUpeovsLpeUYjNMQsf/view', note: 'the lectures inside the click link' },
      { name: 'pw lakshya jee 2025, physics', note: 'only for chapters manzil skips or teaches badly' },
    ],
  },
  {
    group: 'practice',
    items: [
      { name: 'chapterwise jee main pyqs', note: 'a pyq bank app such as quizrr. the end of every chapter.' },
      { name: 'allen module, exercise 1', note: 'skip in october. pyqs give more marks per hour for main.' },
      { name: 'pc exercise 4', note: 'november to january, only chapters under 80% pyq accuracy' },
      { name: 'actual jm shift papers', note: 'your core mocks. save the latest 2026 shifts for january.' },
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
