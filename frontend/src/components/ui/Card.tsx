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
    default: 'bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    elevated: 'bg-white border border-[#ebebeb] shadow-[0_4px_12px_rgba(0,0,0,0.05)]',
    outlined: 'bg-transparent border border-[#ebebeb]',
    sunken: 'bg-[#fafafa] border border-[#ebebeb]',
  }

  return (
    <div
      className={cn(
        'rounded-[10px] p-5 transition-all',
        variantStyles[variant],
        hoverEffect && 'hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] cursor-pointer',
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
        'flex items-center justify-between pb-3 border-b border-[#ebebeb] mb-4',
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
        'text-sm font-semibold tracking-tight text-[#171717] font-sans',
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
    <p className={cn('text-xs text-[#8f8f8f] mt-0.5 font-sans', className)} {...props}>
      {children}
    </p>
  )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'pt-4 mt-4 border-t border-[#ebebeb] flex items-center justify-between text-xs text-[#8f8f8f]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
