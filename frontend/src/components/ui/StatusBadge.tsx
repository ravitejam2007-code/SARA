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
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-800',
      dotColor: 'bg-emerald-600',
    },
    online: {
      text: 'ONLINE',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-800',
      dotColor: 'bg-emerald-600',
    },
    standby: {
      text: 'STANDBY',
      bg: 'bg-[#fafafa]',
      border: 'border-[#ebebeb]',
      textColor: 'text-[#4d4d4d]',
      dotColor: 'bg-[#8f8f8f]',
    },
    warning: {
      text: 'DEGRADED',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      textColor: 'text-amber-800',
      dotColor: 'bg-amber-600',
    },
    critical: {
      text: 'CRITICAL',
      bg: 'bg-red-50',
      border: 'border-red-200',
      textColor: 'text-[#ee0000]',
      dotColor: 'bg-[#ee0000]',
    },
    offline: {
      text: 'OFFLINE',
      bg: 'bg-[#fafafa]',
      border: 'border-[#ebebeb]',
      textColor: 'text-[#8f8f8f]',
      dotColor: 'bg-[#8f8f8f]',
    },
    'air-gapped': {
      text: 'AIR-GAPPED',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-800',
      dotColor: 'bg-emerald-600',
    },
  }

  const config = statusConfig[status] || statusConfig.operational
  const displayText = label || config.text

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 font-mono tracking-wider uppercase rounded-full',
    md: 'text-xs px-2.5 py-1 gap-2 font-mono tracking-wide rounded-full',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center border font-medium select-none',
        config.bg,
        config.border,
        config.textColor,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full shrink-0',
          config.dotColor,
          pulse && 'animate-pulse'
        )}
      />
      <span>{displayText}</span>
    </span>
  )
}
