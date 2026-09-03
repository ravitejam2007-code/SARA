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
        'rounded-[8px] border border-red-200 bg-red-50/40 p-5 font-sans space-y-4 text-xs',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[6px] bg-red-100 border border-red-200 text-[#ee0000] shrink-0">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-[#ee0000] tracking-tight">
                {title}
              </h4>
              {code && (
                <Badge variant="error" size="sm">
                  {code}
                </Badge>
              )}
            </div>
            <p className="text-[#4d4d4d] leading-relaxed">{description}</p>
          </div>
        </div>

        {onRetry && (
          <Button
            size="xs"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RotateCw className="w-3 h-3" />}
            className="shrink-0"
          >
            {retryText}
          </Button>
        )}
      </div>

      {details && (
        <div className="space-y-2 pt-2 border-t border-red-200/60">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-[11px] text-[#8f8f8f] hover:text-[#171717] transition-colors cursor-pointer font-mono"
          >
            <span>{showDetails ? 'Hide technical trace' : 'View technical trace'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showDetails && (
            <div className="relative">
              <pre className="p-3 rounded-[6px] bg-white border border-red-200 text-[#ee0000] font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {details}
              </pre>

              <button
                type="button"
                onClick={handleCopyDetails}
                className="absolute top-2 right-2 p-1 rounded bg-[#fafafa] border border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717] transition-colors"
                title="Copy trace to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
