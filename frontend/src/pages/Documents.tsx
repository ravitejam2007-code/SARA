import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  FileText,
  Upload,
  Search,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Cpu,
  Database,
  Clock,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  ArrowUpDown,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'

import { fileApi } from '@/services/fileApi'
import type { DocumentItem, DocumentType, ProcessingStatus } from '@/types/document'

export const Documents: React.FC = () => {
  const { toast } = useToast()

  // State Management
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [dateFilter, setDateFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'name' | 'sizeBytes' | 'uploadedAt' | 'processingStatus'>('uploadedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Upload Staging State
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Action Modals State
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null)
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)

  // Interactive UI State Simulation Toggle
  const [simulatedState, setSimulatedState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal')

  const loadDocuments = async (overrideState?: 'normal' | 'loading' | 'empty' | 'error') => {
    const active = overrideState || simulatedState
    setIsLoading(true)
    setError(null)

    if (active === 'loading') return

    if (active === 'error') {
      await new Promise((r) => setTimeout(r, 400))
      setError('COMMUNICATION_FAULT: Sovereign Document Storage Vault did not respond.')
      setIsLoading(false)
      return
    }

    try {
      const docs = await fileApi.getDocuments({
        query: searchQuery,
        type: typeFilter as any,
        status: statusFilter as any,
        sortBy,
        sortOrder,
      })

      if (active === 'empty') {
        setDocuments([])
      } else {
        setDocuments(docs)
      }
    } catch {
      setError('Failed to fetch document ledger.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments(simulatedState)
  }, [simulatedState, typeFilter, statusFilter, sortBy, sortOrder])

  // Client-side quick filter for search & date
  const filteredDocuments = useMemo(() => {
    let list = [...documents]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.uploadedBy.toLowerCase().includes(q) ||
          d.checksumSha256.toLowerCase().includes(q)
      )
    }

    if (dateFilter !== 'ALL') {
      const now = new Date().getTime()
      list = list.filter((d) => {
        const itemTime = new Date(d.uploadedAt).getTime()
        const diffHours = (now - itemTime) / (1000 * 60 * 60)
        if (dateFilter === '24H') return diffHours <= 24
        if (dateFilter === '7D') return diffHours <= 24 * 7
        if (dateFilter === '30D') return diffHours <= 24 * 30
        return true
      })
    }

    return list
  }, [documents, searchQuery, dateFilter])

  // File Upload Handler (No client-side file parsing; strictly delegates to fileApi)
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const supportedExts = ['pdf', 'docx', 'xlsx', 'pptx', 'png', 'jpg', 'txt', 'csv']
    const file = files[0]
    const ext = file.name.split('.').pop()?.toLowerCase() || ''

    if (!supportedExts.includes(ext)) {
      toast.error('Unsupported Format', `.${ext} is not supported. Upload PDF, DOCX, XLSX, PPTX, PNG, JPG, TXT, or CSV.`)
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File Exceeds Limit', 'Maximum allowed file size is 100MB.')
      return
    }

    try {
      setUploadProgress(10)
      const uploaded = await fileApi.uploadFile(file, (pct) => setUploadProgress(pct))
      setDocuments((prev) => [uploaded, ...prev])
      setUploadProgress(null)
      toast.success('Upload Completed', `${file.name} staged to sovereign storage.`)
    } catch {
      setUploadProgress(null)
      toast.error('Upload Failed', 'Enclave gateway rejected file binary.')
    }
  }

  // Row Action: Process Document
  const handleProcessDoc = async (id: string) => {
    try {
      const updated = await fileApi.processDocument(id)
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)))
      toast.info('Processing Dispatched', `Asynchronous OCR and text extraction initiated for ${updated.name}.`)

      // Simulate step progression
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) => (d.id === id ? { ...d, processingProgress: 75 } : d))
        )
      }, 1000)

      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, processingStatus: 'COMPLETED', processingProgress: 100 } : d
          )
        )
        toast.success('Processing Completed', `Document ${updated.name} parsing finished.`)
      }, 2200)
    } catch {
      toast.error('Process Error', 'Failed to dispatch document to processing queue.')
    }
  }

  // Row Action: Add to Knowledge Base (Vector Indexing)
  const handleAddToKnowledgeBase = async (id: string) => {
    try {
      // Mark as indexing
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, indexedStatus: 'INDEXING' } : d))
      )
      toast.info('Vector Indexing', `Embedding document chunks into on-premise vector store...`)

      setTimeout(async () => {
        const updated = await fileApi.addToKnowledgeBase(id)
        setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)))
        toast.success('Indexed into Knowledge Base', `${updated.name} added with ${updated.vectorCount} vector embeddings.`)
      }, 1200)
    } catch {
      toast.error('Indexing Failed', 'Failed to add vectors to knowledge base.')
    }
  }

  // Row Action: Delete Document
  const handleConfirmDelete = async () => {
    if (!docToDelete) return
    try {
      await fileApi.deleteDocument(docToDelete.id)
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id))
      toast.info('Document Deleted', `${docToDelete.name} purged from sovereign storage.`)
      setDocToDelete(null)
    } catch {
      toast.error('Delete Failed', 'Could not delete document.')
    }
  }

  // Row Action: Download Document
  const handleDownloadDoc = async (doc: DocumentItem) => {
    await fileApi.downloadDocument(doc.id)
    toast.success('Download Triggered', `Exporting binary stream for ${doc.name}.`)
  }

  // Format Icon Resolver
  const getFormatIcon = (type: DocumentType) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-400" />
      case 'DOCX':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
      case 'PPTX':
        return <FileText className="w-4 h-4 text-amber-400" />
      case 'PNG':
      case 'JPG':
        return <ImageIcon className="w-4 h-4 text-purple-400" />
      case 'TXT':
      case 'CSV':
        return <FileCode className="w-4 h-4 text-cyan-400" />
      default:
        return <FileText className="w-4 h-4 text-text-muted" />
    }
  }

  // Format Badge Variants
  const getTypeBadgeVariant = (type: DocumentType): 'default' | 'info' | 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'PDF':
        return 'error'
      case 'DOCX':
        return 'info'
      case 'XLSX':
        return 'success'
      case 'PPTX':
        return 'warning'
      case 'PNG':
      case 'JPG':
        return 'info'
      case 'CSV':
      case 'TXT':
        return 'default'
    }
  }

  const getProcessingBadgeVariant = (status: ProcessingStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'PROCESSING':
        return 'info'
      case 'PENDING':
        return 'warning'
      case 'FAILED':
        return 'error'
    }
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  return (
    <div className="space-y-6 font-mono text-text-primary pb-8">
      {/* 1. Header & State Simulator Bar */}
      <div className="rounded-lg bg-surface border border-border p-5 shadow-industrial">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-text-primary uppercase flex items-center gap-2">
                <span>DOCUMENT MANAGEMENT & INGESTION</span>
              </h1>
              <p className="text-xs text-text-secondary">
                Sovereign File Vault • Multi-Format Ingestion Pipeline • On-Premise Parser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadDocuments()
                toast.info('Catalog Refreshed', 'Synced with sovereign storage ledger.')
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              SYNC
            </Button>
          </div>
        </div>

        {/* Development Mode Notice & UI State Simulation Bar */}
        <div className="mt-4 pt-3 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-muted text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400 font-semibold">
              SERVICE ABSTRACTION
            </span>
            <span>All file parsing, OCR, and embeddings execute backend-side via fileApi.ts.</span>
          </div>

          {/* UI State Controls for Review */}
          <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
            <span className="text-text-muted mr-1">SIMULATE:</span>
            {(['normal', 'loading', 'empty', 'error'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSimulatedState(mode)}
                className={`px-2 py-0.5 rounded border uppercase font-medium transition-colors ${
                  simulatedState === mode
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                    : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <ErrorState
          title="Document Vault Link Failure"
          code="ERR_STORAGE_ENCLAVE_DISCONNECTED"
          description={error}
          onRetry={() => {
            setSimulatedState('normal')
            loadDocuments('normal')
          }}
          retryText="Re-establish Storage Link"
        />
      )}

      {/* 2. Drag & Drop Upload Zone (Supports all 8 formats) */}
      <div
        className={`rounded-lg border-2 border-dashed transition-all p-6 text-center relative overflow-hidden ${
          isDraggingOver
            ? 'border-cyan-400 bg-cyan-950/40'
            : 'border-border bg-surface hover:border-cyan-500/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDraggingOver(true)
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDraggingOver(false)
          handleUploadFiles(e.dataTransfer.files)
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleUploadFiles(e.target.files)}
          accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.txt,.csv"
        />

        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-3 rounded-full bg-surface-elevated border border-border text-cyan-400">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
              DRAG & DROP FILES OR CLICK TO UPLOAD
            </h3>
            <p className="text-xs text-text-secondary">
              Files are streamed directly to sovereign hardware enclaves for automated extraction.
            </p>
          </div>

          {/* Supported Format Tags (All 8 formats) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px]">
            {['PDF', 'DOCX', 'XLSX', 'PPTX', 'PNG', 'JPG', 'TXT', 'CSV'].map((ext) => (
              <span
                key={ext}
                className="px-2 py-0.5 rounded bg-surface-sunken border border-border text-cyan-300 font-semibold"
              >
                .{ext}
              </span>
            ))}
            <span className="text-text-muted ml-1">MAX: 100MB</span>
          </div>

          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              Select Files
            </Button>
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="max-w-md mx-auto pt-2 space-y-1 text-left">
              <div className="flex justify-between text-[11px] text-cyan-300">
                <span>Streaming binary to sovereign buffer...</span>
                <span>{uploadProgress}%</span>
              </div>
              <ProgressBar value={uploadProgress} size="sm" variant="info" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Search, Filter & Sort Toolbar */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-industrial space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              sizeVariant="sm"
              placeholder="Search by name, author, or SHA-256..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
              clearable
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Type Filter */}
          <div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All File Formats' },
                { value: 'PDF', label: 'PDF Documents' },
                { value: 'DOCX', label: 'DOCX Specifications' },
                { value: 'XLSX', label: 'XLSX Workbooks' },
                { value: 'PPTX', label: 'PPTX Presentations' },
                { value: 'PNG', label: 'PNG Images' },
                { value: 'JPG', label: 'JPG Radiograms' },
                { value: 'TXT', label: 'TXT Rules' },
                { value: 'CSV', label: 'CSV Telemetry' },
              ]}
            />
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Processing States' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'PROCESSING', label: 'Processing' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'FAILED', label: 'Failed' },
              ]}
            />
          </div>

          {/* Date Filter */}
          <div>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Time' },
                { value: '24H', label: 'Last 24 Hours' },
                { value: '7D', label: 'Last 7 Days' },
                { value: '30D', label: 'Last 30 Days' },
              ]}
            />
          </div>
        </div>

        {/* Results Counter & Active Sorting Indicator */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/70">
          <span>
            Showing <strong className="text-text-primary">{filteredDocuments.length}</strong> document(s)
          </span>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-cyan-400" />
              SORTED BY: <strong className="text-cyan-300 uppercase">{sortBy} ({sortOrder})</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Document Data Table (8 Columns) */}
      <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={45} />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Documents Found"
              description={
                searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'No documents match your active search filters.'
                  : 'Sovereign vault is currently empty. Drag and drop a document above to begin ingestion.'
              }
              action={
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Upload First Document
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken">
                  {/* Col 1: Name */}
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-cyan-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      else {
                        setSortBy('name')
                        setSortOrder('asc')
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>DOCUMENT NAME</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* Col 2: Type */}
                  <th className="py-3 px-3">TYPE</th>

                  {/* Col 3: Size */}
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-cyan-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'sizeBytes') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      else {
                        setSortBy('sizeBytes')
                        setSortOrder('desc')
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>SIZE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* Col 4: Uploaded By */}
                  <th className="py-3 px-3">UPLOADED BY</th>

                  {/* Col 5: Date */}
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-cyan-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'uploadedAt') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      else {
                        setSortBy('uploadedAt')
                        setSortOrder('desc')
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>DATE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* Col 6: Processing Status */}
                  <th className="py-3 px-3">PROCESSING STATUS</th>

                  {/* Col 7: Indexed Status */}
                  <th className="py-3 px-3">INDEXED STATUS</th>

                  {/* Col 8: Actions */}
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-surface-elevated/70 transition-colors group"
                  >
                    {/* Col 1: Name & SHA-256 preview */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-surface-sunken border border-border shrink-0">
                          {getFormatIcon(doc.type)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-text-primary block truncate group-hover:text-cyan-300 transition-colors">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono block truncate">
                            SHA: {doc.checksumSha256.slice(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge variant={getTypeBadgeVariant(doc.type)} size="sm">
                        {doc.type}
                      </Badge>
                    </td>

                    {/* Col 3: Size */}
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {doc.formattedSize}
                    </td>

                    {/* Col 4: Uploaded By */}
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {doc.uploadedBy}
                    </td>

                    {/* Col 5: Date */}
                    <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.uploadedAt}
                      </span>
                    </td>

                    {/* Col 6: Processing Status & Progress */}
                    <td className="py-3 px-3">
                      <div className="space-y-1.5 min-w-[130px]">
                        <Badge
                          variant={getProcessingBadgeVariant(doc.processingStatus)}
                          size="sm"
                          dot={doc.processingStatus === 'PROCESSING'}
                        >
                          {doc.processingStatus}
                        </Badge>
                        {doc.processingStatus === 'PROCESSING' && (
                          <div className="w-full">
                            <ProgressBar
                              value={doc.processingProgress}
                              size="sm"
                              variant="info"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Col 7: Indexed Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {doc.indexedStatus === 'INDEXED' ? (
                        <div className="flex items-center gap-1.5">
                          <Badge variant="success" size="sm">
                            INDEXED
                          </Badge>
                          {doc.vectorCount !== undefined && (
                            <span className="text-[10px] text-emerald-400">
                              {doc.vectorCount} vect
                            </span>
                          )}
                        </div>
                      ) : doc.indexedStatus === 'INDEXING' ? (
                        <Badge variant="info" size="sm" dot>
                          INDEXING...
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          NOT INDEXED
                        </Badge>
                      )}
                    </td>

                    {/* Col 8: Actions (View, Download, Delete, Process, Add to Knowledge Base) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Action */}
                        <button
                          type="button"
                          onClick={() => setViewingDoc(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-cyan-400 hover:bg-surface-sunken transition-colors focus-ring"
                          title="View Document Metadata & Extracted Text"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Download Action */}
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-emerald-400 hover:bg-surface-sunken transition-colors focus-ring"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Process Action */}
                        {doc.processingStatus !== 'PROCESSING' && (
                          <button
                            type="button"
                            onClick={() => handleProcessDoc(doc.id)}
                            className="p-1.5 rounded text-text-muted hover:text-amber-400 hover:bg-surface-sunken transition-colors focus-ring"
                            title="Trigger Asynchronous Backend Processing"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Add to Knowledge Base Action */}
                        {doc.indexedStatus !== 'INDEXED' && (
                          <button
                            type="button"
                            onClick={() => handleAddToKnowledgeBase(doc.id)}
                            className="p-1.5 rounded text-text-muted hover:text-cyan-300 hover:bg-surface-sunken transition-colors focus-ring"
                            title="Embed into Sovereign Knowledge Base"
                          >
                            <Database className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-rose-400 hover:bg-surface-sunken transition-colors focus-ring"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= 5. VIEW DOCUMENT MODAL ================= */}
      <Modal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        title={viewingDoc?.name || 'Document Details'}
        description={`Cryptographic Attestation & Extracted Content`}
        size="lg"
      >
        {viewingDoc && (
          <ModalBody className="space-y-4">
            {/* Header Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">FORMAT</span>
                <span className="font-bold text-cyan-300">{viewingDoc.type}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">SIZE</span>
                <span className="font-bold text-text-primary">{viewingDoc.formattedSize}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">PROCESSING</span>
                <span className="font-bold text-emerald-400">{viewingDoc.processingStatus}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">INDEX STATUS</span>
                <span className="font-bold text-cyan-400">{viewingDoc.indexedStatus}</span>
              </div>
            </div>

            {/* SHA-256 Checksum Card */}
            <div className="p-3 rounded bg-surface-sunken border border-border space-y-1">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5 uppercase font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Cryptographic Hash
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(viewingDoc.checksumSha256)}
                  className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[11px] text-cyan-300 font-mono break-all selection:bg-cyan-500 selection:text-black">
                {viewingDoc.checksumSha256}
              </pre>
            </div>

            {/* Summary Box */}
            {viewingDoc.summary && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-text-muted uppercase font-semibold">
                  Sovereign Ingestion Summary:
                </span>
                <p className="p-3 rounded bg-surface border border-border text-text-secondary leading-relaxed">
                  {viewingDoc.summary}
                </p>
              </div>
            )}

            {/* Extracted Text Snippet */}
            {viewingDoc.extractedTextSnippet && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-text-muted uppercase font-semibold">
                  Extracted Text Preview:
                </span>
                <pre className="p-3 rounded bg-[#050811] border border-border text-text-primary leading-relaxed whitespace-pre-wrap font-mono text-[11px]">
                  {viewingDoc.extractedTextSnippet}
                </pre>
              </div>
            )}
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setViewingDoc(null)}>
            Close
          </Button>
          {viewingDoc && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => handleDownloadDoc(viewingDoc)}
            >
              Download
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* ================= 6. DELETE CONFIRMATION DIALOG ================= */}
      <Dialog
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Purge Document from Vault"
        description={`Are you sure you want to permanently delete "${docToDelete?.name}"? This action removes all parsed vectors and cannot be undone.`}
        variant="destructive"
        confirmText="Confirm Purge"
        cancelText="Cancel"
      />
    </div>
  )
}

export default Documents
