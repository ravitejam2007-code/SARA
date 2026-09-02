import React, { useState, useRef } from 'react'
import { UploadCloud, File, X, AlertCircle } from 'lucide-react'
import { Badge } from './Badge'
import { cn } from '@/utils/cn'

export interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void
  acceptedExtensions?: string[]
  maxFileSizeMB?: number
  multiple?: boolean
  label?: string
  description?: string
  className?: string
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFilesSelected,
  acceptedExtensions = ['.step', '.stp', '.pdf', '.xml', '.json', '.csv'],
  maxFileSizeMB = 100,
  multiple = true,
  label = 'SOVEREIGN ASSET INGESTION ZONE',
  description = 'Drag & drop industrial CAD models, STEP files, or technical specs here',
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const validateAndAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setErrorMessage(null)

    const validFiles: File[] = []
    const maxBytes = maxFileSizeMB * 1024 * 1024

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check size
      if (file.size > maxBytes) {
        setErrorMessage(`File "${file.name}" exceeds maximum allowed limit of ${maxFileSizeMB} MB.`)
        continue
      }

      // Check extension if defined
      if (acceptedExtensions && acceptedExtensions.length > 0) {
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
        const isAllowed = acceptedExtensions.some((ext) => ext.toLowerCase() === fileExt)
        if (!isAllowed) {
          setErrorMessage(`File format "${fileExt}" is not permitted for sovereign ingestion.`)
          continue
        }
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles
      setSelectedFiles(updated)
      onFilesSelected(updated)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    validateAndAddFiles(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelected(updated)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn('w-full space-y-3 font-mono', className)}>
      {/* Drop Target Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 text-center rounded-md border-2 border-dashed transition-all cursor-pointer select-none',
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/20 shadow-glow-info scale-[1.01]'
            : 'border-border hover:border-border-strong bg-surface-sunken/60 hover:bg-surface-sunken'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          accept={acceptedExtensions.join(',')}
        />

        <div className="p-3 rounded-full bg-surface-elevated border border-border text-cyan-400 mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="text-sm font-semibold tracking-wide uppercase text-text-primary">
          {label}
        </h4>
        <p className="text-xs text-text-secondary mt-1 max-w-md">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          <span className="text-[10px] text-text-muted uppercase mr-1">SUPPORTED:</span>
          {acceptedExtensions.map((ext) => (
            <Badge key={ext} variant="default" size="sm" className="text-[10px] py-0">
              {ext}
            </Badge>
          ))}
          <span className="text-[10px] text-text-muted uppercase ml-1">
            (MAX {maxFileSizeMB}MB)
          </span>
        </div>
      </div>

      {/* Validation Alert */}
      {errorMessage && (
        <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Staged File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-text-secondary uppercase">
            Staged for Ingestion ({selectedFiles.length} files)
          </div>
          <div className="divide-y divide-border/60 border border-border rounded bg-surface overflow-hidden">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between px-3 py-2 text-xs hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <File className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate text-text-primary">{file.name}</span>
                  <span className="text-text-muted text-[11px] shrink-0">
                    ({formatFileSize(file.size)})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(idx)
                  }}
                  className="p-1 text-text-muted hover:text-rose-400 transition-colors"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
