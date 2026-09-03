import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'outline'
    | 'cyan'
    | 'emerald'
    | 'amber'
    | 'crimson'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles: Record<string, string> = {
    default: 'bg-[#fafafa] text-[#171717] border-[#ebebeb]',
    info: 'bg-[#f0f7ff] text-[#0070f3] border-[#d3e5ff]',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-[#ee0000] border-red-200',
    outline: 'bg-transparent text-[#4d4d4d] border-[#ebebeb]',
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    crimson: 'bg-red-50 text-red-800 border-red-200',
  }

  const dotColors: Record<string, string> = {
    default: 'bg-[#8f8f8f]',
    info: 'bg-[#0070f3]',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    error: 'bg-[#ee0000]',
    outline: 'bg-[#8f8f8f]',
    cyan: 'bg-cyan-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    crimson: 'bg-red-600',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-mono font-medium rounded-full',
    md: 'text-xs px-2.5 py-1 tracking-wide font-mono font-medium rounded-full',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border transition-colors select-none',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0 animate-pulse',
            dotColors[variant] || dotColors.default
          )}
        />
      )}
      {children}
    </span>
  )
}
