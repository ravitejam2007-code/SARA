import React, { useState } from 'react'
import { cn } from '@/utils/cn'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
  delay = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  const show = () => {
    const id = window.setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none whitespace-nowrap rounded bg-surface-overlay border border-border-strong px-2.5 py-1 text-[11px] font-mono text-text-primary shadow-industrial-elevated animate-fade-in',
            positionStyles[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
