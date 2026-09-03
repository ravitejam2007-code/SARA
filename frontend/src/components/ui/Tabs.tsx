import React, { createContext, useContext } from 'react'
import { cn } from '@/utils/cn'

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export interface TabsProps {
  activeTab: string
  onChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children, className }) => {
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: onChange }}>
      <div className={cn('w-full space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-[8px] bg-[#f5f5f5] p-1 border border-[#ebebeb] text-xs font-mono select-none overflow-x-auto max-w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  icon,
  badge,
  children,
  className,
  disabled,
  ...props
}) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabTrigger must be used within Tabs')

  const isActive = context.activeTab === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer',
        isActive
          ? 'bg-white text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#ebebeb] font-semibold'
          : 'text-[#8f8f8f] hover:text-[#171717] hover:bg-white/50 border border-transparent',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
  )
}

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabContent must be used within Tabs')

  if (context.activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn('animate-fade-in focus:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
}
