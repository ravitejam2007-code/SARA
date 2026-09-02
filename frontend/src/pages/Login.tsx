import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Cpu,
  Terminal,
  Layers,
  ArrowRight,
  Fingerprint,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [callsign, setCallsign] = useState('COMMANDER-VANCE')
  const [hardwareKey, setHardwareKey] = useState('HSM-TOKEN-FIPS-098')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(callsign || 'OPERATOR-ZENITH')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle industrial background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Decorative sovereign glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-lg bg-slate-900 border border-slate-800 shadow-industrial-glow mb-1">
            <Layers className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-slate-100 uppercase">
            ZENITH <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 tracking-wider uppercase">
            Sovereign Industrial AI Workbench
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Badge variant="cyan" size="sm" dot>
              AIR-GAP ENCLAVE
            </Badge>
            <Badge variant="emerald" size="sm">
              FIPS 140-3
            </Badge>
          </div>
        </div>

        {/* Hardened Authentication Card */}
        <div className="industrial-card rounded-lg p-6 space-y-5 border border-slate-800">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                SOVEREIGN ACCESS TERMINAL
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                PORT: 443/mTLS
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Mutual TLS and hardware token attestation required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Operator Callsign / Identity"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder="e.g. CHIEF-ENGINEER-01"
              leftIcon={<Terminal className="w-4 h-4" />}
              required
            />

            <Input
              label="Hardware Security Token / HSM ID"
              value={hardwareKey}
              onChange={(e) => setHardwareKey(e.target.value)}
              placeholder="e.g. HSM-KEY-XXXX"
              leftIcon={<KeyRound className="w-4 h-4" />}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium tracking-wide uppercase text-slate-300">
                Enclave Target
              </label>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  CLUSTER-ALPHA [ISOLATED]
                </span>
                <span className="text-emerald-400 font-medium">READY</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              AUTHENTICATE ENCLAVE SESSION
            </Button>
          </form>

          {/* Security Notice */}
          <div className="p-3 rounded bg-amber-950/20 border border-amber-800/40 text-[11px] font-mono text-amber-300/90 flex gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold uppercase tracking-wider">RESTRICTED INDUSTRIAL ACCESS</p>
              <p className="text-amber-400/80 leading-relaxed">
                Unauthorized access is prohibited. All actions are immutably signed to the hardware ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Terminal Info Footer */}
        <div className="text-center font-mono text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
            <span>SESSION KEY: SHA256-4291-EA89-B0F3</span>
          </div>
          <p>© Zenith Sovereign Systems. Air-Gapped Industrial Intelligence.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
