import React, { useState, useMemo } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  FileCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProvenanceBadge } from './ProvenanceBadge'
import type {
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
} from '@/types/security'

export interface SecurityEventsFeedProps {
  events: SecurityEvent[]
}

export const SecurityEventsFeed: React.FC<SecurityEventsFeedProps> = ({ events }) => {
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [severityFilter, setSeverityFilter] = useState<string>('ALL')

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (typeFilter !== 'ALL' && ev.type !== typeFilter) return false
      if (severityFilter !== 'ALL' && ev.severity !== severityFilter) return false
      return true
    })
  }, [events, typeFilter, severityFilter])

  const getSeverityBadge = (sev: SecuritySeverity) => {
    switch (sev) {
      case 'HIGH':
        return (
          <Badge variant="error" size="sm">
            HIGH SEVERITY
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
          <Badge variant="info" size="sm">
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
        return <ShieldAlert className="w-4 h-4 text-rose-400" />
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />
      case 'AUTH_EVENT':
        return <Lock className="w-4 h-4 text-cyan-400" />
      case 'FILE_ACCESS':
        return <FileCheck className="w-4 h-4 text-emerald-400" />
    }
  }

  return (
    <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden font-mono space-y-3 p-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            SECURITY EVENTS STREAM (INCIDENT & INTEGRITY LOGS)
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Filterable feed of warnings, blocked egress attempts, authentication events, and file integrity operations.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-text-muted uppercase">TYPE:</span>
            {(['ALL', 'BLOCKED_REQUEST', 'WARNING', 'AUTH_EVENT', 'FILE_ACCESS'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTypeFilter(cat)}
                  className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                    typeFilter === cat
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
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
          <div className="flex items-center gap-1 text-[10px] pl-2 border-l border-border/70">
            <span className="text-text-muted uppercase">SEV:</span>
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
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
          <div className="py-6 text-center text-text-muted text-xs">
            No security events match the current filter selection.
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded bg-surface-sunken border border-border flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-border-strong transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-surface border border-border shrink-0 mt-0.5">
                  {getEventIcon(ev.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">{ev.title}</span>
                    {getSeverityBadge(ev.severity)}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    {ev.detail}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-start gap-2 text-right">
                <ProvenanceBadge origin={ev.dataOrigin} />
                <span className="text-[10px] text-text-muted font-mono">{ev.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SecurityEventsFeed
