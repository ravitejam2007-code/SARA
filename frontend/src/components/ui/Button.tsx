import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-ring select-none'

    const variantStyles = {
      primary:
        'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold shadow-sm hover:shadow-glow-info border border-cyan-400/30',
      secondary:
        'bg-surface-elevated hover:bg-surface-hover text-text-primary border border-border hover:border-border-strong',
      outline:
        'bg-transparent hover:bg-surface-elevated text-text-primary border border-border hover:border-border-strong',
      ghost:
        'bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-transparent',
      destructive:
        'bg-industrial-error-muted hover:bg-red-900/90 text-red-200 border border-industrial-error-border hover:border-red-600 shadow-sm hover:shadow-glow-error',
      info:
        'bg-industrial-info-subtle hover:bg-cyan-950/80 text-cyan-300 border border-industrial-info-border hover:border-cyan-400',
    }

    const sizeStyles = {
      xs: 'text-[11px] px-2 py-1 gap-1 font-mono',
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-mono',
      md: 'text-sm px-3.5 py-2 gap-2 font-mono',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
