import { useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { CHECKPOINTS, CLOSE, TARGET } from '../data/plan'
import { useEgo, type TestEntry, type TestKind } from '../store'
import { diffDays, fmtShort, studyDate } from '../lib/dates'
import { LineChart } from '../components/charts'
import { SectionTitle, Words } from '../components/ui'

const KIND_NAME: Record<TestKind, string> = { allen: 'allen test', shift: 'jm shift paper', chapter: 'chapter test' }
const norm = (t: TestEntry) => Math.round(((t.p + t.c + t.m) / t.max) * 300)

function phase(today: string) {
  if (today <= CLOSE) return 'until oct 25: chapter tests on sundays, full papers start oct 24.'
  if (today <= '2026-11-15') return 'now: 2 full mocks a week, wednesday and saturday.'
  if (today <= '2026-12-31') return 'now: 3 full mocks a week, monday, wednesday and saturday.'
  if (today <= '2027-01-20') return 'now: a full mock every other day.'
  return 'no more mocks. sleep and trust the work.'
}

export default function Tests() {
  const tests = useEgo((s) => s.tests)
  const removeTest = useEgo((s) => s.removeTest)
  const toggleAnalysed = useEgo((s) => s.toggleAnalysed)
  const today = studyDate()
  const full = tests.filter((t) => t.kind !== 'chapter')
  const last5 = full.slice(-5)
  const avg = last5.length ? Math.round(last5.reduce((a, t) => a + norm(t), 0) / last5.length) : null
  const lost = full.reduce((a, t) => ({ s: a.s + t.lostSyllabus, f: a.f + t.lostFormula, x: a.x + t.lostSilly }), { s: 0, f: 0, x: 0 })
  const lostTotal = lost.s + lost.f + lost.x
  const subjAvg = (k: 'p' | 'c' | 'm') => (last5.length ? Math.round(last5.reduce((a, t) => a + (t[k] / t.max) * 300, 0) / last5.length) : null)
  const unanalysed = tests.filter((t) => !t.analysed).length

  const title = avg == null ? 'no papers yet.' : `${avg} on your last ${last5.length}.`

  return (
    <div className="pt-10 md:pt-14">
      <header className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="font-serif text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.06] tracking-[-0.025em]">
            <Words text={title} />
          </h1>
          <p className="mt-4 max-w-[60ch] text-[14px] text-mute">
            {avg == null ? `the target is ${TARGET}. log every paper, chapter tests included.` : avg >= TARGET ? `above ${TARGET}. hold it on harder shifts.` : `${TARGET - avg} marks from ${TARGET}.`} {phase(today)}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-6 self-end lg:col-span-5">
          {(['p', 'c', 'm'] as const).map((k) => (
            <div key={k} className="border-t border-line pt-3">
              <dt className="text-[12px] text-mute">{k === 'p' ? 'physics' : k === 'c' ? 'chemistry' : 'maths'}, last 5</dt>
              <dd className="mt-1 text-[26px] num">{subjAvg(k) ?? 'n/a'}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionTitle aside={<span className="num">{full.length} full papers</span>}>score, out of 300</SectionTitle>
          {full.length ? (
            <LineChart
              ariaLabel="full paper scores over time, out of 300"
              labels={full.map((t) => fmtShort(t.date))}
              series={[{ name: 'score', values: full.map(norm), tone: 'accent' }]}
              max={300}
              refs={[{ y: TARGET, label: `${TARGET}, the 99.9 line` }]}
              height={280}
            />
          ) : (
            <p className="border border-dashed border-line px-5 py-12 text-[14px] text-dim">log your first full paper and the trend starts here.</p>
          )}
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CHECKPOINTS.map((c) => {
              const d = diffDays(c.date, today)
              const hit = avg != null && avg >= c.score
              return (
                <li key={c.date} className={`border-l-2 py-1 pl-4 ${hit ? 'border-ego' : d < 0 ? 'border-rose' : 'border-line'}`}>
                  <p className="text-[14px]">
                    {fmtShort(c.date)}: average <span className="num">{c.score}+</span>
                  </p>
                  <p className="text-[12px] text-dim">{d >= 0 ? `${d} days out${hit ? ', already there' : ''}` : hit ? 'hit' : 'missed. protect 99.5, stop new material.'}</p>
                </li>
              )
            })}
          </ul>

          <div className="mt-14">
            <SectionTitle aside={lostTotal ? <span className="num">{lostTotal} marks lost</span> : undefined}>where the marks go</SectionTitle>
            {lostTotal ? (
              <>
                <div className="flex h-3 w-full overflow-hidden" aria-hidden>
                  <div className="bar-x h-full bg-ego" style={{ width: `${(lost.s / lostTotal) * 100}%` }} />
                  <div className="bar-x h-full bg-ego/50" style={{ width: `${(lost.f / lostTotal) * 100}%`, animationDelay: '120ms' }} />
                  <div className="bar-x h-full bg-mute/50" style={{ width: `${(lost.x / lostTotal) * 100}%`, animationDelay: '240ms' }} />
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-4 text-[13px]">
                  {[
                    ['syllabus', lost.s, 'bg-ego'],
                    ['forgot formula', lost.f, 'bg-ego/50'],
                    ['silly', lost.x, 'bg-mute/50'],
                  ].map(([k, v, c]) => (
                    <div key={k as string}>
                      <dt className="flex items-center gap-2 text-mute">
                        <span className={`inline-block h-2 w-2 ${c}`} aria-hidden />
                        {k}
                      </dt>
                      <dd className="mt-1 num text-[20px]">
                        {v}
                        <span className="text-[13px] text-dim"> / {Math.round(((v as number) / lostTotal) * 100)}%</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="text-[14px] text-dim">tag lost marks when you log a paper. the biggest slice decides november.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <TestForm today={today} />
        </div>
      </section>

      <section className="mt-20">
        <SectionTitle aside={unanalysed ? <span className="text-rose">{unanalysed} not analysed</span> : undefined}>every paper</SectionTitle>
        {tests.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="text-[12px] text-mute">
                <tr>
                  <th className="pb-3 font-normal">date</th>
                  <th className="pb-3 font-normal">paper</th>
                  <th className="pb-3 font-normal text-right">phy</th>
                  <th className="pb-3 font-normal text-right">chem</th>
                  <th className="pb-3 font-normal text-right">maths</th>
                  <th className="pb-3 font-normal text-right">total</th>
                  <th className="pb-3 font-normal text-right">analysed</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {[...tests].reverse().map((t) => (
                  <tr key={t.id} className="border-t border-line">
                    <td className="py-3 num text-mute">{fmtShort(t.date)}</td>
                    <td className="py-3">
                      {t.name || KIND_NAME[t.kind]}
                      <span className="block text-[12px] text-dim">{KIND_NAME[t.kind]}</span>
                    </td>
                    <td className="py-3 text-right num">{t.p}</td>
                    <td className="py-3 text-right num">{t.c}</td>
                    <td className="py-3 text-right num">{t.m}</td>
                    <td className="py-3 text-right num text-smoke">
                      {t.p + t.c + t.m}
                      <span className="text-dim">/{t.max}</span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={t.analysed}
                        onClick={() => toggleAnalysed(t.id)}
                        className={`press border px-2 py-0.5 text-[12px] ${t.analysed ? 'border-ego text-ego-soft' : 'border-rose text-rose'}`}
                      >
                        {t.analysed ? 'yes' : 'not yet'}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" aria-label={`delete ${t.name}`} onClick={() => removeTest(t.id)} className="press text-dim hover:text-rose">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[14px] text-dim">nothing logged yet.</p>
        )}
      </section>
    </div>
  )
}

function TestForm({ today }: { today: string }) {
  const addTest = useEgo((s) => s.addTest)
  const blank = { name: '', date: today, kind: 'allen' as TestKind, p: '', c: '', m: '', max: '300', ls: '', lf: '', lx: '', analysed: false }
  const [f, setF] = useState(blank)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const n = (v: string) => Math.max(0, Number(v) || 0)
  const set = (k: keyof typeof blank) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const max = n(f.max) || 300
    const total = n(f.p) + n(f.c) + n(f.m)
    if (!f.p && !f.c && !f.m) return setErr('enter at least one subject score.')
    if (total > max) return setErr(`total ${total} is more than the paper's ${max}.`)
    addTest({
      name: f.name.trim().toLowerCase(),
      date: f.date || today,
      kind: f.kind,
      p: n(f.p),
      c: n(f.c),
      m: n(f.m),
      max,
      lostSyllabus: n(f.ls),
      lostFormula: n(f.lf),
      lostSilly: n(f.lx),
      analysed: f.analysed,
    })
    setErr('')
    setOk(`logged ${total}/${max}.`)
    setF({ ...blank, kind: f.kind })
  }

  const field = (id: keyof typeof blank, label: string, extra?: Record<string, string>) => (
    <div>
      <label htmlFor={`t-${id}`} className="block text-[12px] text-mute mb-2">
        {label}
      </label>
      <input id={`t-${id}`} className="field num" inputMode="numeric" type="number" min="0" value={f[id] as string} onChange={set(id)} {...extra} />
    </div>
  )

  return (
    <form onSubmit={submit} className="border border-line bg-night/70 p-5 md:p-6 lg:sticky lg:top-24">
      <h2 className="font-serif text-[22px]">log a paper</h2>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label htmlFor="t-name" className="block text-[12px] text-mute mb-2">
            name
          </label>
          <input id="t-name" className="field" placeholder="allen major test 4" value={f.name} onChange={set('name')} />
        </div>
        <div>
          <label htmlFor="t-date" className="block text-[12px] text-mute mb-2">
            date
          </label>
          <input id="t-date" className="field" type="date" value={f.date} onChange={set('date')} />
        </div>
        <div>
          <label htmlFor="t-kind" className="block text-[12px] text-mute mb-2">
            kind
          </label>
          <select id="t-kind" className="field" value={f.kind} onChange={set('kind')}>
            <option value="allen">allen test</option>
            <option value="shift">jm shift paper</option>
            <option value="chapter">chapter test</option>
          </select>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {field('p', 'physics')}
        {field('c', 'chem')}
        {field('m', 'maths')}
        {field('max', 'out of')}
      </div>
      <p className="mt-6 text-[12px] text-mute">marks lost to</p>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {field('ls', 'syllabus')}
        {field('lf', 'formula')}
        {field('lx', 'silly')}
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-[14px]">
        <input type="checkbox" className="h-4 w-4 accent-[#5b78ff]" checked={f.analysed} onChange={(e) => setF({ ...f, analysed: e.target.checked })} />
        analysis done
      </label>
      {err ? (
        <p className="mt-4 text-[13px] text-rose" role="alert">
          {err}
        </p>
      ) : null}
      <button type="submit" className="btn solid mt-5 w-full py-3 text-[14px]">
        log paper
      </button>
      <p className="mt-3 min-h-[20px] text-[13px] text-mute" role="status">
        {ok ? <span className="flash inline-block">{ok}</span> : null}
      </p>
    </form>
  )
}
