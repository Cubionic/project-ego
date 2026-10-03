import { useRef, useState, type DragEvent } from 'react'
import { Contrast, ImagePlus, Shuffle } from 'lucide-react'
import { useEgo } from '../store'
import { newArtId, putArt, useArtUrls } from '../lib/art'

const MAX_BYTES = 15 * 1024 * 1024

export async function addArtFiles(files: FileList | File[]): Promise<string | null> {
  const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
  if (!list.length) return 'that file is not an image. use png, jpg, webp or gif.'
  const tooBig = list.find((f) => f.size > MAX_BYTES)
  if (tooBig) return `${tooBig.name} is over 15 mb. pick a smaller one.`
  const ids: string[] = []
  for (const f of list) {
    const id = newArtId()
    await putArt(id, f)
    ids.push(id)
  }
  const { art, setArt } = useEgo.getState()
  setArt([...art, ...ids].slice(-12))
  return null
}

function Pitch() {
  // penalty box, six-yard box, spot and arc, drawn once on load
  return (
    <svg viewBox="0 0 400 500" className="pitch absolute inset-0 h-full w-full" fill="none" stroke="var(--color-line)" strokeWidth="1.5" aria-hidden>
      <path pathLength={1} d="M40 0 V500" style={{ ['--d' as string]: 0 }} />
      <path pathLength={1} d="M360 0 V500" style={{ ['--d' as string]: 80 }} />
      <path pathLength={1} d="M90 0 V170 H310 V0" stroke="var(--color-mute)" style={{ ['--d' as string]: 200 }} />
      <path pathLength={1} d="M150 0 V60 H250 V0" style={{ ['--d' as string]: 420 }} />
      <path pathLength={1} d="M155 170 A62 62 0 0 0 245 170" stroke="var(--color-mute)" style={{ ['--d' as string]: 600 }} />
      <circle pathLength={1} cx="200" cy="118" r="3" stroke="var(--color-ego)" style={{ ['--d' as string]: 900 }} />
      <path pathLength={1} d="M0 420 H400" style={{ ['--d' as string]: 300 }} />
      <path pathLength={1} d="M140 420 A60 60 0 0 1 260 420" style={{ ['--d' as string]: 700 }} />
    </svg>
  )
}

export function ArtFrame({ seed }: { seed: number }) {
  const ids = useEgo((s) => s.art)
  const duo = useEgo((s) => s.duotone)
  const setDuo = useEgo((s) => s.setDuotone)
  const urls = useArtUrls(ids)
  const [shift, setShift] = useState(0)
  const [over, setOver] = useState(false)
  const [err, setErr] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const cur = ids.length ? ids[(seed + shift) % ids.length] : null
  const src = cur ? urls[cur] : undefined

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setErr((await addArtFiles(files)) ?? '')
  }
  const drop = (e: DragEvent) => {
    e.preventDefault()
    setOver(false)
    onFiles(e.dataTransfer.files)
  }

  return (
    <figure
      className={`relative aspect-[4/5] w-full overflow-hidden border bg-night transition-colors ${over ? 'border-ego' : 'border-line'}`}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      {src ? (
        <>
          <img
            key={cur}
            src={src}
            alt="your art"
            className={`art-drift absolute inset-0 h-full w-full object-cover view-enter ${duo ? 'grayscale contrast-[1.15]' : ''}`}
          />
          {duo ? (
            <>
              <div className="absolute inset-0 bg-ego/80 mix-blend-color" aria-hidden />
              <div className="absolute inset-0 bg-ego/15 mix-blend-multiply" aria-hidden />
              <div className="absolute inset-0 bg-night mix-blend-lighten" aria-hidden />
            </>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden />
        </>
      ) : (
        <>
          <Pitch />
          <figcaption className="absolute bottom-6 right-6 flex max-w-[62%] flex-col items-end text-right md:bottom-8 md:right-8">
            <p className="font-serif text-[22px] leading-snug">put your striker here.</p>
            <p className="mt-2 max-w-[28ch] text-[13px] text-mute">drop a png, jpg or gif. it stays on this device.</p>
            <button type="button" onClick={() => input.current?.click()} className="btn mt-5 inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[14px]">
              <ImagePlus size={16} /> add art
            </button>
          </figcaption>
        </>
      )}
      {src ? (
        <div className="absolute right-3 top-3 flex gap-1.5">
          {ids.length > 1 ? (
            <button type="button" aria-label="next image" onClick={() => setShift((v) => v + 1)} className="press grid h-9 w-9 place-items-center border border-line bg-ink/70 text-mute hover:text-smoke">
              <Shuffle size={15} />
            </button>
          ) : null}
          <button
            type="button"
            aria-label={duo ? 'show original colours' : 'apply duotone'}
            aria-pressed={duo}
            onClick={() => setDuo(!duo)}
            className={`press grid h-9 w-9 place-items-center border bg-ink/70 ${duo ? 'border-ego text-ego-soft' : 'border-line text-mute hover:text-smoke'}`}
          >
            <Contrast size={15} />
          </button>
          <button type="button" aria-label="add art" onClick={() => input.current?.click()} className="press grid h-9 w-9 place-items-center border border-line bg-ink/70 text-mute hover:text-smoke">
            <ImagePlus size={15} />
          </button>
        </div>
      ) : null}
      {err ? <p className="absolute inset-x-6 top-6 text-[13px] text-rose">{err}</p> : null}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
    </figure>
  )
}
