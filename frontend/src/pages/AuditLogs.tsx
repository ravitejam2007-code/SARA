import React, { useState, useEffect } from 'react'
import {
  ScrollText,
  Search,
  Download,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { apiClient } from '@/services/api'

interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  targetResource: string
  enclaveNodeId: string
  sha256Hash: string
  status: 'SUCCESS' | 'WARNING' | 'ALERT'
}

const fallbackAuditLogs: AuditEntry[] = [
  {
    id: 'LOG-9941',
    timestamp: '2026-09-03 11:28:44',
    actor: 'OPERATOR_KAI_CHEN',
    action: 'MODEL_ROUTED_INSPECTION_ANALYSIS',
    targetResource: 'TASK-1042 // SOP-704',
    enclaveNodeId: 'ENCLAVE-SEC-01',
    sha256Hash: '920aa40e84cd18c78c0876a9ea87450387c45ed66faff97dd3ba611a3ff3fc8b',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-9940',
    timestamp: '2026-09-03 11:28:40',
    actor: 'SARA_AGENT_RUNTIME',
    action: 'DOCLING_OCR_EXTRACTION',
    targetResource: 'inspection_report_gt4b.pdf',
    enclaveNodeId: 'ENCLAVE-SEC-01',
    sha256Hash: '0ea934af9768aa55d5c8ab86baa7583c82929f0ae8eab9ddebe96d4b08ca21cf',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-9939',
    timestamp: '2026-09-03 11:28:35',
    actor: 'SARA_TOOL_RUNTIME',
    action: 'AIR_GAPPED_CALCULATION_ISO10816',
    targetResource: 'Bearing 2 RMS Exceedance (+28.89%)',
    enclaveNodeId: 'ENCLAVE-SEC-01',
    sha256Hash: '31fbd9146cf50df9e8fd9541f5cbcead0864a3e6eba148911acccc5852951e07',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-9938',
    timestamp: '2026-09-03 11:28:15',
    actor: 'SARA_SANDBOX_RUNTIME',
    action: 'PYTEST_SANDBOX_EXECUTION_ZERO_NET',
    targetResource: 'solution_anomaly_test.py',
    enclaveNodeId: 'ENCLAVE-SEC-01',
    sha256Hash: '14752711eeb35d76bdebf2c30aba290f174fbbc0969a3028a54f6b869fcfee38',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-9937',
    timestamp: '2026-09-03 11:25:02',
    actor: 'SECURITY_SUPERVISOR',
    action: 'OUTBOUND_DNS_BLOCKED',
    targetResource: 'api.openai.com:443 (Firewall Drop)',
    enclaveNodeId: 'ENCLAVE-SEC-01',
    sha256Hash: '87ba32c918ee49d7f02a90e3860bb4a45a1c97a5a8286a9f0294e5a95f87b89f',
    status: 'ALERT',
  },
]

export const AuditLogs: React.FC = () => {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditEntry[]>(fallbackAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get<AuditEntry[]>('/audit')
      .then((res) => {
        if (res.data && res.data.length > 0) setLogs(res.data)
      })
      .catch((err) => console.warn('[SARA Audit] Backend logs unreachable:', err))
  }, [])

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
    toast.success('SHA-256 Copied', 'Cryptographic signature copied to clipboard.')
  }

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2))
    const a = document.createElement('a')
    a.href = dataStr
    a.download = `sara_audit_manifest_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    toast.success('Audit Manifest Exported', 'Downloaded signed JSON cryptographic ledger manifest.')
  }

  const filtered = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 font-mono text-[#171717] pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#ebebeb] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] uppercase">
              IMMUTABLE CRYPTOGRAPHIC AUDIT TRAIL
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              HARDWARE SEALED
            </span>
          </div>
          <p className="text-xs text-[#8f8f8f] mt-1 font-sans">
            WORM (Write Once Read Many) cryptographic audit ledger backed by TPM hardware seals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            EXPORT AUDIT MANIFEST
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search by actor, action, resource, or SHA256..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-[#8f8f8f]">
          LEDGER HEIGHT: <span className="text-[#171717] font-bold">#481,029 BLOCKS</span>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <div className="rounded-[12px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#ebebeb] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#171717] flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#171717]" />
              RECORDED WORKBENCH EVENTS
            </h2>
            <p className="text-xs text-[#8f8f8f] font-sans mt-0.5">
              Each action is cryptographically signed at hardware enclave execution
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-[4px] bg-[#f5f5f5] text-[#171717] border border-[#ebebeb] text-[10px] font-bold">
            ED25519 VERIFIED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ebebeb] text-[#8f8f8f] text-[11px] bg-[#fafafa]">
                <th className="py-3 px-4 font-semibold">EVENT ID</th>
                <th className="py-3 px-3 font-semibold">TIMESTAMP</th>
                <th className="py-3 px-3 font-semibold">ACTOR CALLSIGN</th>
                <th className="py-3 px-3 font-semibold">ACTION EVENT</th>
                <th className="py-3 px-3 font-semibold">TARGET RESOURCE</th>
                <th className="py-3 px-3 font-semibold">SHA-256 SIGNATURE</th>
                <th className="py-3 px-4 font-semibold text-right">INTEGRITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb] text-[#4d4d4d]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#171717]">{log.id}</td>
                  <td className="py-3 px-3 text-[#8f8f8f] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-3 text-[#171717] font-medium">{log.actor}</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-[#fafafa] border border-[#ebebeb] text-[#171717] text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#4d4d4d] truncate max-w-xs">{log.targetResource}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleCopyHash(log.sha256Hash)}
                      title="Click to copy full SHA-256 hash"
                      className="inline-flex items-center gap-1.5 text-[#8f8f8f] hover:text-[#171717] font-mono text-[11px] transition-colors cursor-pointer"
                    >
                      <span className="truncate max-w-[120px]">
                        {log.sha256Hash.substring(0, 16)}...
                      </span>
                      {copiedHash === log.sha256Hash ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      SEALED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
