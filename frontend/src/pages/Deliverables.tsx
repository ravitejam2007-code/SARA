import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  Search,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Edit2,
  Clock,
  ShieldCheck,
  GitBranch,
  ScrollText,
  FileCode,
  FileSpreadsheet,
  FileText,
  Archive,
  ArrowUpDown,
  Copy,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'

import { deliverableApi } from '@/services/deliverableApi'
import type {
  DeliverableItem,
  DeliverableType,
  VerificationStatus,
  DeliverableAuditTrail,
} from '@/types/deliverable'

export const Deliverables: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // State Management
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [workflowFilter, setWorkflowFilter] = useState<string>('ALL')
  const [dateFilter, setDateFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'filename' | 'createdDate' | 'sizeBytes' | 'verificationStatus'>('createdDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Interactive Action Modals
  const [previewDoc, setPreviewDoc] = useState<DeliverableItem | null>(null)
  const [renameDoc, setRenameDoc] = useState<DeliverableItem | null>(null)
  const [newFilename, setNewFilename] = useState('')
  const [docToDelete, setDocToDelete] = useState<DeliverableItem | null>(null)
  const [auditTrail, setAuditTrail] = useState<DeliverableAuditTrail | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const items = await deliverableApi.getDeliverables({
        query: searchQuery,
        type: typeFilter as any,
        workflow: workflowFilter as any,
        status: statusFilter as any,
      })
      setDeliverables(items)
    } catch {
      toast.error('Sync Error', 'Failed to retrieve deliverables catalog.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [typeFilter, workflowFilter, statusFilter])

  // Filter & Sort deliverables
  const filteredDeliverables = useMemo(() => {
    let list = [...deliverables]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (d) =>
          d.filename.toLowerCase().includes(q) ||
          d.workflow.toLowerCase().includes(q) ||
          d.generatedBy.toLowerCase().includes(q) ||
          d.checksumSha256.toLowerCase().includes(q)
      )
    }

    if (dateFilter !== 'ALL') {
      const now = new Date().getTime()
      list = list.filter((d) => {
        const itemTime = new Date(d.createdDate).getTime()
        const diffHours = (now - itemTime) / (1000 * 60 * 60)
        if (dateFilter === '24H') return diffHours <= 24
        if (dateFilter === '7D') return diffHours <= 24 * 7
        if (dateFilter === '30D') return diffHours <= 24 * 30
        return true
      })
    }

    // Sort
    list.sort((a, b) => {
      const valA = a[sortBy]
      const valB = b[sortBy]
      const order = sortOrder === 'desc' ? -1 : 1
      if (valA > valB) return order
      if (valA < valB) return -order
      return 0
    })

    return list
  }, [deliverables, searchQuery, dateFilter, sortBy, sortOrder])

  // Action: Download
  const handleDownload = async (doc: DeliverableItem) => {
    await deliverableApi.downloadDeliverable(doc.id)
    toast.success('Download Triggered', `Exporting certified artifact ${doc.filename}.`)
  }

  // Action: Rename Submit
  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!renameDoc || !newFilename.trim()) return

    try {
      const updated = await deliverableApi.renameDeliverable(renameDoc.id, newFilename.trim())
      setDeliverables((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
      toast.success('Artifact Renamed', `Renamed to ${updated.filename}.`)
      setRenameDoc(null)
      setNewFilename('')
    } catch {
      toast.error('Rename Failed', 'Could not rename deliverable.')
    }
  }

  // Action: Delete Confirm
  const handleConfirmDelete = async () => {
    if (!docToDelete) return
    try {
      await deliverableApi.deleteDeliverable(docToDelete.id)
      setDeliverables((prev) => prev.filter((d) => d.id !== docToDelete.id))
      toast.info('Deliverable Purged', `${docToDelete.filename} removed from repository.`)
      setDocToDelete(null)
    } catch {
      toast.error('Delete Failed', 'Failed to delete deliverable.')
    }
  }

  // Action: View Audit Trail
  const handleOpenAuditTrail = async (doc: DeliverableItem) => {
    try {
      const trail = await deliverableApi.getAuditTrail(doc.id)
      setAuditTrail(trail)
    } catch {
      toast.error('Audit Load Error', 'Could not load cryptographic audit trail.')
    }
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  // File Type Icon Resolver
  const getTypeIcon = (type: DeliverableType) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-400" />
      case 'DOCX':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
      case 'PPTX':
        return <FileText className="w-4 h-4 text-amber-400" />
      case 'ZIP':
        return <Archive className="w-4 h-4 text-purple-400" />
      case 'CODE':
        return <FileCode className="w-4 h-4 text-cyan-400" />
      default:
        return <Package className="w-4 h-4 text-text-muted" />
    }
  }

  // File Type Badge Color Resolver
  const getTypeBadgeVariant = (type: DeliverableType): 'default' | 'info' | 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'PDF':
        return 'error'
      case 'DOCX':
        return 'info'
      case 'XLSX':
        return 'success'
      case 'PPTX':
        return 'warning'
      case 'ZIP':
        return 'default'
      case 'CODE':
        return 'info'
    }
  }

  // Verification Status Badge Variant
  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge variant="success" size="sm" dot>
            VERIFIED
          </Badge>
        )
      case 'PENDING_REVIEW':
        return (
          <Badge variant="warning" size="sm">
            PENDING REVIEW
          </Badge>
        )
      case 'UNVERIFIED':
        return (
          <Badge variant="default" size="sm">
            UNVERIFIED
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge variant="error" size="sm">
            REJECTED
          </Badge>
        )
    }
  }

  // Predefined workflow names for filter
  const workflowNames = [
    'Inspection Report → Approval Note',
    'Coding Verification',
    'Document Intelligence',
    'Spreadsheet Analysis',
    'Engineering Image Analysis',
  ]

  // Aggregate stats
  const totalCount = deliverables.length
  const verifiedCount = deliverables.filter((d) => d.verificationStatus === 'VERIFIED').length
  const pendingCount = deliverables.filter((d) => d.verificationStatus === 'PENDING_REVIEW').length
  const totalMb = (
    deliverables.reduce((acc, curr) => acc + curr.sizeBytes, 0) /
    (1024 * 1024)
  ).toFixed(1)

  return (
    <div className="space-y-6 font-mono text-text-primary pb-8">
      {/* 1. Header with Aggregate Metrics */}
      <div className="rounded-lg bg-surface border border-border p-5 shadow-industrial">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider text-text-primary uppercase flex items-center gap-2">
                  <span>GENERATED DELIVERABLES & ARTIFACTS</span>
                </h1>
                <p className="text-xs text-text-secondary">
                  Certified Pipeline Deliverables • Cryptographic Seals • Enterprise File Vault
                </p>
              </div>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-border flex items-center gap-2">
              <span className="text-[10px] text-text-muted uppercase">TOTAL ARTIFACTS:</span>
              <span className="text-sm font-bold text-text-primary">{totalCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-emerald-900/50 flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 uppercase">FIPS VERIFIED:</span>
              <span className="text-sm font-bold text-emerald-300">{verifiedCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-amber-900/50 flex items-center gap-2">
              <span className="text-[10px] text-amber-400 uppercase">PENDING REVIEW:</span>
              <span className="text-sm font-bold text-amber-300">{pendingCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-cyan-900/50 flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 uppercase">STORAGE:</span>
              <span className="text-sm font-bold text-cyan-300">{totalMb} MB</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadData()
                toast.info('Ledger Refreshed', 'Deliverables synchronized with enclave storage.')
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Enterprise Filter Toolbar (Type, Workflow, Date, Status) */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-industrial space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              sizeVariant="sm"
              placeholder="Search by filename, workflow, author, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
              clearable
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Filter: File Type */}
          <div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All File Types' },
                { value: 'DOCX', label: 'DOCX Documents' },
                { value: 'XLSX', label: 'XLSX Workbooks' },
                { value: 'PPTX', label: 'PPTX Presentations' },
                { value: 'PDF', label: 'PDF Reports' },
                { value: 'ZIP', label: 'ZIP Packages' },
                { value: 'CODE', label: 'Code Binaries' },
              ]}
            />
          </div>

          {/* Filter: Workflow */}
          <div>
            <Select
              value={workflowFilter}
              onChange={(e) => setWorkflowFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Workflows' },
                ...workflowNames.map((w) => ({ value: w, label: w })),
              ]}
            />
          </div>

          {/* Filter: Verification Status */}
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Verification Statuses' },
                { value: 'VERIFIED', label: 'Verified' },
                { value: 'PENDING_REVIEW', label: 'Pending Review' },
                { value: 'UNVERIFIED', label: 'Unverified' },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted pt-2 border-t border-border/70">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-text-primary">{filteredDeliverables.length}</strong> deliverable(s)
            </span>
          </div>

          {/* Date Range Quick Pills */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="mr-1 uppercase font-semibold">DATE:</span>
            {(['ALL', '24H', '7D', '30D'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDateFilter(d)}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  dateFilter === d
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
                }`}
              >
                {d === 'ALL' ? 'ALL TIME' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Deliverables Table (8 Columns) */}
      <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={45} />
            ))}
          </div>
        ) : filteredDeliverables.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Deliverables Found"
              description="No generated deliverables match your active search filters."
              action={
                <Button
                  size="sm"
                  onClick={() => navigate('/workflows')}
                  leftIcon={<GitBranch className="w-3.5 h-3.5" />}
                >
                  Go to Workflows
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken">
                  {/* Col 1: Filename */}
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-cyan-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'filename') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      else {
                        setSortBy('filename')
                        setSortOrder('asc')
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>FILENAME</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* Col 2: Type */}
                  <th className="py-3 px-3">TYPE</th>

                  {/* Col 3: Workflow */}
                  <th className="py-3 px-3">WORKFLOW</th>

                  {/* Col 4: Generated By */}
                  <th className="py-3 px-3">GENERATED BY</th>

                  {/* Col 5: Created Date */}
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-cyan-300 transition-colors"
                    onClick={() => {
                      if (sortBy === 'createdDate') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      else {
                        setSortBy('createdDate')
                        setSortOrder('desc')
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>CREATED DATE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* Col 6: Size */}
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

                  {/* Col 7: Verification Status */}
                  <th className="py-3 px-3">VERIFICATION STATUS</th>

                  {/* Col 8: Actions */}
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {filteredDeliverables.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-surface-elevated/70 transition-colors group"
                  >
                    {/* Col 1: Filename */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-surface-sunken border border-border shrink-0">
                          {getTypeIcon(doc.fileType)}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="font-semibold text-text-primary text-left truncate group-hover:text-cyan-300 transition-colors block cursor-pointer"
                          >
                            {doc.filename}
                          </button>
                          <span className="text-[10px] text-text-muted font-mono block">
                            SHA: {doc.checksumSha256.slice(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: File Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge variant={getTypeBadgeVariant(doc.fileType)} size="sm">
                        {doc.fileType}
                      </Badge>
                    </td>

                    {/* Col 3: Workflow */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => navigate('/workflows')}
                        className="px-2 py-0.5 rounded bg-surface-sunken border border-border text-[11px] text-text-secondary hover:text-cyan-300 hover:border-cyan-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Workflow Definition"
                      >
                        <GitBranch className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{doc.workflow}</span>
                      </button>
                    </td>

                    {/* Col 4: Generated By */}
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {doc.generatedBy}
                    </td>

                    {/* Col 5: Created Date */}
                    <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.createdDate}
                      </span>
                    </td>

                    {/* Col 6: Size */}
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {doc.formattedSize}
                    </td>

                    {/* Col 7: Verification Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getVerificationBadge(doc.verificationStatus)}
                    </td>

                    {/* Col 8: Row Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Action: Preview */}
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-cyan-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="Preview Deliverable"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Action: Download */}
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-emerald-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="Download Certified Artifact"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Action: Rename */}
                        <button
                          type="button"
                          onClick={() => {
                            setRenameDoc(doc)
                            setNewFilename(doc.filename)
                          }}
                          className="p-1.5 rounded text-text-muted hover:text-amber-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="Rename Deliverable"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Action: View Audit Trail */}
                        <button
                          type="button"
                          onClick={() => handleOpenAuditTrail(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-purple-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="View Cryptographic Audit Trail"
                        >
                          <ScrollText className="w-3.5 h-3.5" />
                        </button>

                        {/* Action: View Workflow */}
                        <button
                          type="button"
                          onClick={() => navigate('/workflows')}
                          className="p-1.5 rounded text-text-muted hover:text-cyan-300 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="View Originating Workflow"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                        </button>

                        {/* Action: Delete */}
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-rose-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="Delete Deliverable"
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

      {/* ================= 4. PREVIEW DELIVERABLE MODAL ================= */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.filename || 'Deliverable Preview'}
        description={`Sovereign Certified Artifact Preview • ${previewDoc?.workflow}`}
        size="lg"
      >
        {previewDoc && (
          <ModalBody className="space-y-4">
            {/* Metadata Tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">FORMAT</span>
                <span className="font-bold text-cyan-300">{previewDoc.fileType}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">SIZE</span>
                <span className="font-bold text-text-primary">{previewDoc.formattedSize}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">AUTHOR</span>
                <span className="font-bold text-text-secondary">{previewDoc.generatedBy}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">VERIFICATION</span>
                <span className="font-bold text-emerald-400">{previewDoc.verificationStatus}</span>
              </div>
            </div>

            {/* SHA-256 Seal Box */}
            <div className="p-3 rounded bg-surface-sunken border border-border space-y-1">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5 uppercase font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cryptographic SHA-256 Seal
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(previewDoc.checksumSha256)}
                  className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
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
                {previewDoc.checksumSha256}
              </pre>
            </div>

            {/* Content Preview */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-text-muted uppercase font-semibold">
                Artifact Content Stream:
              </span>
              <pre className="p-4 rounded bg-[#050811] border border-border text-text-primary leading-relaxed whitespace-pre-wrap font-mono text-[11px] max-h-64 overflow-y-auto selection:bg-cyan-500 selection:text-black">
                {previewDoc.previewContent || 'Binary artifact payload stored in enclave buffer.'}
              </pre>
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
            Close
          </Button>
          {previewDoc && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => handleDownload(previewDoc)}
            >
              Download Artifact
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* ================= 5. RENAME MODAL ================= */}
      <Modal
        isOpen={!!renameDoc}
        onClose={() => setRenameDoc(null)}
        title="Rename Deliverable"
        description="Update filename in sovereign file vault catalog"
        size="sm"
      >
        <form onSubmit={handleRenameSubmit}>
          <ModalBody className="space-y-3">
            <Input
              label="New Filename"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              required
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" size="sm" type="button" onClick={() => setRenameDoc(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Filename
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* ================= 6. AUDIT TRAIL MODAL ================= */}
      <Modal
        isOpen={!!auditTrail}
        onClose={() => setAuditTrail(null)}
        title="Cryptographic Audit Trail"
        description={`Hardware Attestation & Ledger Verification`}
        size="md"
      >
        {auditTrail && (
          <ModalBody className="space-y-3 text-xs">
            <div className="p-3 rounded bg-emerald-950/20 border border-emerald-800/50 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase">
                <ShieldCheck className="w-4 h-4" />
                {auditTrail.verificationResult}
              </span>
              <span className="text-[10px] text-text-muted">{auditTrail.ledgerBlock}</span>
            </div>

            <div className="space-y-2 p-3 rounded bg-surface-sunken border border-border">
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-text-muted">DELIVERABLE:</span>
                <span className="font-bold text-text-primary">{auditTrail.filename}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-text-muted">GENERATED BY:</span>
                <span className="text-text-secondary">{auditTrail.actor}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-text-muted">ENCLAVE HOST:</span>
                <span className="text-cyan-400 font-bold">{auditTrail.enclaveId}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-text-muted">HSM CERTIFICATE:</span>
                <span className="text-emerald-300 font-mono text-[10px]">{auditTrail.hsmSignature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">POLICY REGIME:</span>
                <span className="text-text-secondary">{auditTrail.policyVersion}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-semibold">
                SEALED SHA-256 CHECKSUM:
              </span>
              <pre className="p-2.5 rounded bg-[#050811] border border-border text-cyan-300 font-mono text-[11px] break-all">
                {auditTrail.checksumSha256}
              </pre>
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setAuditTrail(null)}>
            Close Audit Trail
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================= 7. DELETE CONFIRMATION DIALOG ================= */}
      <Dialog
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Purge Certified Deliverable"
        description={`Are you sure you want to permanently delete "${docToDelete?.filename}"? This action purges the signed artifact from sovereign storage.`}
        variant="destructive"
        confirmText="Confirm Purge"
        cancelText="Cancel"
      />
    </div>
  )
}

export default Deliverables
