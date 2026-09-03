import React from 'react'
import { ShieldAlert, AlertTriangle } from 'lucide-react'
import type { DataSourceOrigin } from '@/types/security'

export interface TransparencyBannerProps {
  currentMode: DataSourceOrigin
  onModeChange?: (mode: DataSourceOrigin) => void
}

export const TransparencyBanner: React.FC<TransparencyBannerProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="rounded-[10px] border border-amber-200 bg-amber-50/40 p-4 text-xs font-mono shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <span>SECURITY TELEMETRY PROVENANCE ADVISORY</span>
              {currentMode === 'DEV_TEST_DATA' && (
                <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                  SIMULATION ACTIVE
                </span>
              )}
            </h2>
            <p className="text-amber-900/80 leading-relaxed text-[11px] font-sans">
              Security telemetry is provenance-aware. <strong className="text-emerald-800">LIVE API</strong> values are
              returned by backend monitoring. <strong className="text-amber-900">DEV / TEST DATA</strong> is simulated
              and not evidence of physical air-gap enforcement. <strong className="text-[#8f8f8f]">UNAVAILABLE</strong>{' '}
              means telemetry has not been provisioned. The frontend visualizes security telemetry but does not
              independently certify hardware isolation.
            </p>
          </div>
        </div>

        {/* Development Provenance Mode Selector */}
        {onModeChange && (
          <div className="shrink-0 flex items-center gap-1.5 p-1.5 rounded-[6px] bg-white border border-[#ebebeb] text-[11px]">
            <span className="text-[#8f8f8f] px-1 uppercase font-semibold">TEST MODE:</span>
            {(['DEV_TEST_DATA', 'LIVE_API', 'UNAVAILABLE'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onModeChange(mode)}
                className={`px-2 py-1 rounded-[4px] border text-[10px] font-bold transition-colors cursor-pointer ${
                  currentMode === mode
                    ? 'bg-[#171717] border-[#171717] text-white'
                    : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
                }`}
              >
                {mode === 'DEV_TEST_DATA' ? 'DEV / TEST' : mode === 'LIVE_API' ? 'LIVE API' : 'UNAVAILABLE'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Warning indicator if in DEV / TEST mode */}
      {currentMode === 'DEV_TEST_DATA' && (
        <div className="flex items-center gap-2 pt-2 border-t border-amber-200 text-[10px] text-amber-800 font-semibold font-sans">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          <span>
            NOTICE: Currently displaying development fixtures. In a production audit, switch to LIVE API or connect to an authoritative backend monitoring node.
          </span>
        </div>
      )}
    </div>
  )
}
