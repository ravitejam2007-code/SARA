import React, { useId } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  characterCount?: boolean
  maxCharacters?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      characterCount = false,
      maxCharacters,
      value,
      disabled,
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = id || generatedId
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-medium text-[#171717]"
            >
              {label}
            </label>
          )}

          {characterCount && (
            <span className="text-[11px] font-mono text-[#8f8f8f]">
              {currentLength}
              {maxCharacters ? ` / ${maxCharacters}` : ' chars'}
            </span>
          )}
        </div>

        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          disabled={disabled}
          rows={rows}
          maxLength={maxCharacters}
          className={cn(
            'w-full rounded-[6px] bg-white border border-[#ebebeb] px-3 py-2 text-sm text-[#171717] placeholder:text-[#8f8f8f] font-mono transition-all focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'hover:border-[#d4d4d4]',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-[11px] text-red-600 font-mono">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#8f8f8f] font-mono">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
