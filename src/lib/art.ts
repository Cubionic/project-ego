// Your own art lives in IndexedDB on this device. Nothing is uploaded anywhere.
import { useEffect, useState } from 'react'

const DB = 'project-ego-art'
const STORE = 'art'
const mem = new Map<string, Blob>()
let dbp: Promise<IDBDatabase | null> | null = null

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((res) => {
    try {
      const req = indexedDB.open(DB, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => res(req.result)
      req.onerror = () => res(null)
    } catch {
      res(null)
    }
  })
}
const db = () => (dbp ??= openDb())

export async function putArt(id: string, blob: Blob) {
  mem.set(id, blob)
  const d = await db()
  if (!d) return
  await new Promise<void>((r) => {
    try {
      const tx = d.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(blob, id)
      tx.oncomplete = () => r()
      tx.onerror = () => r()
    } catch {
      r()
    }
  })
}

export async function getArt(id: string): Promise<Blob | undefined> {
  if (mem.has(id)) return mem.get(id)
  const d = await db()
  if (!d) return undefined
  return new Promise((r) => {
    try {
      const q = d.transaction(STORE).objectStore(STORE).get(id)
      q.onsuccess = () => {
        if (q.result) mem.set(id, q.result as Blob)
        r(q.result as Blob | undefined)
      }
      q.onerror = () => r(undefined)
    } catch {
      r(undefined)
    }
  })
}

export async function delArt(id: string) {
  mem.delete(id)
  const d = await db()
  if (!d) return
  try {
    d.transaction(STORE, 'readwrite').objectStore(STORE).delete(id)
  } catch {
    /* nothing to clean */
  }
}

export const newArtId = () => `art-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export function useArtUrls(ids: string[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const key = ids.join('|')
  useEffect(() => {
    let alive = true
    const made: string[] = []
    Promise.all(ids.map(async (id) => [id, await getArt(id)] as const)).then((pairs) => {
      if (!alive) return
      const next: Record<string, string> = {}
      for (const [id, blob] of pairs) {
        if (!blob) continue
        const u = URL.createObjectURL(blob)
        made.push(u)
        next[id] = u
      }
      setUrls(next)
    })
    return () => {
      alive = false
      made.forEach((u) => URL.revokeObjectURL(u))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return urls
}
