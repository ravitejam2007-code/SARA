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
    md: 'h-2',
    lg: 'h-3',
  }

  const barColors = {
    info: 'bg-[#171717]',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    error: 'bg-[#ee0000]',
  }

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-[#8f8f8f] uppercase">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-[#171717] font-semibold">
              {percentage.toFixed(0)}%
            </span>
          )}
          {indeterminate && (
            <span className="text-[#8f8f8f] text-[10px] uppercase animate-pulse">
              CALCULATING...
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-[#ebebeb] relative',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            barColors[variant],
            indeterminate && 'w-1/3 animate-indeterminate absolute'
          )}
          style={!indeterminate ? { width: `${percentage}%` } : undefined}
        />
      </div>
    </div>
  )
}
