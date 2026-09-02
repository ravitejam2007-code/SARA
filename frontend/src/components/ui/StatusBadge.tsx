import React from 'react'
import { cn } from '@/utils/cn'

export type OperationalStatus =
  | 'operational'
  | 'online'
  | 'standby'
  | 'warning'
  | 'critical'
  | 'offline'
  | 'air-gapped'

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: OperationalStatus
  label?: string
  pulse?: boolean
  size?: 'sm' | 'md'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulse = true,
  size = 'sm',
  className,
  ...props
}) => {
  const statusConfig: Record<
    OperationalStatus,
    { text: string; bg: string; border: string; textColor: string; dotColor: string }
  > = {
    operational: {
      text: 'OPERATIONAL',
      bg: 'bg-emerald-950/50',
      border: 'border-emerald-800/60',
      textColor: 'text-emerald-300',
      dotColor: 'bg-emerald-400',
    },
    online: {
      text: 'ONLINE',
      bg: 'bg-emerald-950/50',
      border: 'border-emerald-800/60',
      textColor: 'text-emerald-300',
      dotColor: 'bg-emerald-400',
    },
    standby: {
      text: 'STANDBY',
      bg: 'bg-slate-900/80',
      border: 'border-slate-700/80',
      textColor: 'text-slate-300',
      dotColor: 'bg-slate-400',
    },
    warning: {
      text: 'DEGRADED',
      bg: 'bg-amber-950/50',
      border: 'border-amber-800/60',
      textColor: 'text-amber-300',
      dotColor: 'bg-amber-400',
    },
    critical: {
      text: 'CRITICAL',
      bg: 'bg-rose-950/60',
      border: 'border-rose-800/70',
      textColor: 'text-rose-300',
      dotColor: 'bg-rose-500',
    },
    offline: {
      text: 'OFFLINE',
      bg: 'bg-slate-950',
      border: 'border-slate-800',
      textColor: 'text-slate-500',
      dotColor: 'bg-slate-600',
    },
    'air-gapped': {
      text: 'AIR-GAPPED',
      bg: 'bg-cyan-950/50',
      border: 'border-cyan-800/60',
      textColor: 'text-cyan-300',
      dotColor: 'bg-cyan-400',
    },
  }

  const config = statusConfig[status] || statusConfig.standby
  const displayText = label || config.text

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 font-mono font-medium',
    md: 'text-xs px-2.5 py-1 gap-2 font-mono font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border tracking-wider uppercase transition-colors',
        config.bg,
        config.border,
        config.textColor,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {pulse && status !== 'offline' && status !== 'standby' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              config.dotColor
            )}
          />
        )}
        <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', config.dotColor)} />
      </span>
      <span>{displayText}</span>
    </span>
  )
}
