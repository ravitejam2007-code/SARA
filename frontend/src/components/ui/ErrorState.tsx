import React, { useState } from 'react'
import { AlertOctagon, RotateCw, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { cn } from '@/utils/cn'

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  code?: string
  description: string
  details?: string
  onRetry?: () => void
  retryText?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Execution Interrupted',
  code = 'ERR_SOVEREIGN_RESOURCE_FAULT',
  description,
  details,
  onRetry,
  retryText = 'Retry Operation',
  className,
  ...props
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyDetails = () => {
    if (!details) return
    navigator.clipboard.writeText(details)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-md border border-industrial-error-border bg-industrial-error-subtle p-5 font-mono space-y-4 text-xs',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-rose-950/80 border border-rose-800/80 text-rose-400 shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-rose-200 tracking-wide uppercase">
                {title}
              </h4>
              {code && (
                <Badge variant="error" size="sm">
                  {code}
                </Badge>
              )}
            </div>
            <p className="text-text-secondary leading-relaxed">{description}</p>
          </div>
        </div>

        {onRetry && (
          <Button
            variant="destructive"
            size="xs"
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
            onClick={onRetry}
            className="shrink-0"
          >
            {retryText}
          </Button>
        )}
      </div>

      {details && (
        <div className="pt-2 border-t border-rose-900/30">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex items-center gap-1.5 text-[11px] text-rose-400 hover:text-rose-300 transition-colors uppercase font-semibold"
          >
            <span>{showDetails ? 'Hide Diagnostics' : 'Inspect Diagnostic Dump'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-2.5 relative">
              <pre className="p-3 rounded bg-surface-sunken border border-border text-[11px] text-text-muted overflow-x-auto max-h-48 leading-tight font-mono">
                {details}
              </pre>
              <button
                type="button"
                onClick={handleCopyDetails}
                className="absolute top-2 right-2 p-1 rounded bg-surface-elevated border border-border text-text-muted hover:text-text-primary transition-colors"
                title="Copy diagnostic trace"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
