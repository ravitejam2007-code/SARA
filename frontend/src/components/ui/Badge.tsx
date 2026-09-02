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
    default: 'bg-surface-elevated text-text-secondary border-border',
    info: 'bg-industrial-info-subtle text-cyan-300 border-industrial-info-border',
    success: 'bg-industrial-success-subtle text-emerald-300 border-industrial-success-border',
    warning: 'bg-industrial-warning-subtle text-amber-300 border-industrial-warning-border',
    error: 'bg-industrial-error-subtle text-rose-300 border-industrial-error-border',
    outline: 'bg-transparent text-text-secondary border-border',
    // Aliases for backward compatibility
    cyan: 'bg-industrial-info-subtle text-cyan-300 border-industrial-info-border',
    emerald: 'bg-industrial-success-subtle text-emerald-300 border-industrial-success-border',
    amber: 'bg-industrial-warning-subtle text-amber-300 border-industrial-warning-border',
    crimson: 'bg-industrial-error-subtle text-rose-300 border-industrial-error-border',
  }

  const dotColors: Record<string, string> = {
    default: 'bg-text-muted',
    info: 'bg-cyan-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    outline: 'bg-text-muted',
    cyan: 'bg-cyan-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    crimson: 'bg-rose-400',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider uppercase font-mono font-medium',
    md: 'text-xs px-2.5 py-1 tracking-wide font-mono font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border transition-colors',
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
