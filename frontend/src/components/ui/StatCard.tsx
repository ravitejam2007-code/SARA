import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

export interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: {
    value: string
    positive?: boolean
  }
  icon?: React.ReactNode
  statusVariant?: 'cyan' | 'emerald' | 'amber' | 'crimson' | 'default'
  caption?: string
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  icon,
  caption,
  className,
}) => {
  return (
    <Card hoverEffect className={cn('relative overflow-hidden bg-white border border-[#ebebeb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]', className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[#8f8f8f]">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#171717] tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-mono text-[#8f8f8f] font-medium">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[#171717]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#ebebeb] text-xs">
        {trend && (
          <Badge
            variant={trend.positive ? 'emerald' : 'amber'}
            size="sm"
            className="font-mono text-[10px]"
          >
            {trend.positive ? '↑ ' : '↓ '}
            {trend.value}
          </Badge>
        )}
        {caption && (
          <span className="text-[#8f8f8f] font-mono text-[11px] truncate">
            {caption}
          </span>
        )}
      </div>
    </Card>
  )
}
