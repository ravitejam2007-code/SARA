import React, { useState, useMemo } from 'react'
import { Radio } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProvenanceBadge } from './ProvenanceBadge'
import type { NetworkMonitorEntry, NetworkRequestStatus } from '@/types/security'

export interface NetworkMonitorProps {
  entries: NetworkMonitorEntry[]
}

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({ entries }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ALLOWED' | 'BLOCKED' | 'INTERNAL'>('ALL')

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (activeFilter === 'ALL') return true
      if (activeFilter === 'ALLOWED') return entry.status === 'ALLOWED'
      if (activeFilter === 'BLOCKED') return entry.status === 'BLOCKED_BY_AIRGAP'
      if (activeFilter === 'INTERNAL') return entry.requestType === 'LOCAL_IPC' || entry.requestType === 'INTERNAL_RPC'
      return true
    })
  }, [entries, activeFilter])

  const getDecisionBadge = (status: NetworkRequestStatus) => {
    switch (status) {
      case 'ALLOWED':
        return (
          <Badge variant="success" size="sm">
            ALLOWED
          </Badge>
        )
      case 'BLOCKED_BY_AIRGAP':
        return (
          <Badge variant="error" size="sm">
            BLOCKED_BY_AIRGAP
          </Badge>
        )
      case 'VERIFIED':
        return (
          <Badge variant="info" size="sm" dot>
            VERIFIED
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden font-mono space-y-3 p-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            NETWORK MONITOR // EGRESS & IPC INTERCEPT LOG
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Network events shown here represent telemetry returned by the backend. The frontend does not independently certify an air gap.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[10px]">
          {(['ALL', 'ALLOWED', 'BLOCKED', 'INTERNAL'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken">
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">SERVICE</th>
              <th className="py-2.5 px-3">TARGET ENDPOINT</th>
              <th className="py-2.5 px-3">PROTOCOL</th>
              <th className="py-2.5 px-3">DECISION</th>
              <th className="py-2.5 px-3 text-right">DATA ORIGIN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-text-muted text-xs">
                  No network traffic events recorded for active filter.
                </td>
              </tr>
            ) : (
              filteredEntries.map((item) => (
                <tr key={item.id} className="hover:bg-surface-elevated/60 transition-colors">
                  <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-text-primary whitespace-nowrap">
                    {item.service}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-[11px] truncate max-w-xs block ${
                        item.status === 'BLOCKED_BY_AIRGAP'
                          ? 'text-rose-400 font-semibold'
                          : 'text-cyan-300'
                      }`}
                    >
                      {item.targetEndpoint}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-muted text-[10px] whitespace-nowrap">
                    {item.protocol}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getDecisionBadge(item.status)}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <ProvenanceBadge origin={item.dataOrigin} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NetworkMonitor
