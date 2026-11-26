import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

const LENIS_CLASSES = ['lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-locked']

const tickerCallback = (time: number) => {
  lenisInstance?.raf(time * 1000)
}

function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin') || path.startsWith('/panel-panitia')
}

function cleanLenisDomState() {
  if (typeof document === 'undefined') return
  for (const el of [document.documentElement, document.body]) {
    if (!el) continue
    el.classList.remove(...LENIS_CLASSES)
    el.style.overflow = ''
    el.style.overflowY = ''
  }
}

function destroyLenis() {
  gsap.ticker.remove(tickerCallback)
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
  cleanLenisDomState()
}

function initLenis() {
  if (typeof window === 'undefined' || lenisInstance) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  lenisInstance = new Lenis({
    duration: 1.05,
    smoothWheel: true,
  })

  lenisInstance.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)
}

function handleRouteChange(to: RouteLocationNormalizedLoaded) {
  if (isAdminRoute(to.path)) {
    destroyLenis()
    return
  }

  initLenis()
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
}

export function setupSmoothScroll(router: Router): Lenis | null {
  if (typeof window === 'undefined') return null

  router.isReady().then(() => {
    handleRouteChange(router.currentRoute.value)
  })

  router.afterEach((to) => {
    handleRouteChange(to)
  })

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
