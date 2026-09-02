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
        return <Cpu className="w-4 h-4 text-cyan-400" />
      case 'Vision Model':
        return <Scan className="w-4 h-4 text-purple-400" />
      case 'OCR':
        return <FileText className="w-4 h-4 text-amber-400" />
      case 'Qdrant':
        return <Database className="w-4 h-4 text-emerald-400" />
      case 'PostgreSQL':
        return <Database className="w-4 h-4 text-blue-400" />
      case 'File Storage':
        return <HardDrive className="w-4 h-4 text-cyan-400" />
      case 'Code Sandbox':
        return <Box className="w-4 h-4 text-rose-400" />
      default:
        return <Cpu className="w-4 h-4 text-text-muted" />
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
          <Badge variant="warning" size="sm">
            DEGRADED
          </Badge>
        )
      case 'MAINTENANCE':
        return (
          <Badge variant="info" size="sm">
            MAINTENANCE
          </Badge>
        )
      case 'UNAVAILABLE':
      default:
        return (
          <Badge variant="default" size="sm">
            UNAVAILABLE
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden font-mono space-y-3 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            LOCAL SOVEREIGN SERVICE HEALTH (7 COMPONENTS)
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">
            On-premise hardware container runtime status, internal latencies, and memory allocations.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken">
              <th className="py-2.5 px-3">SERVICE COMPONENT</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">INTERNAL LATENCY</th>
              <th className="py-2.5 px-3">MEMORY / VRAM</th>
              <th className="py-2.5 px-3">VERSION / MODEL</th>
              <th className="py-2.5 px-3">UPTIME</th>
              <th className="py-2.5 px-3 text-right">PROVENANCE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {services.map((srv) => (
              <tr key={srv.id} className="hover:bg-surface-elevated/60 transition-colors">
                {/* Service Name & Icon */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-surface-sunken border border-border shrink-0">
                      {getServiceIcon(srv.name)}
                    </div>
                    <span className="font-bold text-text-primary">{srv.name}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {getStatusBadge(srv.status)}
                </td>

                {/* Latency */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {srv.latencyMs !== null ? (
                    <span className="text-cyan-300 font-bold">{srv.latencyMs}ms</span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>

                {/* Memory / VRAM */}
                <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                  {srv.memoryVram || '—'}
                </td>

                {/* Version */}
                <td className="py-3 px-3 text-text-muted whitespace-nowrap font-mono text-[11px]">
                  {srv.version || '—'}
                </td>

                {/* Uptime */}
                <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                  {srv.uptime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-text-muted" />
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
