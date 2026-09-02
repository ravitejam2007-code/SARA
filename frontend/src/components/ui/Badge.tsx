import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cyan' | 'emerald' | 'amber' | 'crimson' | 'outline'
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
  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700',
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    crimson: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
    outline: 'bg-transparent text-slate-400 border-slate-700',
  }

  const dotColors = {
    default: 'bg-slate-400',
    cyan: 'bg-cyan-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    crimson: 'bg-rose-400',
    outline: 'bg-slate-400',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider uppercase font-mono font-medium',
    md: 'text-xs px-2.5 py-1 tracking-wide font-mono font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  )
}
