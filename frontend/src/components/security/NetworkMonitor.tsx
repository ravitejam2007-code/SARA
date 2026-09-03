import React, { useState } from 'react'
import { Radio } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProvenanceBadge } from './ProvenanceBadge'
import type { NetworkMonitorEntry, NetworkRequestStatus } from '@/types/security'

export interface NetworkMonitorProps {
  entries: NetworkMonitorEntry[]
  isLoading?: boolean
}

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({ entries }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ALLOWED' | 'BLOCKED'>('ALL')

  const filteredEntries = entries.filter((item) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'BLOCKED') return item.status === 'BLOCKED_BY_AIRGAP'
    if (activeFilter === 'ALLOWED') return item.status === 'ALLOWED'
    return true
  })

  const getDecisionBadge = (status: NetworkRequestStatus) => {
    switch (status) {
      case 'BLOCKED_BY_AIRGAP':
        return (
          <Badge variant="error" size="sm" dot>
            AIRGAP BLOCKED
          </Badge>
        )
      case 'ALLOWED':
        return (
          <Badge variant="success" size="sm" dot>
            ALLOWED
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
    <div className="rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden font-sans space-y-3 p-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebebeb] pb-3">
        <div>
          <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider flex items-center gap-2 font-mono">
            <Radio className="w-4 h-4 text-[#171717]" />
            NETWORK MONITOR // EGRESS & IPC INTERCEPT LOG
          </h3>
          <p className="text-[11px] text-[#4d4d4d] mt-0.5">
            Network events shown here represent telemetry returned by the backend. The frontend does not independently certify an air gap.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          {(['ALL', 'ALLOWED', 'BLOCKED'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-2 py-1 rounded-[4px] border transition-colors cursor-pointer text-[10px] ${
                activeFilter === filter
                  ? 'bg-[#171717] border-[#171717] text-white font-medium'
                  : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
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
            <tr className="border-b border-[#ebebeb] text-[#8f8f8f] text-[11px] bg-[#fafafa]">
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">SERVICE</th>
              <th className="py-2.5 px-3">TARGET ENDPOINT</th>
              <th className="py-2.5 px-3">PROTOCOL</th>
              <th className="py-2.5 px-3">DECISION</th>
              <th className="py-2.5 px-3 text-right">DATA ORIGIN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebebeb]">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[#8f8f8f] text-xs">
                  No network traffic events recorded for active filter.
                </td>
              </tr>
            ) : (
              filteredEntries.map((item) => (
                <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-3 text-[#8f8f8f] whitespace-nowrap font-mono">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#171717] whitespace-nowrap">
                    {item.service}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-[11px] truncate max-w-xs block ${
                        item.status === 'BLOCKED_BY_AIRGAP'
                          ? 'text-[#ee0000] font-semibold'
                          : 'text-[#171717]'
                      }`}
                    >
                      {item.targetEndpoint}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#8f8f8f] text-[10px] whitespace-nowrap font-mono">
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
