import React, { useState } from 'react'
import {
  ScrollText,
  Search,
  Download,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { AuditLogEntry } from '@/types'

const initialLogs: AuditLogEntry[] = [
  {
    id: 'LOG-8812',
    timestamp: '2026-09-02 16:29:10 UTC',
    actor: 'COMMANDER-VANCE',
    action: 'DISPATCH_INFERENCE_PIPELINE',
    targetResource: 'CLUSTER-ALPHA // TURBINE-SPEC-04',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipOrInterface: 'mTLS-NODE-LOCAL-01',
  },
  {
    id: 'LOG-8811',
    timestamp: '2026-09-02 15:42:01 UTC',
    actor: 'SYSTEM_DAEMON_TPM',
    action: 'HARDWARE_ATTESTATION_HEARTBEAT',
    targetResource: 'INTEL-SGX2-CORE-ARRAY',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    ipOrInterface: 'HW-BUS-INTERNAL',
  },
  {
    id: 'LOG-8810',
    timestamp: '2026-09-02 14:18:22 UTC',
    actor: 'CHIEF-ENGINEER-LEE',
    action: 'INGEST_PROPRIETARY_STEP_FILE',
    targetResource: 'DOC-8021 // HYDRAULICS_REV4',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: '7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b',
    ipOrInterface: 'mTLS-NODE-LOCAL-02',
  },
  {
    id: 'LOG-8809',
    timestamp: '2026-09-02 12:00:00 UTC',
    actor: 'AIR_GAP_MONITOR',
    action: 'EGRESS_VERIFICATION_CHECK',
    targetResource: 'NETWORK_BOUNDARY_AIR01',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: '4b5c6d7e8f90123456789abcdef0123456789abcdef0a1b2c3d4e5f60718293a',
    ipOrInterface: 'ISOLATION-CONTROLLER',
  },
]

export const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const filtered = initialLogs.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              IMMUTABLE CRYPTOGRAPHIC AUDIT TRAIL
            </h1>
            <Badge variant="emerald" size="sm" dot>
              HARDWARE SEALED
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            WORM (Write Once Read Many) cryptographic audit ledger backed by TPM hardware seals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            EXPORT AUDIT MANIFEST
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search by actor, action, resource, or SHA256..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs font-mono text-slate-500">
          LEDGER HEIGHT: <span className="text-cyan-400 font-bold">#481,029 BLOCKS</span>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-cyan-400" />
                RECORDED WORKBENCH EVENTS
              </CardTitle>
              <CardDescription>
                Each action is cryptographically signed at hardware enclave execution
              </CardDescription>
            </div>
            <Badge variant="cyan" size="sm">
              ED25519 VERIFIED
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3">EVENT ID</th>
                  <th className="pb-3">TIMESTAMP</th>
                  <th className="pb-3">ACTOR CALLSIGN</th>
                  <th className="pb-3">ACTION EVENT</th>
                  <th className="pb-3">TARGET RESOURCE</th>
                  <th className="pb-3">SHA-256 SIGNATURE</th>
                  <th className="pb-3 text-right">INTEGRITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 font-semibold text-cyan-300">{log.id}</td>
                    <td className="py-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 text-slate-200 font-medium">{log.actor}</td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-xs">{log.targetResource}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleCopyHash(log.sha256Hash)}
                        title="Click to copy full SHA-256 hash"
                        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 font-mono text-[11px] transition-colors"
                      >
                        <span className="truncate max-w-[120px]">
                          {log.sha256Hash.substring(0, 16)}...
                        </span>
                        {copiedHash === log.sha256Hash ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        SEALED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuditLogs
