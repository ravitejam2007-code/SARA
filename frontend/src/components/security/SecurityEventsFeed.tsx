import React, { useState } from 'react'
import { ShieldAlert, AlertTriangle, Lock, FileCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProvenanceBadge } from './ProvenanceBadge'
import type { SecurityEvent, SecurityEventType, SecuritySeverity } from '@/types/security'

export interface SecurityEventsFeedProps {
  events: SecurityEvent[]
  isLoading?: boolean
}

export const SecurityEventsFeed: React.FC<SecurityEventsFeedProps> = ({ events }) => {
  const [typeFilter, setTypeFilter] = useState<SecurityEventType | 'ALL'>('ALL')
  const [severityFilter, setSeverityFilter] = useState<SecuritySeverity | 'ALL'>('ALL')

  const filteredEvents = events.filter((ev) => {
    if (typeFilter !== 'ALL' && ev.type !== typeFilter) return false
    if (severityFilter !== 'ALL' && ev.severity !== severityFilter) return false
    return true
  })

  const getSeverityBadge = (sev: SecuritySeverity) => {
    switch (sev) {
      case 'HIGH':
        return (
          <Badge variant="error" size="sm">
            HIGH
          </Badge>
        )
      case 'MEDIUM':
        return (
          <Badge variant="warning" size="sm">
            MEDIUM
          </Badge>
        )
      case 'LOW':
        return (
          <Badge variant="default" size="sm">
            LOW
          </Badge>
        )
      case 'INFO':
        return (
          <Badge variant="default" size="sm">
            INFO
          </Badge>
        )
    }
  }

  const getEventIcon = (type: SecurityEventType) => {
    switch (type) {
      case 'BLOCKED_REQUEST':
        return <ShieldAlert className="w-4 h-4 text-[#ee0000]" />
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-700" />
      case 'AUTH_EVENT':
        return <Lock className="w-4 h-4 text-[#171717]" />
      case 'FILE_ACCESS':
        return <FileCheck className="w-4 h-4 text-emerald-700" />
    }
  }

  return (
    <div className="rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden font-sans space-y-3 p-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebebeb] pb-3">
        <div>
          <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 text-[#171717]" />
            SECURITY EVENTS STREAM (INCIDENT & INTEGRITY LOGS)
          </h3>
          <p className="text-[11px] text-[#4d4d4d] mt-0.5">
            Filterable feed of warnings, blocked egress attempts, authentication events, and file integrity operations.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Category Filter */}
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-[#8f8f8f] uppercase">TYPE:</span>
            {(['ALL', 'BLOCKED_REQUEST', 'WARNING', 'AUTH_EVENT', 'FILE_ACCESS'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTypeFilter(cat)}
                  className={`px-1.5 py-0.5 rounded-[4px] border transition-colors cursor-pointer text-[10px] ${
                    typeFilter === cat
                      ? 'bg-[#171717] border-[#171717] text-white font-medium'
                      : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
                  }`}
                >
                  {cat === 'ALL'
                    ? 'ALL'
                    : cat === 'BLOCKED_REQUEST'
                    ? 'BLOCKED'
                    : cat === 'AUTH_EVENT'
                    ? 'AUTH'
                    : cat === 'FILE_ACCESS'
                    ? 'FILES'
                    : 'WARN'}
                </button>
              )
            )}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 text-[10px] pl-2 border-l border-[#ebebeb]">
            <span className="text-[#8f8f8f] uppercase">SEV:</span>
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-1.5 py-0.5 rounded-[4px] border transition-colors cursor-pointer text-[10px] ${
                  severityFilter === sev
                    ? 'bg-[#171717] border-[#171717] text-white font-medium'
                    : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Stream List */}
      <div className="space-y-2">
        {filteredEvents.length === 0 ? (
          <div className="py-6 text-center text-[#8f8f8f] text-xs">
            No security events match the current filter selection.
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-[#d4d4d4] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-[4px] bg-white border border-[#ebebeb] shrink-0 mt-0.5">
                  {getEventIcon(ev.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#171717]">{ev.title}</span>
                    {getSeverityBadge(ev.severity)}
                  </div>
                  <p className="text-xs text-[#4d4d4d] leading-relaxed">
                    {ev.detail}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-start gap-2 text-right">
                <ProvenanceBadge origin={ev.dataOrigin} />
                <span className="text-[10px] text-[#8f8f8f] font-mono">{ev.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SecurityEventsFeed
