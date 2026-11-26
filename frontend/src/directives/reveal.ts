import type { Directive } from 'vue'
import gsap from 'gsap'

export interface RevealOptions {
  y?: number
  x?: number
  delay?: number
  duration?: number
}

interface RevealCleanup {
  observer?: IntersectionObserver
  safetyTimer?: ReturnType<typeof setTimeout>
}

const cleanupMap = new WeakMap<HTMLElement, RevealCleanup>()

function forceVisible(el: HTMLElement) {
  gsap.killTweensOf(el)
  el.style.opacity = '1'
  el.style.visibility = 'visible'
  el.style.transform = 'none'
}

export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding) {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      forceVisible(el)
      return
    }

    const opts = binding.value ?? {}
    const y = opts.y ?? 24
    const x = opts.x ?? 0
    const delay = opts.delay ?? 0
    const duration = opts.duration ?? 0.65

    const rect = el.getBoundingClientRect()
    const isAlreadyInViewport = rect.top < window.innerHeight * 0.92

    if (isAlreadyInViewport) {
      // Jangan pernah menyembunyikan elemen yang sudah ada di viewport saat mounted
      gsap.fromTo(
        el,
        {
          opacity: 1,
          visibility: 'visible',
          y: Math.min(y, 12),
        },
        {
          opacity: 1,
          y: 0,
          duration: Math.min(duration, 0.45),
          delay,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        }
      )
      return
    }

    gsap.set(el, { autoAlpha: 0, y, x })

    let revealed = false
    const cleanup: RevealCleanup = {}

    const revealNow = () => {
      if (revealed) return
      revealed = true
      if (cleanup.safetyTimer) {
        clearTimeout(cleanup.safetyTimer)
        cleanup.safetyTimer = undefined
      }
      if (cleanup.observer) {
        cleanup.observer.disconnect()
        cleanup.observer = undefined
      }

      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        delay,
        duration,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      })
    }

    if ('IntersectionObserver' in window) {
      cleanup.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              revealNow()
              break
            }
          }
        },
        { threshold: 0.08 }
      )
      cleanup.observer.observe(el)
    } else {
      revealNow()
    }

    // Pengaman maksimal 1.2 detik agar elemen tidak pernah tertahan di opacity: 0
    cleanup.safetyTimer = setTimeout(() => {
      if (!revealed) {
        revealed = true
        cleanup.observer?.disconnect()
        cleanup.observer = undefined
        forceVisible(el)
      }
    }, 1200)

    cleanupMap.set(el, cleanup)
  },
  unmounted(el) {
    const cleanup = cleanupMap.get(el)
    if (cleanup) {
      cleanup.observer?.disconnect()
      if (cleanup.safetyTimer) {
        clearTimeout(cleanup.safetyTimer)
      }
      cleanupMap.delete(el)
    }
    gsap.killTweensOf(el)
  },
}
