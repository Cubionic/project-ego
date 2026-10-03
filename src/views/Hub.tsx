import { useRef, useState } from 'react'
import { ArrowUpRight, Download, ImagePlus, Trash2, Upload } from 'lucide-react'
import { RULES, SOURCES } from '../data/content'
import { exportData, useEgo } from '../store'
import { delArt, useArtUrls } from '../lib/art'
import { studyDate } from '../lib/dates'
import { hosted, saveFile } from '../lib/platform'
import { useCloudStatus } from '../lib/cloud'
import { addArtFiles } from '../components/ArtFrame'
import { SectionTitle, Words } from '../components/ui'

export default function Hub() {
  return (
    <div className="pt-10 md:pt-14">
      <h1 className="max-w-[18ch] font-serif text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.06] tracking-[-0.025em]">
        <Words text="everything you need." />
      </h1>

      <section className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle>sources</SectionTitle>
          {SOURCES.map((g) => (
            <div key={g.group} className="mb-10">
              <h3 className="text-[13px] text-mute">{g.group}</h3>
              <ul className="mt-2">
                {g.items.map((s) => (
                  <li key={s.name} className="border-t border-line">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-4 py-3.5">
                        <span>
                          <span className="block text-[15px] group-hover:text-ego-soft">{s.name}</span>
                          {s.note ? <span className="mt-0.5 block text-[12px] text-dim">{s.note}</span> : null}
                        </span>
                        <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ego-soft" />
                      </a>
                    ) : (
                      <div className="py-3.5">
                        <span className="block text-[15px]">{s.name}</span>
                        {s.note ? <span className="mt-0.5 block text-[12px] text-dim">{s.note}</span> : null}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7">
          <SectionTitle>the rules</SectionTitle>
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {RULES.map((r) => (
              <div key={r.title}>
                <h3 className="font-serif text-[19px]">{r.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {r.lines.map((l) => (
                    <li key={l} className="border-l border-line pl-3 text-[14px] leading-relaxed text-mute">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArtBoard />

      <section className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <DataTools />
        <div>
          <SectionTitle>shortcuts</SectionTitle>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[14px]">
            {[
              ['1 to 5', 'switch between today, syllabus, progress, tests, hub'],
              ['[ and ]', 'previous and next day on today'],
              ['t', 'jump back to today'],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt>
                  <kbd className="num border border-line px-2 py-0.5 text-[12px] text-smoke">{k}</kbd>
                </dt>
                <dd className="text-mute">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}

function ArtBoard() {
  const ids = useEgo((s) => s.art)
  const setArt = useEgo((s) => s.setArt)
  const duo = useEgo((s) => s.duotone)
  const setDuo = useEgo((s) => s.setDuotone)
  const urls = useArtUrls(ids)
  const input = useRef<HTMLInputElement>(null)
  const [err, setErr] = useState('')
  return (
    <section className="mt-20">
      <SectionTitle
        aside={
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-[#5b78ff]" checked={duo} onChange={(e) => setDuo(e.target.checked)} />
            duotone
          </label>
        }
      >
        your art
      </SectionTitle>
      <p className="-mt-3 mb-6 max-w-[62ch] text-[13px] text-mute">
        up to 12 images. today shows a different one each day. files stay in this browser and are not part of the backup file.
      </p>
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
    </section>
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
      <SectionTitle>your data</SectionTitle>
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
