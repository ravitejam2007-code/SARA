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
    <div className="rounded-lg border border-amber-800/60 bg-amber-950/25 p-4 text-xs font-mono shadow-industrial space-y-3">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span>SECURITY TELEMETRY PROVENANCE ADVISORY</span>
              {currentMode === 'DEV_TEST_DATA' && (
                <span className="px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 text-[10px] font-bold">
                  SIMULATION ACTIVE
                </span>
              )}
            </h2>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">
              Security telemetry is provenance-aware. <strong className="text-emerald-300">LIVE API</strong> values are
              returned by backend monitoring. <strong className="text-amber-300">DEV / TEST DATA</strong> is simulated
              and not evidence of physical air-gap enforcement. <strong className="text-slate-300">UNAVAILABLE</strong>{' '}
              means telemetry has not been provisioned. The frontend visualizes security telemetry but does not
              independently certify hardware isolation.
            </p>
          </div>
        </div>

        {/* Development Provenance Mode Selector (Phase 10) */}
        {onModeChange && (
          <div className="shrink-0 flex items-center gap-1.5 p-1.5 rounded bg-surface-sunken border border-border text-[11px]">
            <span className="text-text-muted px-1 uppercase font-semibold">TEST MODE:</span>
            {(['DEV_TEST_DATA', 'LIVE_API', 'UNAVAILABLE'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onModeChange(mode)}
                className={`px-2 py-1 rounded border text-[10px] font-bold transition-colors cursor-pointer ${
                  currentMode === mode
                    ? mode === 'LIVE_API'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : mode === 'DEV_TEST_DATA'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-600 text-slate-300'
                    : 'bg-surface border-border text-text-muted hover:text-text-primary'
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
        <div className="flex items-center gap-2 pt-2 border-t border-amber-900/40 text-[10px] text-amber-400 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            NOTICE: Currently displaying development fixtures. In a production audit, switch to LIVE API or connect to an authoritative backend monitoring node.
          </span>
        </div>
      )}
    </div>
  )
}

export default TransparencyBanner
