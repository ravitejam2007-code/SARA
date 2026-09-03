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
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[10px] border border-dashed border-[#ebebeb] bg-[#fafafa]/50 font-sans space-y-4',
        className
      )}
      {...props}
    >
      <div className="p-3 rounded-full bg-white border border-[#ebebeb] text-[#8f8f8f] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {icon || <FileQuestion className="w-5 h-5 text-[#8f8f8f]" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold tracking-tight text-[#171717]">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-[#8f8f8f] leading-relaxed">{description}</p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
