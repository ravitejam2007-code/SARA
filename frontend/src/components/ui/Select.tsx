import React, { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  sizeVariant?: 'sm' | 'md'
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      placeholder,
      id,
      disabled,
      sizeVariant = 'md',
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || generatedId

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-mono font-medium tracking-wide uppercase text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded bg-surface-sunken border border-border text-text-primary font-mono transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed pr-9 cursor-pointer',
              sizeVariant === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
              error
                ? 'border-industrial-error focus-visible:ring-industrial-error'
                : 'hover:border-border-strong focus-visible:border-border-highlight',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-surface text-text-muted">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-surface text-text-primary"
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 pointer-events-none text-text-muted flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs font-mono text-industrial-error">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] font-mono text-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
