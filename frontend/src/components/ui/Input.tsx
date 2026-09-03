import React, { useId } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  sizeVariant?: 'sm' | 'md'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      value,
      disabled,
      id,
      sizeVariant = 'md',
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const hasValue = value !== undefined && value !== ''

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#171717]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#8f8f8f] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            value={value}
            disabled={disabled}
            className={cn(
              'w-full rounded-[6px] bg-white border border-[#ebebeb] text-[#171717] placeholder:text-[#8f8f8f] transition-all font-mono focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:opacity-50 disabled:cursor-not-allowed',
              sizeVariant === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
              leftIcon && (sizeVariant === 'sm' ? 'pl-8' : 'pl-9'),
              (rightIcon || (clearable && hasValue)) && (sizeVariant === 'sm' ? 'pr-8' : 'pr-9'),
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'hover:border-[#d4d4d4]',
              className
            )}
            {...props}
          />

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2.5 p-0.5 rounded text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!clearable && rightIcon && (
            <div className="absolute right-3 text-[#8f8f8f] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] text-red-600 font-mono">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#8f8f8f] font-mono">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
