// Hosted only: mirror the tracker into the viewer's private db document so it follows them across devices.
// The browser copy (zustand persist) stays the first source; this keeps a second one in their account.
import { useSyncExternalStore } from 'react'
import { exportData, useEgo } from '../store'
import { cap } from './platform'

type Status = 'local' | 'connecting' | 'synced' | 'saving' | 'error'
let state: { status: Status; detail: string } = { status: 'local', detail: '' }
const subs = new Set<() => void>()
const setStatus = (status: Status, detail = '') => {
  state = { status, detail }
  subs.forEach((f) => f())
}
export const useCloudStatus = () =>
  useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => state,
  )

const STAMP = 'project-ego-changed-at'
const readStamp = () => {
  try {
    return Number(localStorage.getItem(STAMP)) || 0
  } catch {
    return 0
  }
}
const writeStamp = (t: number) => {
  try {
    localStorage.setItem(STAMP, String(t))
  } catch {
    /* memory only */
  }
}
const device = Math.random().toString(36).slice(2, 10)

interface Body {
  savedAt: number
  device: string
  data: Record<string, unknown>
}
interface Snap {
  exists: boolean
  data(): Record<string, unknown> | undefined
  metadata?: { hasPendingWrites?: boolean }
}
interface DocRef {
  get(): Promise<Snap>
  set(d: Record<string, unknown>): Promise<void>
  onSnapshot(next: (s: Snap) => void, err?: (e: unknown) => void): () => void
}

const payload = () => {
  const { art: _art, ...rest } = exportData() // art stays per device
  void _art
  return rest as unknown as Record<string, unknown>
}

let started = false
export async function startCloudSync() {
  if (started) return
  started = true
  const [db, user] = await Promise.all([cap<{ doc(p: string): DocRef }>('db'), cap<{ id(): Promise<string | null> }>('user')])
  if (!db || !user) return
  let id: string | null = null
  try {
    id = await user.id()
  } catch {
    id = null
  }
  if (!id) return
  setStatus('connecting')
  const ref = db.doc(`data/users/${id}/ego`)
  let applying = false
  let writing = false
  let dirty = false
  let dead = false
  let lastSeen = 0
  let timer = 0

  const apply = (body: Body) => {
    applying = true
    useEgo.getState().importAll(body.data)
    applying = false
    lastSeen = body.savedAt
    writeStamp(body.savedAt)
  }

  const stop = (code?: string) => {
    if (code === 'revoked' || code === 'not_granted' || code === 'invalid_argument' || code === 'capability_disabled') {
      dead = true
      setStatus('local', 'this view cannot save to your account, so logs stay in this browser.')
      return true
    }
    return false
  }

  const flush = async () => {
    if (dead) return
    if (writing) {
      dirty = true
      return
    }
    writing = true
    dirty = false
    const body: Body = { savedAt: Date.now(), device, data: payload() }
    try {
      if (JSON.stringify(body).length > 250_000) {
        setStatus('error', 'the synced copy is full. download a backup and wipe old logs.')
      } else {
        setStatus('saving')
        await ref.set(body as unknown as Record<string, unknown>)
        lastSeen = body.savedAt
        writeStamp(body.savedAt)
        setStatus('synced')
      }
    } catch (e) {
      if (!stop((e as { code?: string })?.code)) setStatus('error', 'sync paused. changes are kept in this browser and retry on the next edit.')
    }
    writing = false
    if (dirty) flush()
  }

  try {
    const snap = await ref.get()
    const body = snap.exists ? (snap.data() as unknown as Body) : null
    if (body?.data && body.savedAt > readStamp()) apply(body)
    else if (body && readStamp() > body.savedAt) await flush()
    else if (!body && readStamp() > 0) await flush()
    if (!dead && state.status !== 'error') setStatus('synced')
  } catch (e) {
    if (!stop((e as { code?: string })?.code)) setStatus('error', 'could not reach your account. logs are kept in this browser.')
  }
  if (dead) return

  useEgo.subscribe(() => {
    if (applying || dead) return
    writeStamp(Date.now())
    window.clearTimeout(timer)
    timer = window.setTimeout(flush, 1200)
  })

  ref.onSnapshot(
    (snap) => {
      if (!snap.exists || snap.metadata?.hasPendingWrites) return
      const body = snap.data() as unknown as Body
      if (!body?.data || body.device === device || body.savedAt <= lastSeen) return
      apply(body)
    },
    () => {},
  )
}
