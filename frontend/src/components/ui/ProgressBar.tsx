import React from 'react'
import { cn } from '@/utils/cn'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'info' | 'success' | 'warning' | 'error'
  indeterminate?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'info',
  indeterminate = false,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const barColors = {
    info: 'bg-cyan-500 shadow-glow-info',
    success: 'bg-emerald-500 shadow-glow-success',
    warning: 'bg-amber-500 shadow-glow-warning',
    error: 'bg-rose-500 shadow-glow-error',
  }

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-text-secondary uppercase">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-text-primary font-semibold">
              {percentage.toFixed(0)}%
            </span>
          )}
          {indeterminate && (
            <span className="text-text-muted text-[10px] uppercase animate-pulse">
              CALCULATING...
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-surface-sunken border border-border/80 relative',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {indeterminate ? (
          <div
            className={cn(
              'h-full rounded-full w-1/3 animate-shimmer absolute inset-0',
              barColors[variant]
            )}
            style={{
              animation: 'indeterminate 1.5s infinite linear',
            }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-300', barColors[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}
