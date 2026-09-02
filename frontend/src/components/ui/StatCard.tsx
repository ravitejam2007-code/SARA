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
  statusVariant = 'cyan',
  caption,
  className,
}) => {
  return (
    <Card hoverEffect className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-slate-400">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-mono text-slate-400 font-medium">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs">
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
          <span className="text-slate-500 font-mono text-[11px] truncate">
            {caption}
          </span>
        )}
      </div>

      {/* Subtle top indicator border accent */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-[2px]',
          statusVariant === 'cyan' && 'bg-cyan-500',
          statusVariant === 'emerald' && 'bg-emerald-500',
          statusVariant === 'amber' && 'bg-amber-500',
          statusVariant === 'crimson' && 'bg-rose-500',
          statusVariant === 'default' && 'bg-slate-700'
        )}
      />
    </Card>
  )
}
