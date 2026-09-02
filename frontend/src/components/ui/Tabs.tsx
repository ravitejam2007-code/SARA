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
        'inline-flex items-center gap-1 rounded bg-surface-sunken p-1 border border-border text-xs font-mono select-none overflow-x-auto max-w-full',
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
        'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all focus-ring disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap',
        isActive
          ? 'bg-surface-elevated text-cyan-300 shadow-sm border border-border-strong font-semibold'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface/60',
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
      className={cn('animate-fade-in focus-ring', className)}
      {...props}
    >
      {children}
    </div>
  )
}
