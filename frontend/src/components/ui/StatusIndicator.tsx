import React from 'react'
import { cn } from '@/utils/cn'

export interface StatusIndicatorProps {
  status: 'online' | 'secure' | 'warning' | 'critical' | 'standby'
  label?: string
  sublabel?: string
  pulse?: boolean
  className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  sublabel,
  pulse = true,
  className,
}) => {
  const statusColors = {
    online: 'bg-emerald-400',
    secure: 'bg-cyan-400',
    warning: 'bg-amber-400',
    critical: 'bg-rose-500',
    standby: 'bg-slate-500',
  }

  const glowColors = {
    online: 'bg-emerald-400/40',
    secure: 'bg-cyan-400/40',
    warning: 'bg-amber-400/40',
    critical: 'bg-rose-500/40',
    standby: 'bg-slate-500/40',
  }

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={cn(
              'absolute h-3.5 w-3.5 rounded-full animate-ping opacity-75',
              glowColors[status]
            )}
          />
        )}
        <span className={cn('relative h-2.5 w-2.5 rounded-full ring-2 ring-slate-900', statusColors[status])} />
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col leading-none">
          {label && (
            <span className="text-xs font-mono font-semibold tracking-wide text-slate-200 uppercase">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] font-mono text-slate-400 mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
