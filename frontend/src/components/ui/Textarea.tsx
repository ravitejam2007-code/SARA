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
              className="block text-xs font-mono font-medium tracking-wide uppercase text-text-secondary"
            >
              {label}
            </label>
          )}

          {characterCount && (
            <span className="text-[11px] font-mono text-text-muted">
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
            'w-full rounded bg-surface-sunken border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted font-mono transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error
              ? 'border-industrial-error focus-visible:ring-industrial-error'
              : 'hover:border-border-strong focus-visible:border-border-highlight',
            className
          )}
          {...props}
        />

        {error && <p className="text-xs font-mono text-industrial-error">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] font-mono text-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
