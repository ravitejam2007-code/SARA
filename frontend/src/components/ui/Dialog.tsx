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
      color: 'text-[#0070f3] bg-blue-50 border-blue-200',
      btnVariant: 'primary' as const,
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      btnVariant: 'secondary' as const,
    },
    destructive: {
      icon: AlertOctagon,
      color: 'text-[#ee0000] bg-red-50 border-red-200',
      btnVariant: 'destructive' as const,
    },
  }

  const { icon: Icon, color, btnVariant } = iconConfig[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <ModalBody className="space-y-4 font-sans">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-[8px] border ${color} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#171717]">
              {title}
            </h4>
            <p className="text-xs text-[#4d4d4d] leading-relaxed">
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
