import React from 'react'
import {
  Cpu,
  Scan,
  FileText,
  Database,
  HardDrive,
  Box,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProvenanceBadge } from './ProvenanceBadge'
import type { LocalServiceHealthItem, LocalServiceStatus } from '@/types/security'

export interface LocalServiceHealthProps {
  services: LocalServiceHealthItem[]
}

export const LocalServiceHealth: React.FC<LocalServiceHealthProps> = ({
  services,
}) => {
  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'LLM':
        return <Cpu className="w-4 h-4 text-[#171717]" />
      case 'Vision Model':
        return <Scan className="w-4 h-4 text-purple-700" />
      case 'OCR':
        return <FileText className="w-4 h-4 text-amber-700" />
      case 'Qdrant':
        return <Database className="w-4 h-4 text-emerald-700" />
      case 'PostgreSQL':
        return <Database className="w-4 h-4 text-[#0070f3]" />
      case 'File Storage':
        return <HardDrive className="w-4 h-4 text-[#171717]" />
      case 'Code Sandbox':
        return <Box className="w-4 h-4 text-[#ee0000]" />
      default:
        return <Cpu className="w-4 h-4 text-[#8f8f8f]" />
    }
  }

  const getStatusBadge = (status: LocalServiceStatus) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <Badge variant="success" size="sm" dot>
            HEALTHY
          </Badge>
        )
      case 'DEGRADED':
        return (
          <Badge variant="warning" size="sm" dot>
            DEGRADED
          </Badge>
        )
      case 'MAINTENANCE':
        return (
          <Badge variant="default" size="sm" dot>
            MAINTENANCE
          </Badge>
        )
      case 'UNAVAILABLE':
      default:
        return (
          <Badge variant="error" size="sm" dot>
            UNAVAILABLE
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden font-sans space-y-3 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ebebeb] pb-3">
        <div>
          <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider flex items-center gap-2 font-mono">
            <Cpu className="w-4 h-4 text-[#171717]" />
            LOCAL SOVEREIGN SERVICE HEALTH (7 COMPONENTS)
          </h3>
          <p className="text-[11px] text-[#4d4d4d] mt-0.5">
            On-premise hardware container runtime status, internal latencies, and memory allocations.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#ebebeb] text-[#8f8f8f] text-[11px] bg-[#fafafa]">
              <th className="py-2.5 px-3">SERVICE COMPONENT</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">INTERNAL LATENCY</th>
              <th className="py-2.5 px-3">MEMORY / VRAM</th>
              <th className="py-2.5 px-3">VERSION / MODEL</th>
              <th className="py-2.5 px-3">UPTIME</th>
              <th className="py-2.5 px-3 text-right">PROVENANCE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebebeb]">
            {services.map((srv) => (
              <tr key={srv.id} className="hover:bg-[#fafafa] transition-colors">
                {/* Service Name & Icon */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-[4px] bg-[#fafafa] border border-[#ebebeb] shrink-0">
                      {getServiceIcon(srv.name)}
                    </div>
                    <span className="font-semibold text-[#171717]">{srv.name}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {getStatusBadge(srv.status)}
                </td>

                {/* Latency */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {srv.latencyMs !== null ? (
                    <span className="text-[#171717] font-semibold font-mono">{srv.latencyMs}ms</span>
                  ) : (
                    <span className="text-[#8f8f8f]">—</span>
                  )}
                </td>

                {/* Memory / VRAM */}
                <td className="py-3 px-3 text-[#4d4d4d] whitespace-nowrap font-mono">
                  {srv.memoryVram || '—'}
                </td>

                {/* Version */}
                <td className="py-3 px-3 text-[#8f8f8f] whitespace-nowrap font-mono text-[11px]">
                  {srv.version || '—'}
                </td>

                {/* Uptime */}
                <td className="py-3 px-3 text-[#8f8f8f] whitespace-nowrap font-mono">
                  {srv.uptime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8f8f8f]" />
                      {srv.uptime}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Provenance Badge */}
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <ProvenanceBadge origin={srv.dataOrigin} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LocalServiceHealth
