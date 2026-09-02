import React from 'react'
import { FileQuestion } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded border border-dashed border-border bg-surface-sunken/60 font-mono space-y-4',
        className
      )}
      {...props}
    >
      <div className="p-3 rounded-full bg-surface-elevated border border-border text-text-muted">
        {icon || <FileQuestion className="w-6 h-6 text-cyan-400" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold tracking-wide uppercase text-text-primary">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
