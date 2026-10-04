// When the app runs as a hosted claude.ai artifact, window.claude.use() turns on a few platform features.
// Everywhere else (npm run dev, your own hosting) window.claude is absent and the plain browser path runs.
type UseFn = (name: string) => Promise<unknown>

const use: UseFn | null = (() => {
  try {
    const c = (window as unknown as { claude?: { use?: UseFn } }).claude
    return c && typeof c.use === 'function' ? (n: string) => c.use!(n) : null
  } catch {
    return null
  }
})()

export const hosted = use != null

export async function cap<T>(name: string): Promise<T | null> {
  if (!use) return null
  try {
    return ((await use(name)) as T) ?? null
  } catch {
    return null
  }
}

/** save a text file: the viewer's save dialog when hosted, a normal download otherwise */
export async function saveFile(filename: string, text: string): Promise<'saved' | 'declined' | 'unavailable'> {
  if (hosted) {
    const dl = await cap<{ save: (r: { filename: string; data: string }) => Promise<{ status: string }> }>('downloads')
    if (!dl) return 'unavailable'
    try {
      await dl.save({ filename, data: text })
      return 'saved'
    } catch (e) {
      const code = (e as { code?: string })?.code
      return code === 'unavailable' ? 'unavailable' : 'declined'
    }
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  return 'saved'
}
