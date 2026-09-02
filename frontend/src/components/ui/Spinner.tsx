import React from 'react'
import { cn } from '@/utils/cn'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
  label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'info',
  label,
  className,
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-3.5 h-3.5 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4',
  }

  const colorStyles = {
    default: 'border-slate-700 border-t-slate-200',
    info: 'border-cyan-950 border-t-cyan-400',
    success: 'border-emerald-950 border-t-emerald-400',
    warning: 'border-amber-950 border-t-amber-400',
    error: 'border-rose-950 border-t-rose-400',
  }

  return (
    <div
      role="status"
      className={cn('inline-flex items-center gap-2 font-mono text-xs', className)}
      {...props}
    >
      <div
        className={cn(
          'rounded-full animate-spin shrink-0',
          sizeStyles[size],
          colorStyles[variant]
        )}
      />
      {label && <span className="text-text-secondary uppercase">{label}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
