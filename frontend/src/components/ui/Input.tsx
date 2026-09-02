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
            className="block text-xs font-mono font-medium tracking-wide uppercase text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            value={value}
            disabled={disabled}
            className={cn(
              'w-full rounded bg-surface-sunken border border-border text-text-primary placeholder:text-text-muted transition-colors font-mono focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
              sizeVariant === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
              leftIcon && (sizeVariant === 'sm' ? 'pl-8' : 'pl-9'),
              (rightIcon || (clearable && hasValue)) && (sizeVariant === 'sm' ? 'pr-8' : 'pr-9'),
              error
                ? 'border-industrial-error focus-visible:ring-industrial-error'
                : 'hover:border-border-strong focus-visible:border-border-highlight',
              className
            )}
            {...props}
          />

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2.5 p-0.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!clearable && rightIcon && (
            <div className="absolute right-3 text-text-muted pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs font-mono text-industrial-error">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] font-mono text-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
