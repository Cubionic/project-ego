# project ego

Daily JEE Main tracker: the Oct 3 to Oct 25 plan, lecture and PYQ logging, tests, streaks and progress charts.

## run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Stack: Vite, React, TypeScript, Tailwind CSS v4, Zustand (persisted to localStorage), Lucide icons. Fonts are self-hosted (DM Sans, Libre Baskerville).

## where things live

- `src/data/plan.ts`: the day-by-day plan, chapters, lecture-hour estimates, routine blocks, checkpoints. Edit lecture hours in the app (syllabus, open a chapter) or here.
- `src/data/content.ts`: ticker lines, sources, rules. Swap in your own quotes here.
- `src/store.ts`: all state and actions.
- Art you add is stored in IndexedDB in your browser, never uploaded, and is not part of the backup file.

## daily use

- The study day rolls over at 04:00, so 01:30 still counts as the day before.
- Tick targets off, log PYQs in quick log, move anything unfinished to tomorrow.
- A day counts toward the streak at 70% of its targets.
- Keys: 1 to 5 switch views, [ and ] move between days, t jumps to today.
- Download a backup from hub every Sunday.
