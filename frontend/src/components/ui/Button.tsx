import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  pill?: boolean
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
      pill = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-1 select-none font-sans cursor-pointer'

    const variantStyles = {
      primary:
        'bg-[#171717] hover:bg-black text-white shadow-sm border border-[#171717]',
      secondary:
        'bg-white hover:bg-[#f5f5f5] text-[#171717] border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
      outline:
        'bg-transparent hover:bg-[#f5f5f5] text-[#171717] border border-[#ebebeb]',
      ghost:
        'bg-transparent hover:bg-[#f5f5f5] text-[#4d4d4d] hover:text-[#171717] border border-transparent',
      destructive:
        'bg-[#ee0000] hover:bg-[#c50000] text-white border border-[#ee0000] shadow-sm',
      info:
        'bg-[#0070f3] hover:bg-[#0761d1] text-white border border-[#0070f3] shadow-sm',
    }

    const sizeStyles = {
      xs: 'text-[11px] px-2 py-1 gap-1 font-mono rounded-[4px]',
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-[6px]',
      md: 'text-sm px-3.5 py-2 gap-2 rounded-[6px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 rounded-[8px]',
    }

    const pillStyle = pill ? 'rounded-full' : ''

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], pillStyle, className)}
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
