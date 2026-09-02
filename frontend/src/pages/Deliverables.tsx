import React from 'react'
import {
  Download,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface DeliverableItem {
  id: string
  title: string
  type: 'SIMULATION_REPORT' | 'COMPLIANCE_CERT' | 'PLC_PACKAGE' | 'AUDIT_PACKAGE'
  version: string
  generatedAt: string
  signedBy: string
  size: string
}

const deliverables: DeliverableItem[] = [
  {
    id: 'DELIV-2026-001',
    title: 'Hypersonic Blade Stress Analysis & Defect Certification',
    type: 'SIMULATION_REPORT',
    version: 'v1.4-FINAL',
    generatedAt: '2026-09-02 09:30 UTC',
    signedBy: 'ENCLAVE-KEY-SGX-09',
    size: '42.1 MB',
  },
  {
    id: 'DELIV-2026-002',
    title: 'ISO 26262 ASIL-D Automated Safety Verification Bundle',
    type: 'COMPLIANCE_CERT',
    version: 'v2.0-RELEASE',
    generatedAt: '2026-09-01 18:14 UTC',
    signedBy: 'ENCLAVE-KEY-HSM-01',
    size: '18.4 MB',
  },
  {
    id: 'DELIV-2026-003',
    title: 'Target PLC Code Package (Beckhoff TwinCAT3 Structured Text)',
    type: 'PLC_PACKAGE',
    version: 'v3.2',
    generatedAt: '2026-08-31 14:00 UTC',
    signedBy: 'CHIEF-ENGINEER-VANCE',
    size: '6.2 MB',
  },
  {
    id: 'DELIV-2026-004',
    title: 'Monthly Sovereign Enclave Cryptographic Audit Package',
    type: 'AUDIT_PACKAGE',
    version: 'v2026.08',
    generatedAt: '2026-08-31 23:59 UTC',
    signedBy: 'IMMUTABLE-LEDGER-DAEMON',
    size: '124.9 MB',
  },
]

export const Deliverables: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              ENGINEERING DELIVERABLES & EXPORTS
            </h1>
            <Badge variant="cyan" size="sm" dot>
              CRYPTOGRAPHICALLY SIGNED
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Validated engineering deliverables, compliance certificates, and production-ready artifacts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            VERIFY SIGNATURES
          </Button>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliverables.map((item) => (
          <Card key={item.id} hoverEffect>
            <CardHeader>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold block">
                  {item.id}
                </span>
                <CardTitle className="mt-1 text-slate-100 normal-case font-mono text-sm">
                  {item.title}
                </CardTitle>
              </div>
              <Badge variant="emerald" size="sm">
                {item.version}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>CATEGORY</span>
                  <span className="text-slate-200">{item.type}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>SIGNING ENTITY</span>
                  <span className="text-cyan-400">{item.signedBy}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>GENERATED</span>
                  <span className="text-slate-300">{item.generatedAt}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>FILE SIZE</span>
                  <span className="text-slate-300">{item.size}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SIGNATURE VALID
                </span>
                <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                  EXPORT
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Deliverables
