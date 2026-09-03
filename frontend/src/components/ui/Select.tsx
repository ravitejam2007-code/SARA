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
            className="block text-xs font-medium text-[#171717]"
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
              'w-full appearance-none rounded-[6px] bg-white border border-[#ebebeb] text-[#171717] font-mono transition-all focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:opacity-50 disabled:cursor-not-allowed pr-9 cursor-pointer',
              sizeVariant === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'hover:border-[#d4d4d4]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-[#8f8f8f]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white text-[#171717]">
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 text-[#8f8f8f] pointer-events-none flex items-center">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
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

Select.displayName = 'Select'
