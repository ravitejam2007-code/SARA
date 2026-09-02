import React from 'react'
import { AlertTriangle, Info, AlertOctagon } from 'lucide-react'
import { Modal, ModalBody, ModalFooter } from './Modal'
import { Button } from './Button'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'info' | 'warning' | 'destructive'
  isLoading?: boolean
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}) => {
  const iconConfig = {
    info: {
      icon: Info,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      btnVariant: 'primary' as const,
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      btnVariant: 'secondary' as const,
    },
    destructive: {
      icon: AlertOctagon,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      btnVariant: 'destructive' as const,
    },
  }

  const { icon: Icon, color, btnVariant } = iconConfig[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <ModalBody className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded border ${color} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold font-mono text-text-primary uppercase">
              {title}
            </h4>
            <p className="text-xs font-mono text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={btnVariant}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
