import React from 'react'
import {
  ShieldCheck,
  Lock,
  KeyRound,
  RefreshCw,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { useEnclave } from '@/hooks/useEnclave'

export const Security: React.FC = () => {
  const { status, toggleAirGap, refreshAttestation } = useEnclave()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              SOVEREIGN ENCLAVE & CRYPTOGRAPHIC SECURITY
            </h1>
            <Badge variant="emerald" size="sm" dot>
              ZERO-TRUST
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Hardware-enforced confidential computing boundaries, TPM 2.0 attestation, and air-gap telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={refreshAttestation}
          >
            ATTEST HARDWARE
          </Button>
          <Button
            variant={status.airGapVerified ? 'destructive' : 'primary'}
            size="sm"
            leftIcon={<Lock className="w-4 h-4" />}
            onClick={toggleAirGap}
          >
            {status.airGapVerified ? 'ISOLATION OVERRIDE' : 'RE-ENGAGE AIR-GAP'}
          </Button>
        </div>
      </div>

      {/* Primary Enclave Posture Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">HARDWARE ENCLAVE</span>
            <StatusIndicator status="secure" pulse />
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-slate-100">{status.enclaveId}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Intel SGX2 / AMD SEV-SNP</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">AIR-GAP BOUNDARY</span>
            <Badge variant={status.airGapVerified ? 'emerald' : 'amber'} size="sm">
              {status.airGapVerified ? 'STRICT' : 'PERMISSIVE'}
            </Badge>
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-slate-100">
            {status.airGapVerified ? '100% ISOLATED' : 'WARNING DEGRADED'}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">0 B outbound egress</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CRYPTO INTEGRITY</span>
            <Badge variant="cyan" size="sm">
              FIPS 140-3
            </Badge>
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-cyan-400">
            {status.cryptographicIntegrity.toFixed(1)}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Zero bit rot or tampering</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">HSM HEARTBEAT</span>
            <span className="text-xs font-mono text-emerald-400">{status.lastHeartbeat}</span>
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-slate-100">SYNCED</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Local hardware atomic clock</div>
        </Card>
      </div>

      {/* Enclave Security Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              CRYPTOGRAPHIC ROOTS OF TRUST
            </CardTitle>
            <CardDescription>
              Hardware-sealed master encryption keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-semibold text-cyan-300">KEY-ROOT-001 (TPM Endorsement Key)</span>
                <Badge variant="emerald" size="sm">SEALED</Badge>
              </div>
              <p className="text-slate-500 text-[11px] truncate">
                Fingerprint: SHA256:7f92a104bcde83210984daffe902194
              </p>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-semibold text-cyan-300">KEY-WEIGHTS-DECRYPT (Model Enclave)</span>
                <Badge variant="emerald" size="sm">IN-MEMORY</Badge>
              </div>
              <p className="text-slate-500 text-[11px] truncate">
                Fingerprint: SHA256:91ac398e01bf284091c7810aa61c201
              </p>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-semibold text-cyan-300">KEY-AUDIT-SIGN (Ledger Seal Key)</span>
                <Badge variant="cyan" size="sm">ED25519</Badge>
              </div>
              <p className="text-slate-500 text-[11px] truncate">
                Fingerprint: SHA256:3409bcde11904af80173298a0029b4e
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AIR-GAP BOUNDARY CONTROLS
            </CardTitle>
            <CardDescription>
              Hardware isolation policy enforcement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            {[
              { rule: 'WAN Interface Physical Link', state: 'DISCONNECTED', secure: true },
              { rule: 'USB Mass Storage Ingestion Port', state: 'HARDWARE READ-ONLY', secure: true },
              { rule: 'Direct Memory Access (IOMMU)', state: 'ENFORCED ISOLATION', secure: true },
              { rule: 'Electromagnetic Emanation (TEMPEST)', state: 'LEVEL-B COMPLIANT', secure: true },
              { rule: 'Outbound DNS / NTP Exfiltration', state: 'HARDWARE BLOCKED', secure: true },
            ].map((r) => (
              <div
                key={r.rule}
                className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <span className="text-slate-300">{r.rule}</span>
                <span className="text-emerald-400 font-semibold">{r.state}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Security
