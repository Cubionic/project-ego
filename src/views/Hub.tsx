import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, ChevronDown, Download, ImagePlus, Trash2, Upload } from 'lucide-react'
import { RULES, SOURCES } from '../data/content'
import { BLOCKS, CHAPTERS, NEW_CHAPTERS, SUBJECT_NAME, type ChapterDef, type Subject } from '../data/plan'
import { EXTRAS, LECTURES, LINKS, REVISIONS, TANDAV, clock, taskLink, yt, type Stamp } from '../data/videos'
import { exportData, useEgo } from '../store'
import { delArt, useArtUrls } from '../lib/art'
import { accOf, pctOf } from '../lib/derive'
import { fmtHours, minutesIntoStudyDay, studyDate } from '../lib/dates'
import { hosted, saveFile } from '../lib/platform'
import { useCloudStatus } from '../lib/cloud'
import { addArtFiles } from '../components/ArtFrame'
import { Words, accTone } from '../components/ui'

const SUBJECTS: Subject[] = ['phys', 'chem', 'math']
const GROUP_TAG: Record<ChapterDef['group'], string> = { new: 'this month', weak: 'weak 11th', backlog: 'notes backlog' }
const TANDAV_ORDER = ['phys11', 'phys12', 'pc', 'ioc', 'oc', 'math11', 'math12']
const SECTIONS = [
  ['lectures', 'lectures'],
  ['notes', 'short notes'],
  ['revision', 'revision'],
  ['pyqs', 'pyqs'],
  ['papers', 'papers'],
  ['tools', 'art and backups'],
] as const

