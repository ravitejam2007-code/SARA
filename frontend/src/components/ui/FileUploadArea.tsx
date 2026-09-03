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
          setErrorMessage(
            `File type "${fileExt}" is not permitted. Supported: ${acceptedExtensions.join(', ')}`
          )
          continue
        }
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      const newFileList = multiple ? [...selectedFiles, ...validFiles] : validFiles
      setSelectedFiles(newFileList)
      onFilesSelected(newFileList)
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
          'relative flex flex-col items-center justify-center p-8 text-center rounded-[10px] border border-dashed transition-all cursor-pointer select-none',
          isDragOver
            ? 'border-[#171717] bg-[#f5f5f5]'
            : 'border-[#ebebeb] hover:border-[#171717] bg-[#fafafa] hover:bg-[#f5f5f5]'
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

        <div className="p-3 rounded-full bg-white border border-[#ebebeb] text-[#171717] mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <UploadCloud className="w-5 h-5" />
        </div>

        <h4 className="text-sm font-semibold tracking-tight text-[#171717] font-sans">
          {label}
        </h4>
        <p className="text-xs text-[#8f8f8f] mt-1 max-w-md font-sans">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          <span className="text-[10px] text-[#8f8f8f] uppercase mr-1">SUPPORTED:</span>
          {acceptedExtensions.map((ext) => (
            <Badge key={ext} variant="default" size="sm" className="text-[10px] py-0">
              {ext}
            </Badge>
          ))}
        </div>
      </div>

      {/* Validation Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-[6px] bg-red-50 border border-red-200 text-xs text-[#ee0000]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Staged File Badges List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-[#8f8f8f]">
            <span>STAGED FILES ({selectedFiles.length}):</span>
            <button
              type="button"
              onClick={() => {
                setSelectedFiles([])
                onFilesSelected([])
              }}
              className="text-[11px] text-[#8f8f8f] hover:text-[#ee0000] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-[6px] bg-white border border-[#ebebeb] text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <File className="w-4 h-4 text-[#8f8f8f] shrink-0" />
                  <span className="truncate text-[#171717] font-medium" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-[10px] text-[#8f8f8f] shrink-0 font-mono">
                    ({formatFileSize(file.size)})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(idx)
                  }}
                  className="p-1 rounded text-[#8f8f8f] hover:text-[#ee0000] hover:bg-[#f5f5f5] transition-colors cursor-pointer shrink-0"
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
