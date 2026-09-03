import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
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
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
    info: <Info className="w-4 h-4 text-[#0070f3]" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    error: <AlertOctagon className="w-4 h-4 text-[#ee0000]" />,
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-3.5 rounded-[8px] bg-white border border-[#ebebeb] shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-slide-down transition-all font-sans',
          )}
        >
          <div className="shrink-0 mt-0.5">{variantIcons[t.variant]}</div>

          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-semibold tracking-tight text-[#171717]">
              {t.title}
            </h5>
            {t.description && (
              <p className="text-[11px] text-[#8f8f8f] leading-relaxed">
                {t.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(t.id)}
            className="p-1 rounded text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
