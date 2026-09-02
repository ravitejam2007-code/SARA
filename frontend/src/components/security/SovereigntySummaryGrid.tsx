import React from 'react'
import { Radio, CloudOff, Globe, ArrowUpRight, Activity } from 'lucide-react'
import { ProvenanceBadge } from './ProvenanceBadge'
import type { SovereigntySummary } from '@/types/security'

export interface SovereigntySummaryGridProps {
  summary: SovereigntySummary | null
  isLoading?: boolean
}

export const SovereigntySummaryGrid: React.FC<SovereigntySummaryGridProps> = ({
  summary,
  isLoading = false,
}) => {
  const cards = [
    {
      id: 'ext-api',
      title: 'EXTERNAL API CALLS',
      icon: <Radio className="w-4 h-4 text-cyan-400" />,
      metric: summary?.externalApiCalls,
      displayValue:
        summary?.externalApiCalls.value !== null && summary?.externalApiCalls.value !== undefined
          ? summary.externalApiCalls.value.toString()
          : 'Unavailable',
      origin: summary?.externalApiCalls.origin || 'UNAVAILABLE',
      note: summary?.externalApiCalls.note || 'No backend egress telemetry reporting.',
      lastUpdated: summary?.externalApiCalls.lastUpdated,
    },
    {
      id: 'cloud-model',
      title: 'CLOUD MODEL CALLS',
      icon: <CloudOff className="w-4 h-4 text-emerald-400" />,
      metric: summary?.cloudModelCalls,
      displayValue:
        summary?.cloudModelCalls.value !== null && summary?.cloudModelCalls.value !== undefined
          ? summary.cloudModelCalls.value.toString()
          : 'Unavailable',
      origin: summary?.cloudModelCalls.origin || 'UNAVAILABLE',
      note: summary?.cloudModelCalls.note || 'In-enclave execution status unverified.',
      lastUpdated: summary?.cloudModelCalls.lastUpdated,
    },
    {
      id: 'ext-dns',
      title: 'EXTERNAL DNS REQUESTS',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      metric: summary?.externalDnsRequests,
      displayValue:
        summary?.externalDnsRequests.value !== null && summary?.externalDnsRequests.value !== undefined
          ? summary.externalDnsRequests.value.toString()
          : 'Unavailable',
      origin: summary?.externalDnsRequests.origin || 'UNAVAILABLE',
      note: summary?.externalDnsRequests.note || 'DNS query monitor offline.',
      lastUpdated: summary?.externalDnsRequests.lastUpdated,
    },
    {
      id: 'egress-bytes',
      title: 'NETWORK EGRESS',
      icon: <ArrowUpRight className="w-4 h-4 text-amber-400" />,
      metric: summary?.networkEgressBytes,
      displayValue: summary?.networkEgressBytes.formatted || 'Unavailable',
      origin: summary?.networkEgressBytes.origin || 'UNAVAILABLE',
      note: summary?.networkEgressBytes.note || 'Egress byte monitor unprovisioned.',
      lastUpdated: summary?.networkEgressBytes.lastUpdated,
    },
    {
      id: 'local-avail',
      title: 'LOCAL SERVICE AVAILABILITY',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      metric: summary?.localServiceAvailabilityPercent,
      displayValue:
        summary?.localServiceAvailabilityPercent.value !== null &&
        summary?.localServiceAvailabilityPercent.value !== undefined
          ? `${summary.localServiceAvailabilityPercent.value}%`
          : 'Unavailable',
      origin: summary?.localServiceAvailabilityPercent.origin || 'UNAVAILABLE',
      note: summary?.localServiceAvailabilityPercent.note || 'Local health checker reporting no data.',
      lastUpdated: summary?.localServiceAvailabilityPercent.lastUpdated,
    },
  ]

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="font-bold uppercase tracking-wider text-text-primary">
          SOVEREIGNTY & AIR-GAP POSTURE SUMMARY
        </span>
        <span>MANDATORY PROVENANCE AUDITING</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-lg bg-surface border border-border p-4 shadow-industrial flex flex-col justify-between space-y-3 hover:border-border-strong transition-all"
          >
            {/* Header & Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold text-text-muted uppercase leading-tight">
                {card.title}
              </span>
              <div className="p-1.5 rounded bg-surface-sunken border border-border shrink-0">
                {card.icon}
              </div>
            </div>

            {/* Metric Value & Provenance Badge */}
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`text-2xl font-bold tracking-tight ${
                    card.displayValue === 'Unavailable' || card.displayValue === '—'
                      ? 'text-text-muted text-lg'
                      : card.origin === 'LIVE_API'
                      ? 'text-emerald-300'
                      : 'text-text-primary'
                  }`}
                >
                  {isLoading ? '...' : card.displayValue}
                </span>

                <ProvenanceBadge origin={card.origin} />
              </div>

              {/* Explanatory Note */}
              <p className="text-[10px] text-text-secondary leading-snug">
                {card.note}
              </p>
            </div>

            {/* Last Updated Timestamp */}
            {card.lastUpdated && (
              <div className="pt-2 border-t border-border/70 text-[9px] text-text-muted flex justify-between">
                <span>LAST REPORTED:</span>
                <span>{card.lastUpdated}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SovereigntySummaryGrid
