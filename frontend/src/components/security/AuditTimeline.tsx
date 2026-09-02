import React, { useState, useMemo } from 'react'
import {
  ScrollText,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { AuditTimelineEntry, AuditStatus } from '@/types/security'

export interface AuditTimelineProps {
  entries: AuditTimelineEntry[]
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ entries }) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.user.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q) ||
          item.resource.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.tool.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [entries, search, statusFilter])

  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <Badge variant="success" size="sm">
            CONFIRMED
          </Badge>
        )
      case 'BLOCKED':
        return (
          <Badge variant="error" size="sm">
            BLOCKED
          </Badge>
        )
      case 'FLAGGED':
        return (
          <Badge variant="warning" size="sm">
            FLAGGED
          </Badge>
        )
    }
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  return (
    <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden font-mono space-y-3 p-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-cyan-400" />
            CRYPTOGRAPHIC AUDIT TIMELINE (IMMUTABLE ACTIONS)
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Cryptographically sealed timeline of operator requests, model invocations, and tool executions.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="w-48 sm:w-60">
            <Input
              sizeVariant="sm"
              placeholder="Search user, action, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
              clearable
              onClear={() => setSearch('')}
            />
          </div>

          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'BLOCKED', label: 'Blocked' },
                { value: 'FLAGGED', label: 'Flagged' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken">
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">USER / CALLSIGN</th>
              <th className="py-2.5 px-3">ACTION</th>
              <th className="py-2.5 px-3">RESOURCE</th>
              <th className="py-2.5 px-3">MODEL</th>
              <th className="py-2.5 px-3">TOOL</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3 text-right">DETAILS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-text-muted text-xs">
                  No audit log records match the search filter.
                </td>
              </tr>
            ) : (
              filteredEntries.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-surface-elevated/60 transition-colors">
                    <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-3 font-semibold text-text-primary whitespace-nowrap">
                      {item.user}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border text-[10px] text-cyan-300 font-bold">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-text-secondary">
                      <span className="truncate max-w-[140px] block" title={item.resource}>
                        {item.resource}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-text-muted whitespace-nowrap text-[11px]">
                      {item.model}
                    </td>
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap text-[11px]">
                      {item.tool}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {item.checksumSha256 ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                          className="p-1 rounded text-text-muted hover:text-cyan-400 hover:bg-surface-sunken transition-colors cursor-pointer"
                          title="View SHA-256 Checksum"
                        >
                          {expandedId === item.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expandable Checksum Row */}
                  {expandedId === item.id && item.checksumSha256 && (
                    <tr className="bg-surface-sunken/80 border-b border-border/60">
                      <td colSpan={8} className="py-2.5 px-4">
                        <div className="flex items-center justify-between gap-3 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-text-muted uppercase font-semibold">
                              IMMUTABLE SHA-256 SEAL:
                            </span>
                            <pre className="text-cyan-300 font-mono text-[10px]">
                              {item.checksumSha256}
                            </pre>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyHash(item.checksumSha256!)}
                            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                          >
                            {copiedHash === item.checksumSha256 ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Hash</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditTimeline
