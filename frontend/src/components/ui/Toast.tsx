import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
  toast: {
    (title: string, description?: string): void
    success: (title: string, description?: string) => void
    error: (title: string, description?: string) => void
    warning: (title: string, description?: string) => void
    info: (title: string, description?: string) => void
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      const newToast: ToastItem = { id, title, description, variant, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const toastMethods = Object.assign(
    (title: string, description?: string) => addToast({ title, description, variant: 'info' }),
    {
      success: (title: string, description?: string) =>
        addToast({ title, description, variant: 'success' }),
      error: (title: string, description?: string) =>
        addToast({ title, description, variant: 'error' }),
      warning: (title: string, description?: string) =>
        addToast({ title, description, variant: 'warning' }),
      info: (title: string, description?: string) =>
        addToast({ title, description, variant: 'info' }),
    }
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast: toastMethods }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const variantIcons = {
    info: <Info className="w-4 h-4 text-cyan-400" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    error: <AlertOctagon className="w-4 h-4 text-rose-400" />,
  }

  const variantBorders = {
    info: 'border-cyan-800/80 bg-surface-elevated/95 shadow-glow-info',
    success: 'border-emerald-800/80 bg-surface-elevated/95 shadow-glow-success',
    warning: 'border-amber-800/80 bg-surface-elevated/95 shadow-glow-warning',
    error: 'border-rose-800/80 bg-surface-elevated/95 shadow-glow-error',
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto rounded-md border p-3.5 shadow-industrial-elevated backdrop-blur-md font-mono animate-slide-down flex items-start gap-3 transition-all',
            variantBorders[item.variant || 'info']
          )}
        >
          <div className="shrink-0 mt-0.5">{variantIcons[item.variant || 'info']}</div>

          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
              {item.title}
            </h5>
            {item.description && (
              <p className="text-[11px] text-text-secondary leading-normal">
                {item.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
