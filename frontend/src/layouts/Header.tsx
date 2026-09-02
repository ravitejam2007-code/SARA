import React from 'react'
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
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useEnclave } from '@/hooks/useEnclave'

interface HeaderProps {
  onToggleMobile: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { status } = useEnclave()

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
    <header className="h-16 sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/90 px-4 lg:px-6 flex items-center justify-between">
      {/* Left Section: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          onClick={onToggleMobile}
          aria-label="Toggle navigation drawer"
          className="lg:hidden p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Industrial Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="hidden sm:inline text-slate-500">ZENITH</span>
          <span className="hidden sm:inline text-slate-600">/</span>
          <span className="hidden md:inline text-slate-500">WORKBENCH</span>
          <span className="hidden md:inline text-slate-600">/</span>
          <span className="text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            {currentTitle}
          </span>
        </div>
      </div>

      {/* Center Section: Telemetry & Air-Gap Posture (Visible on Laptop & Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">LATENCY:</span>
          <span className="text-slate-200 font-bold">14ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">THROUGHPUT:</span>
          <span className="text-cyan-400 font-bold">4.2 kTok/s</span>
        </div>

        <Badge variant="emerald" size="sm" dot>
          AIR-GAP: {status.airGapVerified ? 'SECURE' : 'UNVERIFIED'}
        </Badge>
      </div>

      {/* Right Section: Actions & User Callsign */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Shortcut Trigger */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick command...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
            Ctrl + K
          </kbd>
        </div>

        {/* Security Notification Indicator */}
        <button
          className="relative p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
        </button>

        {/* User Identity Pill */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="h-8 w-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>

            <div className="hidden sm:flex flex-col text-left leading-none font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200">
                  {user.callsign}
                </span>
                <Shield className="w-3 h-3 text-cyan-400" />
              </div>
              <span className="text-[9px] text-slate-400 uppercase mt-0.5">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Terminate Sovereign Session"
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-mono px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold"
          >
            LOGIN
          </button>
        )}
      </div>
    </header>
  )
}
