import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Lock,
  Terminal,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react'
import { useAuth, DEMO_USERS } from '@/context/AuthContext'
import type { UserRole } from '@/types'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()

  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password123')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('Admin')

  const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    await login({ username, password }, rememberMe)
    navigate(fromPath, { replace: true })
  }

  const handleSelectDemoRole = (role: UserRole) => {
    const demo = DEMO_USERS[role]
    setSelectedDemoRole(role)
    setUsername(demo.username)
    setPassword(demo.defaultPassword)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] flex flex-col justify-center items-center p-4 relative font-sans selection:bg-[#171717] selection:text-white">
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex p-3 rounded-[8px] bg-[#171717] text-white shadow-sm hover:scale-105 transition-transform mb-1">
            <Layers className="w-7 h-7" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#171717]">
              SARA AI
            </h1>
            <p className="text-xs text-[#8f8f8f] font-mono tracking-wider uppercase mt-1">
              Sovereign AI Research Assistant & Industrial Workbench
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              AIR-GAP ENCLAVE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f5f5f5] text-[#171717] border border-[#ebebeb] text-[10px] font-mono font-bold">
              FIPS 140-3
            </span>
          </div>
        </div>

        {/* Quick Demo Role Selector Pills */}
        <div className="rounded-[8px] border border-[#ebebeb] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#8f8f8f]">
            <span className="uppercase font-semibold">Test Profiles (No Password Req.):</span>
            <span className="text-[#171717] font-bold">{selectedDemoRole}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(['Engineer', 'Manager', 'Admin', 'Auditor'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectDemoRole(role)}
                className={`px-2 py-1.5 rounded-[6px] border text-[11px] font-medium transition-all text-center ${
                  selectedDemoRole === role
                    ? 'bg-[#171717] border-[#171717] text-white shadow-sm'
                    : 'bg-[#fafafa] border-[#ebebeb] text-[#4d4d4d] hover:text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Hardened Authentication Card */}
        <div className="rounded-[12px] bg-white border border-[#ebebeb] p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] font-mono">
          <div className="border-b border-[#ebebeb] pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#171717]" />
                SOVEREIGN ACCESS TERMINAL
              </span>
              <span className="text-[10px] text-[#8f8f8f]">
                TLSv1.3 LOCAL
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#171717]">Username or Callsign</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or operator@sara-workbench.sec"
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#ebebeb] rounded-[6px] focus-ring text-[#171717] placeholder:text-[#8f8f8f] font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#171717]">Passphrase</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter enclave master passphrase"
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 pr-9 text-xs bg-white border border-[#ebebeb] rounded-[6px] focus-ring text-[#171717] placeholder:text-[#8f8f8f] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#171717] p-1 rounded"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Air-Gap Security Note */}
            <div className="flex items-center justify-between text-xs pt-1 font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-[#4d4d4d] select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#ebebeb] text-[#171717] focus:ring-[#171717] w-3.5 h-3.5"
                />
                <span>Remember Session</span>
              </label>

              <span className="text-emerald-700 text-[10px] uppercase font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Zero Egress
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-[6px] bg-[#171717] hover:bg-black text-white text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-sm font-mono mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>ENTER SARA WORKBENCH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#ebebeb] text-center">
            <Link to="/" className="text-xs text-[#8f8f8f] hover:text-[#171717] transition-colors font-sans">
              ← Return to Public Architecture Landing Page
            </Link>
          </div>
        </div>

        {/* Terminal Info Footer */}
        <div className="text-center text-[11px] text-[#8f8f8f] space-y-1 font-mono">
          <div className="flex items-center justify-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#8f8f8f]" />
            <span>SESSION PROTOCOL: TLSv1.3 // SHA256-ATTESTED</span>
          </div>
          <p>© SARA Sovereign AI Workbench. Enterprise Industrial Intelligence.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
