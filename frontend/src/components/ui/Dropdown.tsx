import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

export interface DropdownItem {
  label: string
  onClick?: () => void
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean
  separator?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-1.5 w-48 rounded-[8px] bg-white border border-[#ebebeb] py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-slide-down focus:outline-none',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return <div key={`sep-${index}`} className="my-1 border-t border-[#ebebeb]" />
            }

            return (
              <button
                key={item.label}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.onClick) item.onClick()
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-[calc(100%-8px)] mx-1 items-center gap-2.5 px-2.5 py-1.5 text-xs font-sans rounded-[4px] transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
                  item.destructive
                    ? 'text-[#ee0000] hover:bg-red-50 hover:text-[#ee0000]'
                    : 'text-[#4d4d4d] hover:bg-[#f5f5f5] hover:text-[#171717]'
                )}
              >
                {item.icon && <span className="shrink-0 flex items-center text-[#8f8f8f]">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
