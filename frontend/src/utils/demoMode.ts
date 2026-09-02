/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * SIH Demo Mode & Production Integrity Controller
 *
 * Controls whether the workbench operates in:
 * - LIVE BACKEND MODE (Strict: zero silent fallbacks, surfaces 401/403/404/500/timeout)
 * - SIH DEMO MODE (Presentation: seamless offline industrial fixtures for live judging)
 */

const STORAGE_KEY = 'zenith_sih_demo_mode'

// Initial state from environment variable VITE_DEMO_MODE (defaulting to true for development/evaluation)
const envInitial = import.meta.env.VITE_DEMO_MODE !== 'false'

export const isDemoModeActive = (): boolean => {
  if (typeof window === 'undefined') return envInitial
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) {
    return stored === 'true'
  }
  return envInitial
}

export const setDemoModeActive = (active: boolean): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, active ? 'true' : 'false')
  window.dispatchEvent(new CustomEvent('zenith:demo_mode_changed', { detail: { active } }))
}

export const subscribeDemoModeChange = (callback: (active: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ active: boolean }>
    callback(customEvent.detail.active)
  }
  window.addEventListener('zenith:demo_mode_changed', handler)
  return () => window.removeEventListener('zenith:demo_mode_changed', handler)
}
