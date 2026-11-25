export type SyncDomain = 'settings' | 'news' | 'tabarukan'

const CHANNEL_NAME = 'rojabiyyah_sync_v1'
let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME)
  }
  return channel
}

export function broadcastSync(domain: SyncDomain) {
  try {
    getChannel()?.postMessage({ domain, ts: Date.now() })
  } catch {
    // ignore
  }
}

export function onSyncBroadcast(domain: SyncDomain, callback: () => void) {
  const ch = getChannel()
  if (!ch) return
  ch.addEventListener('message', (event) => {
    if (event.data?.domain === domain) {
      callback()
    }
  })
}