export default function Hub() {
  const chapters = useEgo((s) => s.chapters)
  const left = NEW_CHAPTERS.reduce((a, c) => a + Math.max(0, (chapters[c.id]?.hours ?? 0) - (chapters[c.id]?.watched ?? 0)), 0)
  const artCount = useEgo((s) => s.art.length)
  const now = subjectNow()
  const resume = useMemo(() => {
    for (const c of NEW_CHAPTERS) {
      if (c.subject !== now || !LINKS[c.id]?.lecture) continue
      const st = chapters[c.id]
      if (!st || st.closedOn || st.watched >= st.hours) continue
      const link = taskLink('lecture', c.id, st.watched)
      if (link) return { ch: c, link }
    }
    return null
  }, [chapters, now])
  const jump = (id: string) => document.getElementById(`hub-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const active = useActiveSection(SECTIONS.map(([id]) => `hub-${id}`))
  const chipBar = useRef<HTMLElement>(null)
  useEffect(() => {
    const bar = chipBar.current
    const chip = bar?.querySelector<HTMLElement>('[aria-current]')
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <div className="pt-10 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.06] tracking-[-0.025em]">
          <Words text="the library." />
        </h1>
        <dl className="grid w-full max-w-[560px] grid-cols-3 gap-6">
          <Stat label="lecture left" value={`${fmtHours(Math.round(left * 10) / 10)}h`} sub={`${fmtHours(Math.round(left * 15) / 10)}h at 1.5x`} />
          <div className="col-span-2 border-t border-line pt-3">
            <dt className="text-[12px] text-mute">resume, {SUBJECT_NAME[now]}</dt>
            {resume ? (
              <dd className="mt-1.5">
                <Ext href={resume.link.href}>
                  {resume.ch.name}, {resume.link.label === 'lecture' ? 'from the start' : resume.link.label.replace('lecture ', '')}
                </Ext>
              </dd>
            ) : (
              <dd className="mt-1 text-[14px] text-mute">every linked {SUBJECT_NAME[now]} lecture is watched.</dd>
            )}
          </div>
        </dl>
      </header>

      <nav ref={chipBar} aria-label="hub sections" className="sticky top-16 z-20 -mx-4 mt-8 flex gap-1.5 overflow-x-auto border-b border-line bg-ink px-4 py-2.5 md:mx-0 md:px-0">
        {SECTIONS.map(([id, name]) => {
          const on = active === `hub-${id}`
          return (
            <button
              key={id}
              type="button"
              onClick={() => jump(id)}
              aria-current={on ? 'true' : undefined}
              className={`press min-h-8 shrink-0 border px-3 text-[13px] ${on ? 'border-ego text-smoke' : 'border-line text-mute hover:border-ego hover:text-smoke'}`}
            >
              {name}
            </button>
          )
        })}
      </nav>

      <Section id="lectures" title="lectures" aside="chapter one-shots. the resume link starts where your watched hours end.">
        {SUBJECTS.map((s) => (
          <LectureFold key={s} subject={s} open={s === now} />
        ))}
      </Section>

      <Section id="notes" title="short notes" aside="mahatandav 2026, pw jee. a whole subject per video. marked parts are in your plan.">
        {TANDAV_ORDER.map((k) => (
          <TandavFold key={k} k={k} />
        ))}
      </Section>

      <Section id="revision" title="revision" aside="full-chapter revisions, 20 to 100 minutes, and question marathons.">
        {SUBJECTS.map((s) => (
          <RevisionFold key={s} subject={s} />
        ))}
        <Fold title="question marathons" meta={`${EXTRAS.length} videos`}>
          <ul>
            {EXTRAS.map((x) => (
              <Row key={x.video.id} name={x.name} sub={`${x.note}, ${x.video.by}`}>
                <Ext href={yt(x.video.id)}>{clock(x.video.len)}</Ext>
              </Row>
            ))}
          </ul>
        </Fold>
      </Section>

      <Section id="pyqs" title="pyqs" aside="examside chapter pages: every jee main shift, with solutions. blue marks chapters under 60% in your quick log.">
        {SUBJECTS.map((s) => (
          <PyqFold key={s} subject={s} />
        ))}
        <Fold title="pyq banks" meta={`${SOURCES[0].items.length} sites`}>
          <SourceList items={SOURCES[0].items} />
        </Fold>
      </Section>

      <Section id="papers" title="papers and notes" aside="full shift papers for mock days, and your own material.">
        {SOURCES.slice(1).map((g) => (
          <Fold key={g.group} title={g.group} meta={`${g.items.length} ${g.items.length === 1 ? 'link' : 'links'}`}>
            <SourceList items={g.items} />
          </Fold>
        ))}
      </Section>

      <Section id="tools" title="art, backups, rules" aside="your images, your data file, and the plan's rules.">
        <Fold title="your art" meta={`${artCount} of 12`}>
          <ArtBoard />
        </Fold>
        <Fold title="backups" meta="download every sunday">
          <DataTools />
        </Fold>
        <Fold title="the rules" meta={`${RULES.length} sets`}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {RULES.map((r) => (
              <div key={r.title}>
                <h3 className="text-[14px] text-smoke">{r.title}</h3>
                <ul className="mt-2 space-y-1.5">
                  {r.lines.map((l) => (
                    <li key={l} className="border-l border-line pl-3 text-[13px] leading-relaxed text-mute">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Fold>
      </Section>
      <p className="mt-6 text-[12px] text-mute">
        keys: <kbd className="num border border-line px-1.5 text-smoke">1</kbd> to <kbd className="num border border-line px-1.5 text-smoke">5</kbd> switch views,{' '}
        <kbd className="num border border-line px-1.5 text-smoke">[</kbd> <kbd className="num border border-line px-1.5 text-smoke">]</kbd> change day,{' '}
        <kbd className="num border border-line px-1.5 text-smoke">t</kbd> today.
      </p>
    </div>
  )
}

/* ---------- building blocks ---------- */

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="text-[12px] text-mute">{label}</dt>
      <dd className="mt-1 num text-[26px] leading-tight">{value}</dd>
      <dd className="num text-[12px] text-dim">{sub}</dd>
    </div>
  )
}

function Section({ id, title, aside, children }: { id: string; title: string; aside: string; children: ReactNode }) {
  return (
    <section id={`hub-${id}`} className="mt-14 max-w-[920px] scroll-mt-32">
      <h2 className="font-serif text-[26px] leading-[1.15] tracking-[-0.01em] md:text-[30px]">{title}</h2>
      <p className="mt-1 mb-4 max-w-[70ch] text-[13px] text-mute">{aside}</p>
      <div className="border-b border-line">{children}</div>
    </section>
  )
}

function Fold({ title, meta, children, open }: { title: ReactNode; meta?: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="fold border-t border-line" open={open || undefined}>
      <summary className="flex min-h-12 items-center gap-4 py-2 hover:text-ego-soft">
        <span className="text-[16px]">{title}</span>
        <span className="ml-auto text-right num text-[12px] text-mute">{meta}</span>
        <ChevronDown size={16} className="chev shrink-0 text-dim" aria-hidden />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  )
}

function Ext({ href, children, quiet }: { href: string; children: ReactNode; quiet?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-8 items-center gap-1 whitespace-nowrap border px-2.5 text-[13px] num ${quiet ? 'border-line text-mute hover:border-ego hover:text-smoke' : 'border-ego/60 text-ego-soft hover:border-ego hover:text-smoke'}`}
    >
      {children}
      <ArrowUpRight size={13} aria-hidden />
    </a>
  )
}

