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
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 ${className}`}
          title="Telemetry directly returned by authenticated backend monitoring endpoint."
        >
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          LIVE API
        </span>
      )

    case 'DEV_TEST_DATA':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-amber-50 border border-amber-200 text-amber-800 ${className}`}
          title="Development / test harness fixture. Not evidence of physical air-gap enforcement."
        >
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          DEV / TEST
        </span>
      )

    case 'UNAVAILABLE':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-[#fafafa] border border-[#ebebeb] text-[#8f8f8f] ${className}`}
          title="Backend telemetry endpoint is unprovisioned, unreachable, or offline."
        >
          <HelpCircle className="w-3 h-3 text-[#8f8f8f]" />
          UNAVAILABLE
        </span>
      )
  }
}

export default ProvenanceBadge
