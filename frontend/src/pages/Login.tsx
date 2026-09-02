import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldAlert,
  Lock,
  Terminal,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
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
    <div className="min-h-screen bg-[#080b12] text-text-primary flex flex-col justify-center items-center p-4 relative overflow-hidden font-mono">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Decorative ambient glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-lg bg-surface border border-border shadow-glow-info mb-1">
            <Layers className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-text-primary uppercase">
            ZENITH <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-text-secondary tracking-wider uppercase">
            Sovereign Industrial AI Workbench
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Badge variant="info" size="sm" dot>
              AIR-GAP VERIFIED
            </Badge>
            <Badge variant="success" size="sm">
              FIPS 140-3
            </Badge>
          </div>
        </div>

        {/* Quick Demo Role Selector Pills */}
        <div className="rounded border border-border bg-surface-sunken/80 p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span className="uppercase font-semibold">Select Role Profile for Testing:</span>
            <span className="text-cyan-400">{selectedDemoRole}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(['Engineer', 'Manager', 'Admin', 'Auditor'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectDemoRole(role)}
                className={`px-2 py-1.5 rounded border text-[11px] font-semibold transition-all text-center ${
                  selectedDemoRole === role
                    ? 'bg-surface-elevated border-cyan-500/80 text-cyan-300 shadow-sm'
                    : 'bg-surface/50 border-border text-text-muted hover:text-text-primary hover:bg-surface'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Hardened Authentication Card */}
        <div className="rounded-lg bg-surface border border-border p-6 space-y-5 shadow-industrial">
          <div className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                SOVEREIGN ACCESS TERMINAL
              </span>
              <span className="text-[10px] text-text-muted">
                mTLS / ENCLAVE-SEC
              </span>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              Sign in with your enterprise credentials to access the sovereign enclave.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <Input
              label="Username or Operator Email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or operator@zenith-industrial.sec"
              leftIcon={<User className="w-4 h-4" />}
              required
              disabled={isLoading}
            />

            {/* Password with Eye Toggle */}
            <div className="relative">
              <Input
                label="Passphrase / Security Key"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                leftIcon={<Lock className="w-4 h-4" />}
                required
                disabled={isLoading}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-text-muted hover:text-text-primary focus-ring p-0.5 rounded transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="rounded bg-surface-sunken border border-border accent-cyan-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Remember this terminal</span>
              </label>

              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Session Encrypted
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              AUTHENTICATE SESSION
            </Button>
          </form>

          {/* System Security Message */}
          <div className="p-3.5 rounded bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300/90 flex gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold uppercase tracking-wider">
                SYSTEM SECURITY ADVISORY // ZERO EXFILTRATION
              </p>
              <p className="text-amber-400/80 leading-relaxed text-[11px]">
                This is a sovereign industrial AI system operating in an air-gapped enclave.
                Access is monitored and immutably signed to the hardware ledger. Backend microservices
                remain authoritative for all permissions and data isolation.
              </p>
            </div>
          </div>
        </div>

        {/* Terminal Info Footer */}
        <div className="text-center text-[11px] text-text-muted space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-text-muted" />
            <span>SESSION PROTOCOL: TLSv1.3 // SHA256-ATTESTED</span>
          </div>
          <p>© Zenith Sovereign Systems. Enterprise Industrial Intelligence.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