function Row({ name, sub, children }: { name: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/60 py-2.5">
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-[14px] text-smoke">{name}</p>
        {sub ? <p className="mt-0.5 text-[12px] text-mute">{sub}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </li>
  )
}

function StampGrid({ id, stamps, mark }: { id: string; stamps: Stamp[]; mark?: Set<number> }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
      {stamps.map(([t, label]) => {
        const m = mark?.has(t)
        return (
          <li key={t}>
            <a href={yt(id, t)} target="_blank" rel="noreferrer" className="group flex min-h-8 items-baseline gap-3 py-1 text-[13px]">
              <span className={`num w-[4.2rem] shrink-0 ${m ? 'text-ego-soft' : 'text-mute'}`}>{clock(t)}</span>
              <span className={`group-hover:text-ego-soft ${m ? 'text-smoke' : 'text-mute'}`}>
                {m ? <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-2px] bg-ego" aria-label="in your plan" /> : null}
                {label}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function SourceList({ items }: { items: { name: string; url?: string; note?: string }[] }) {
  return (
    <ul>
      {items.map((s) => (
        <Row key={s.name} name={s.name} sub={s.note}>
          {s.url ? <Ext href={s.url} quiet>open</Ext> : null}
        </Row>
      ))}
    </ul>
  )
}

/* ---------- sections ---------- */

function LectureFold({ subject, open }: { subject: Subject; open?: boolean }) {
  const chapters = useEgo((s) => s.chapters)
  const list = NEW_CHAPTERS.filter((c) => c.subject === subject)
  const leftOf = (c: ChapterDef) => Math.max(0, (chapters[c.id]?.hours ?? 0) - (chapters[c.id]?.watched ?? 0))
  const left = list.reduce((a, c) => a + leftOf(c), 0)
  return (
    <Fold
      open={open}
      title={SUBJECT_NAME[subject]}
      meta={
        <>
          {fmtHours(Math.round(left * 10) / 10)}h left <span className="text-dim">/ {fmtHours(Math.round(left * 15) / 10)}h at 1.5x</span>
        </>
      }
    >
      <ul>
        {list.map((c) => {
          const st = chapters[c.id]
          const l = LINKS[c.id]
          const v = l?.lecture ? LECTURES[l.lecture] : undefined
          const lt = leftOf(c)
          const resume = taskLink('lecture', c.id, st?.watched ?? 0)
          const stamps = v?.stamps?.filter(([t]) => t >= (l?.lectureFrom ?? 0) && t < (l?.lectureTo ?? Infinity))
          return (
            <li key={c.id} className="border-t border-line/60 py-2.5 first:border-t-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1 basis-48">
                  <p className={`text-[14px] ${st?.closedOn ? 'text-mute' : 'text-smoke'}`}>{c.name}</p>
                  <p className="mt-0.5 num text-[12px] text-mute">
                    {fmtHours(st?.hours ?? c.hours)}h long,{' '}
                    {lt > 0 ? (
                      <>
                        <span className="text-smoke">{fmtHours(Math.round(lt * 100) / 100)}h left</span>, {fmtHours(Math.round(lt * 150) / 100)}h at 1.5x
                      </>
                    ) : (
                      'watched'
                    )}
                    {v ? `, ${v.by}` : ''}
                  </p>
                </div>
                {v && resume && lt > 0 ? <Ext href={resume.href}>{resume.label}</Ext> : v ? <Ext href={yt(v.id, l?.lectureFrom)} quiet>lecture</Ext> : <span className="text-[12px] text-dim">no link yet</span>}
              </div>
              {v && stamps?.length ? (
                <details className="fold mt-1">
                  <summary className="inline-flex min-h-8 items-center gap-1.5 text-[13px] text-mute hover:text-ego-soft">
                    {stamps.length} topics <ChevronDown size={13} className="chev" aria-hidden />
                  </summary>
                  <div className="pt-1 pb-2">
                    <StampGrid id={v.id} stamps={stamps} />
                  </div>
                </details>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Fold>
  )
}

function TandavFold({ k }: { k: string }) {
  const v = TANDAV[k]
  const mark = useMemo(() => {
    const m = new Set<number>()
    for (const l of Object.values(LINKS)) for (const [vid, t] of l.tandav ?? []) if (vid === k) m.add(t)
    return m
  }, [k])
  return (
    <Fold
      title={v.name}
      meta={
        <>
          {clock(v.len)} <span className="text-dim">/ {v.stamps?.length ?? 0} parts{mark.size ? `, ${mark.size} in plan` : ''}</span>
        </>
      }
    >
      <div className="mb-3">
        <Ext href={yt(v.id)} quiet>
          whole video
        </Ext>
      </div>
      <StampGrid id={v.id} stamps={v.stamps ?? []} mark={mark} />
    </Fold>
  )
}

function RevisionFold({ subject }: { subject: Subject }) {
  const list = CHAPTERS.filter((c) => c.subject === subject && (LINKS[c.id]?.revision || LINKS[c.id]?.tandav?.length))
  return (
    <Fold title={SUBJECT_NAME[subject]} meta={`${list.length} chapters`}>
      <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
        {list.map((c) => {
          const l = LINKS[c.id]
          const r = l.revision ? REVISIONS[l.revision] : undefined
          return (
            <Row key={c.id} name={c.name} sub={c.group === 'new' ? undefined : GROUP_TAG[c.group]}>
              {r ? <Ext href={yt(r.id)}>revision {clock(r.len)}</Ext> : null}
              {l.tandav?.map(([vid, t, label]) => (
                <Ext key={`${vid}${t}`} href={yt(TANDAV[vid].id, t)} quiet>
                  {l.tandav!.length > 1 ? label : 'mahatandav'} {clock(t)}
                </Ext>
              ))}
            </Row>
          )
        })}
      </ul>
    </Fold>
  )
}

function PyqFold({ subject }: { subject: Subject }) {
  const pyq = useEgo((s) => s.pyq)
  const acc = useMemo(() => accOf(pyq), [pyq])
  const list = CHAPTERS.filter((c) => c.subject === subject && LINKS[c.id])
  const done = list.reduce((a, c) => a + (acc[c.id]?.att ?? 0), 0)
  return (
    <Fold title={SUBJECT_NAME[subject]} meta={`${list.length} chapters, ${done} logged`}>
      <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
        {list.map((c) => {
          const a = acc[c.id]
          const p = pctOf(a)
          const pages = LINKS[c.id].pyq
          return (
            <Row
              key={c.id}
              name={c.name}
              sub={
                c.group === 'new' && p == null ? undefined : (
                  <>
                    {c.group === 'new' ? '' : GROUP_TAG[c.group]}
                    {c.group !== 'new' && p != null ? ', ' : ''}
                    {p != null ? <span className={accTone(p)}>{`${p}% on ${a!.att}`}</span> : null}
                  </>
                )
              }
            >
              {pages.map((href) => (
                <Ext key={href} href={href} quiet={p == null || p >= 60}>
                  {pages.length > 1 ? href.split('/').pop()!.replace(/-/g, ' ') : 'pyqs'}
                </Ext>
              ))}
            </Row>
          )
        })}
      </ul>
    </Fold>
  )
}

/* ---------- art and data, unchanged ---------- */

function ArtBoard() {
  const ids = useEgo((s) => s.art)
  const setArt = useEgo((s) => s.setArt)
  const duo = useEgo((s) => s.duotone)
  const setDuo = useEgo((s) => s.setDuotone)
  const urls = useArtUrls(ids)
  const input = useRef<HTMLInputElement>(null)
  const [err, setErr] = useState('')
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[62ch] text-[13px] text-mute">up to 12 images. today shows a different one each day. files stay in this browser and are not part of the backup file.</p>
        <label className="flex min-h-8 cursor-pointer items-center gap-2 text-[13px] text-mute">
          <input type="checkbox" className="h-4 w-4 accent-[#5b78ff]" checked={duo} onChange={(e) => setDuo(e.target.checked)} />
          duotone
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {ids.map((id) => (
          <figure key={id} className="group relative aspect-[4/5] overflow-hidden border border-line bg-night">
            {urls[id] ? <img src={urls[id]} alt="" className={`h-full w-full object-cover ${duo ? 'grayscale' : ''}`} /> : null}
            <button
              type="button"
              aria-label="remove image"
              onClick={() => {
                delArt(id)
                setArt(ids.filter((x) => x !== id))
              }}
              className="press absolute right-2 top-2 grid h-8 w-8 place-items-center border border-line bg-ink/80 text-mute opacity-100 hover:text-rose md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </figure>
        ))}
        {ids.length < 12 ? (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="press grid aspect-[4/5] place-items-center border border-dashed border-line text-[13px] text-dim hover:border-ego hover:text-ego-soft"
          >
            <span className="flex flex-col items-center gap-2">
              <ImagePlus size={18} />
              add
            </span>
          </button>
        ) : null}
      </div>
      {err ? <p className="mt-3 text-[13px] text-rose">{err}</p> : null}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={async (e) => {
          if (e.target.files?.length) setErr((await addArtFiles(e.target.files)) ?? '')
          e.target.value = ''
        }}
      />
    </div>
  )
}

function DataTools() {
  const importAll = useEgo((s) => s.importAll)
  const resetAll = useEgo((s) => s.resetAll)
  const input = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [armed, setArmed] = useState(false)

  const cloud = useCloudStatus()
  const download = async () => {
    const r = await saveFile(`project-ego-backup-${studyDate()}.json`, JSON.stringify(exportData(), null, 2))
    setMsg(r === 'saved' ? 'backup saved.' : r === 'declined' ? 'backup not saved.' : 'saving files is not available here.')
  }
  const syncLine =
    cloud.status === 'synced' || cloud.status === 'saving'
      ? 'logs sync to your claude account, so this page shows the same data on your phone and laptop. art stays on each device.'
      : cloud.status === 'connecting'
        ? 'connecting to your account.'
        : cloud.detail ||
          (hosted
            ? 'everything is saved in this browser.'
            : 'everything is saved in this browser automatically.')

  return (
    <div>
      <p className={`max-w-[60ch] text-[13px] ${cloud.status === 'error' ? 'text-rose' : 'text-mute'}`}>{syncLine} download a backup every sunday so a cleared cache never costs you a month.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={download} className="btn inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[14px]">
          <Download size={16} /> save backup
        </button>
        <button type="button" onClick={() => input.current?.click()} className="btn inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[14px]">
          <Upload size={16} /> restore backup
        </button>
        <button
          type="button"
          onClick={() => {
            if (!armed) {
              setArmed(true)
              setMsg('press again to wipe every log. art is kept.')
              return
            }
            resetAll()
            setArmed(false)
            setMsg('all logs wiped.')
          }}
          onBlur={() => setArmed(false)}
          className={`btn inline-flex items-center gap-2 border px-4 py-2.5 text-[14px] ${armed ? 'border-rose text-rose' : 'border-line text-mute'}`}
        >
          <Trash2 size={16} /> {armed ? 'confirm wipe' : 'wipe logs'}
        </button>
      </div>
      <p className="mt-3 min-h-[20px] text-[13px] text-mute" role="status">
        {msg}
      </p>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          try {
            const ok = importAll(JSON.parse(await file.text()))
            setMsg(ok ? 'backup restored.' : 'that file is not a project ego backup.')
          } catch {
            setMsg('that file could not be read. pick the .json backup.')
          }
        }}
      />
    </div>
  )
}

/** id of the section whose top has passed under the sticky bars */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const pick = () => {
      let cur: string | null = null
      for (const el of els) if (el.getBoundingClientRect().top < 160) cur = el.id
      setActive(cur)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    return () => window.removeEventListener('scroll', pick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

/** the subject of the block running now, or the next one: its lecture fold opens first */
function subjectNow(): Subject {
  const m = minutesIntoStudyDay()
  const order: Record<string, Subject> = { b1: 'math', b2: 'phys', b4: 'chem' }
  const b = BLOCKS.find((x) => order[x.key] && m < x.end) ?? BLOCKS[0]
  return order[b.key] ?? 'math'
}
