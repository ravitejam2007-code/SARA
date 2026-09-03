import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  Shield,
  Bell,
  Search,
  LogOut,
  Terminal,
  Activity,
  User,
  AlertTriangle,
  LogIn,
} from 'lucide-react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useEnclave } from '@/hooks/useEnclave'
import { isDemoModeActive, setDemoModeActive, subscribeDemoModeChange } from '@/utils/demoMode'

interface HeaderProps {
  onToggleMobile: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isSessionExpired, dismissSessionExpired, simulateSessionExpired } = useAuth()
  const { status } = useEnclave()
  const [demoMode, setDemoMode] = useState<boolean>(isDemoModeActive())

  useEffect(() => {
    return subscribeDemoModeChange((active) => setDemoMode(active))
  }, [])

  const handleToggleDemoMode = () => {
    const next = !demoMode
    setDemoMode(next)
    setDemoModeActive(next)
  }

  // Format breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentTitle = pathSegments.length > 0
    ? pathSegments[0].replace('-', ' ').toUpperCase()
    : 'DASHBOARD'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ebebeb] px-4 lg:px-6 flex items-center justify-between font-mono">
        {/* Left Section: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            onClick={onToggleMobile}
            aria-label="Toggle navigation drawer"
            className="lg:hidden p-2 rounded-[6px] text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] focus-ring"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Industrial Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#8f8f8f]">
            <span className="hidden sm:inline text-[#8f8f8f]">SARA</span>
            <span className="hidden sm:inline text-[#d4d4d4]">/</span>
            <span className="hidden md:inline text-[#8f8f8f]">WORKBENCH</span>
            <span className="hidden md:inline text-[#d4d4d4]">/</span>
            <span className="text-[#171717] font-semibold tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#171717]" />
              {currentTitle}
            </span>
          </div>
        </div>

        {/* Center Section: Telemetry & Air-Gap Posture */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-[#8f8f8f]">LATENCY:</span>
            <span className="text-[#171717] font-bold">4.2ms</span>
            <span className="text-[#d4d4d4]">|</span>
            <span className="text-[#8f8f8f]">INFERENCE:</span>
            <span className="text-emerald-700 font-bold">100% LOCAL (CPU)</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            AIR-GAP: {status.airGapVerified ? 'SECURE' : 'UNVERIFIED'}
          </span>
        </div>

        {/* Right Section: Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Shortcut */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-xs text-[#8f8f8f]">
            <Search className="w-3.5 h-3.5 text-[#8f8f8f]" />
            <span>Search commands...</span>
            <kbd className="px-1.5 py-0.5 rounded-[4px] bg-white text-[10px] text-[#4d4d4d] border border-[#ebebeb]">
              Ctrl + K
            </kbd>
          </div>

          {/* SIH Demo Mode Toggle Pill */}
          <button
            type="button"
            onClick={handleToggleDemoMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider transition-colors cursor-pointer ${
              demoMode
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="Click to toggle between SIH Presentation Demo Mode and Live FastAPI Backend Mode"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                demoMode ? 'bg-amber-600' : 'bg-emerald-600 animate-pulse'
              }`}
            />
            <span>{demoMode ? 'SIH DEMO MODE' : 'LIVE BACKEND'}</span>
          </button>

          {/* Simulate Session Expiry Button (for testing Requirement 10) */}
          <button
            onClick={simulateSessionExpired}
            className="hidden lg:flex items-center gap-1 px-2 py-1 rounded border border-border text-[10px] text-text-muted hover:text-amber-400 hover:border-amber-700/60 transition-colors"
            title="Simulate token expiration for testing"
          >
            TEST EXPIRY
          </button>

          {/* Security Notification Indicator */}
          <button
            className="relative p-2 rounded-[6px] text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors"
            title="Security Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          {/* User Identity Pill */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#ebebeb]">
              <div className="h-8 w-8 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[#171717]">
                <User className="w-4 h-4" />
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#171717]">
                    {user.callsign}
                  </span>
                  <Shield className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-mono font-bold text-[#8f8f8f] uppercase">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Terminate Sovereign Session (Logout)"
                className="p-1.5 rounded-[6px] text-[#8f8f8f] hover:text-red-600 hover:bg-red-50 transition-colors ml-1 focus-ring cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs px-3 py-1.5 rounded-[6px] bg-[#171717] hover:bg-black text-white font-medium shadow-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Session Expired Alert Modal (Requirement 10) */}
      <Modal
        isOpen={isSessionExpired}
        onClose={dismissSessionExpired}
        title="Sovereign Session Expired"
        description="Cryptographic lease token has lapsed or been invalidated"
        size="sm"
        showCloseButton={false}
      >
        <ModalBody className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded bg-amber-950/30 border border-amber-800/50 text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <p className="text-xs leading-relaxed">
              Your hardware enclave session token has expired. In accordance with zero-trust security policies,
              all active cryptographic handles have been severed. Please re-authenticate to continue.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<LogIn className="w-4 h-4" />}
            onClick={() => {
              dismissSessionExpired()
              navigate('/login')
            }}
          >
            RE-AUTHENTICATE TERMINAL
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Header
