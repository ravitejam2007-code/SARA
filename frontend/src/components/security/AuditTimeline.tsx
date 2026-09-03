import React, { useState } from 'react'
import { ScrollText, Search, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { AuditTimelineEntry } from '@/types/security'

export interface AuditTimelineProps {
  entries: AuditTimelineEntry[]
  isLoading?: boolean
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ entries }) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      !search ||
      item.user.toLowerCase().includes(search.toLowerCase()) ||
      item.action.toLowerCase().includes(search.toLowerCase()) ||
      item.resource.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return (
          <Badge variant="success" size="sm" dot>
            CONFIRMED
          </Badge>
        )
      case 'BLOCKED':
        return (
          <Badge variant="error" size="sm" dot>
            BLOCKED
          </Badge>
        )
      case 'FLAGGED':
        return (
          <Badge variant="warning" size="sm" dot>
            FLAGGED
          </Badge>
        )
      default:
        return (
          <Badge variant="default" size="sm">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden font-sans space-y-3 p-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#ebebeb] pb-3">
        <div>
          <h3 className="text-xs font-semibold text-[#171717] uppercase tracking-wider flex items-center gap-2 font-mono">
            <ScrollText className="w-4 h-4 text-[#171717]" />
            CRYPTOGRAPHIC AUDIT TIMELINE (IMMUTABLE ACTIONS)
          </h3>
          <p className="text-[11px] text-[#4d4d4d] mt-0.5">
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
            <tr className="border-b border-[#ebebeb] text-[#8f8f8f] text-[11px] bg-[#fafafa]">
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
          <tbody className="divide-y divide-[#ebebeb]">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-[#8f8f8f] text-xs">
                  No audit log records match the search filter.
                </td>
              </tr>
            ) : (
              filteredEntries.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-3 text-[#8f8f8f] whitespace-nowrap font-mono">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#171717] whitespace-nowrap">
                      {item.user}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded-[4px] bg-[#fafafa] border border-[#ebebeb] text-[10px] text-[#171717] font-semibold font-mono">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#4d4d4d]">
                      <span className="truncate max-w-[140px] block" title={item.resource}>
                        {item.resource}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#8f8f8f] whitespace-nowrap text-[11px] font-mono">
                      {item.model}
                    </td>
                    <td className="py-3 px-3 text-[#4d4d4d] whitespace-nowrap text-[11px] font-mono">
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
                          className="p-1 rounded text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          title="View SHA-256 Checksum"
                        >
                          {expandedId === item.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[#8f8f8f]">—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expandable Checksum Row */}
                  {expandedId === item.id && item.checksumSha256 && (
                    <tr className="bg-[#fafafa] border-b border-[#ebebeb]">
                      <td colSpan={8} className="py-2.5 px-4">
                        <div className="flex items-center justify-between gap-3 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#8f8f8f] uppercase font-semibold font-mono">
                              IMMUTABLE SHA-256 SEAL:
                            </span>
                            <pre className="text-[#171717] font-mono text-[10px] font-semibold">
                              {item.checksumSha256}
                            </pre>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyHash(item.checksumSha256!)}
                            className="flex items-center gap-1 text-[10px] text-[#0070f3] hover:underline cursor-pointer font-mono"
                          >
                            {copiedHash === item.checksumSha256 ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span className="text-emerald-700 font-medium">Copied</span>
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
