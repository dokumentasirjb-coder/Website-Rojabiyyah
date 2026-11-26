import type { Directive } from 'vue'

export interface RevealOptions {
  y?: number
  x?: number
  delay?: number
  duration?: number
}

let globalObserver: IntersectionObserver | null = null
const timerMap = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

function markVisible(el: HTMLElement) {
  el.classList.add('is-visible')
  const existing = timerMap.get(el)
  if (existing) {
    clearTimeout(existing)
    timerMap.delete(el)
  }
}

function getGlobalObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  if (!globalObserver) {
    globalObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const target = entry.target as HTMLElement
            markVisible(target)
            globalObserver?.unobserve(target)
          }
        }
      },
      { threshold: 0.1 }
    )
  }
  return globalObserver
}

export const reveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el) {
    if (typeof window === 'undefined') return

    el.classList.add('reveal-item')

    const rect = el.getBoundingClientRect()
    const observer = getGlobalObserver()

    if (rect.top < window.innerHeight * 0.9 || !observer) {
      markVisible(el)
      return
    }

    observer.observe(el)

    // Safety guard: ensure element is never stuck transparent
    const safetyTimer = setTimeout(() => {
      markVisible(el)
      observer.unobserve(el)
    }, 600)
    timerMap.set(el, safetyTimer)
  },
  unmounted(el) {
    globalObserver?.unobserve(el)
    const timer = timerMap.get(el)
    if (timer) {
      clearTimeout(timer)
      timerMap.delete(el)
    }
  },
}

export const vReveal = reveal
export default reveal
