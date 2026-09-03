import React from 'react'
import { cn } from '@/utils/cn'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
  label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  label,
  className,
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-3.5 h-3.5 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-[2.5px]',
    xl: 'w-10 h-10 border-3',
  }

  const colorStyles = {
    default: 'border-[#ebebeb] border-t-[#171717]',
    info: 'border-[#d3e5ff] border-t-[#0070f3]',
    success: 'border-emerald-200 border-t-emerald-600',
    warning: 'border-amber-200 border-t-amber-600',
    error: 'border-red-200 border-t-[#ee0000]',
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
      {label && <span className="text-[#8f8f8f] uppercase">{label}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
