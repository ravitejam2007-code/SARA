import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
  variant?: 'default' | 'elevated' | 'outlined' | 'sunken'
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-border shadow-industrial',
    elevated: 'bg-surface-elevated border border-border-strong shadow-industrial-elevated',
    outlined: 'bg-transparent border border-border',
    sunken: 'bg-surface-sunken border border-border-subtle',
  }

  return (
    <div
      className={cn(
        'rounded-md p-5 transition-all',
        variantStyles[variant],
        hoverEffect && 'industrial-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between pb-3 border-b border-border/80 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn(
        'text-sm font-semibold tracking-wide uppercase font-mono text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-text-secondary mt-0.5', className)} {...props}>
      {children}
    </p>
  )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return <div className={cn('space-y-3', className)} {...props}>{children}</div>
}

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'pt-3 mt-4 border-t border-border/80 flex items-center justify-between text-xs text-text-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
