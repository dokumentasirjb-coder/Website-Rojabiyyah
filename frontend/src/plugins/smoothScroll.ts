import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Router } from 'vue-router'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function setupSmoothScroll(router: Router): Lenis | null {
  if (typeof window === 'undefined') return null

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!prefersReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.05,
      smoothWheel: true,
    })

    lenisInstance.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
  }

  router.afterEach((to) => {
    const isAdminRoute =
      to.path.startsWith('/admin') || to.path.startsWith('/panel-panitia')

    if (isAdminRoute) {
      lenisInstance?.stop()
      return
    }

    lenisInstance?.start()

    if (!to.hash) {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }

    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  })

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
