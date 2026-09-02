import React from 'react'
import { Radio, AlertTriangle, HelpCircle } from 'lucide-react'
import type { DataSourceOrigin } from '@/types/security'

export interface ProvenanceBadgeProps {
  origin: DataSourceOrigin
  className?: string
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ origin, className = '' }) => {
  switch (origin) {
    case 'LIVE_API':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 ${className}`}
          title="Telemetry directly returned by authenticated backend monitoring endpoint."
        >
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          LIVE API
        </span>
      )

    case 'DEV_TEST_DATA':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-amber-950/60 border border-amber-600/60 text-amber-300 ${className}`}
          title="Development / test harness fixture. Not evidence of physical air-gap enforcement."
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          DEV / TEST DATA
        </span>
      )

    case 'UNAVAILABLE':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-slate-900 border border-slate-700 text-slate-400 ${className}`}
          title="Backend telemetry endpoint is unprovisioned, unreachable, or offline."
        >
          <HelpCircle className="w-3 h-3 text-slate-500" />
          UNAVAILABLE
        </span>
      )
  }
}

export default ProvenanceBadge
