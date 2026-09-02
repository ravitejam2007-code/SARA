import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-cyan-500'

  const variantStyles = {
    primary:
      'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold shadow-sm hover:shadow-industrial-glow border border-cyan-400/30',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-500',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 border border-transparent',
    destructive:
      'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 hover:border-rose-700',
  }

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-mono',
    md: 'text-sm px-3.5 py-2 gap-2 font-mono',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}
