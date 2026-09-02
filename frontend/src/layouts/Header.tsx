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
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useEnclave } from '@/hooks/useEnclave'
import { isDemoModeActive, setDemoModeActive, subscribeDemoModeChange } from '@/utils/demoMode'
import type { UserRole } from '@/types'

interface HeaderProps {
  onToggleMobile: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, logout, isSessionExpired, dismissSessionExpired, simulateSessionExpired } = useAuth()
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

  const roleColors: Record<UserRole, { badge: 'info' | 'success' | 'amber' | 'default'; border: string }> = {
    Admin: { badge: 'info', border: 'border-cyan-500/40 text-cyan-400' },
    Engineer: { badge: 'info', border: 'border-cyan-500/40 text-cyan-400' },
    Manager: { badge: 'amber', border: 'border-amber-500/40 text-amber-400' },
    Auditor: { badge: 'success', border: 'border-emerald-500/40 text-emerald-400' },
  }

  const activeRoleConfig = role ? roleColors[role] : roleColors.Admin

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-border/90 px-4 lg:px-6 flex items-center justify-between font-mono">
        {/* Left Section: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            onClick={onToggleMobile}
            aria-label="Toggle navigation drawer"
            className="lg:hidden p-2 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated focus-ring"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Industrial Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="hidden sm:inline text-text-muted">ZENITH</span>
            <span className="hidden sm:inline text-border-strong">/</span>
            <span className="hidden md:inline text-text-muted">WORKBENCH</span>
            <span className="hidden md:inline text-border-strong">/</span>
            <span className="text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-500" />
              {currentTitle}
            </span>
          </div>
        </div>

        {/* Center Section: Telemetry & Air-Gap Posture */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface border border-border text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-text-muted">LATENCY:</span>
            <span className="text-text-primary font-bold">14ms</span>
            <span className="text-border-strong">|</span>
            <span className="text-text-muted">THROUGHPUT:</span>
            <span className="text-cyan-400 font-bold">4.2 kTok/s</span>
          </div>

          <Badge variant="success" size="sm" dot>
            AIR-GAP: {status.airGapVerified ? 'SECURE' : 'UNVERIFIED'}
          </Badge>
        </div>

        {/* Right Section: Actions & User Callsign */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Shortcut Trigger */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded bg-surface/80 border border-border text-xs text-text-muted">
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <span>Search commands...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated text-[10px] text-text-secondary border border-border">
              Ctrl + K
            </kbd>
          </div>

          {/* SIH Demo Mode Toggle Pill */}
          <button
            type="button"
            onClick={handleToggleDemoMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono font-bold tracking-wider transition-colors cursor-pointer ${
              demoMode
                ? 'bg-amber-950/70 border-amber-600/70 text-amber-300 hover:bg-amber-900/70'
                : 'bg-emerald-950/70 border-emerald-600/70 text-emerald-300 hover:bg-emerald-900/70'
            }`}
            title="Click to toggle between SIH Presentation Demo Mode and Live FastAPI Backend Mode"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                demoMode ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
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
            className="relative p-2 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            title="Security Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-surface-sunken" />
          </button>

          {/* User Identity Pill */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border">
              <div className={`h-8 w-8 rounded bg-surface-elevated border flex items-center justify-center ${activeRoleConfig.border}`}>
                <User className="w-4 h-4" />
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-text-primary">
                    {user.callsign}
                  </span>
                  <Shield className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant={activeRoleConfig.badge} size="sm" className="text-[9px] py-0 px-1">
                    {user.role.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Terminate Sovereign Session (Logout)"
                className="p-1.5 rounded text-text-muted hover:text-rose-400 hover:bg-rose-950/40 transition-colors ml-1 focus-ring cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold"
            >
              LOGIN
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
