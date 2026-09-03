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
    online: 'bg-emerald-600',
    secure: 'bg-emerald-600',
    warning: 'bg-amber-600',
    critical: 'bg-[#ee0000]',
    standby: 'bg-[#8f8f8f]',
  }

  const glowColors = {
    online: 'bg-emerald-400/40',
    secure: 'bg-emerald-400/40',
    warning: 'bg-amber-400/40',
    critical: 'bg-red-400/40',
    standby: 'bg-slate-400/40',
  }

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={cn(
              'absolute h-3 w-3 rounded-full animate-ping opacity-75',
              glowColors[status]
            )}
          />
        )}
        <span className={cn('relative h-2 w-2 rounded-full ring-2 ring-white', statusColors[status])} />
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col leading-none">
          {label && (
            <span className="text-xs font-mono font-semibold tracking-wide text-[#171717] uppercase">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] font-mono text-[#8f8f8f] mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
