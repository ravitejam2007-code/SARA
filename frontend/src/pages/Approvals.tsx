import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Search,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { apiClient } from '@/services/api'

interface EvidenceItem {
  claim: string
  source: string
  evidence: string
  calculation?: string
  status: string
}

interface StepItem {
  step_number: number
  name: string
  state: string
  details: string
  tool_used?: string
  elapsed_ms: number
  timestamp: string
}

interface DeliverableItem {
  id: string
  filename: string
  file_type: string
  size_bytes: number
  checksum_sha256: string
  verification_status: string
  download_url: string
}

interface TaskItem {
  id: string
  title: string
  prompt: string
  state: string
  model_used: string
  capability: string
  routing_reason: string
  created_at: string
  completed_at?: string
  elapsed_ms: number
  steps: StepItem[]
  evidence_chain: EvidenceItem[]
  approval_status: string
  approval_notes?: string
  deliverables: DeliverableItem[]
}

export const Approvals: React.FC = () => {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  // Approval / Rejection Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [reviewComments, setReviewComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTasks = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get<TaskItem[]>('/tasks')
      setTasks(res.data)
      if (res.data.length > 0 && !selectedTask) {
        // Pre-select first pending task
        const pending = res.data.find((t) => t.state === 'APPROVAL_REQUIRED') || res.data[0]
        setSelectedTask(pending)
      }
    } catch {
      toast.error('Failed to Load Tasks', 'Could not retrieve tasks from sovereign runtime.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const pendingTasks = tasks.filter((t) => t.state === 'APPROVAL_REQUIRED' || t.approval_status === 'PENDING')
  const historyTasks = tasks.filter((t) => t.state === 'COMPLETED' || t.state === 'REJECTED')

  const currentList = activeTab === 'pending' ? pendingTasks : historyTasks
  const filteredList = currentList.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApprove = async () => {
    if (!selectedTask) return
    setIsSubmitting(true)
    try {
      const res = await apiClient.post<TaskItem>(`/tasks/${selectedTask.id}/approve`, {
        action: 'APPROVE',
        comments: reviewComments || 'Formally approved by Lead Plant Engineer. Authorized 85% de-rate and 48h boroscope inspection.',
      })
      toast.success('Deliverable Approved & Signed', `Task ${selectedTask.id} formally countersigned and released.`)
      setSelectedTask(res.data)
      setIsApproveModalOpen(false)
      setReviewComments('')
      loadTasks()
    } catch {
      toast.error('Approval Failed', 'Unable to record approval signature.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedTask) return
    setIsSubmitting(true)
    try {
      const res = await apiClient.post<TaskItem>(`/tasks/${selectedTask.id}/reject`, {
        action: 'REJECT',
        comments: reviewComments || 'Inspection findings rejected. Telemetry requires recalibration.',
      })
      toast.warning('Deliverable Rejected', `Task ${selectedTask.id} marked as rejected.`)
      setSelectedTask(res.data)
      setIsRejectModalOpen(false)
      setReviewComments('')
      loadTasks()
    } catch {
      toast.error('Rejection Failed', 'Unable to record rejection event.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = (filename: string) => {
    const url = `http://127.0.0.1:8000/api/deliverables/download/${encodeURIComponent(filename)}`
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Download Initialized', `Exporting certified artifact ${filename}`)
  }

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-text-primary uppercase">
              HUMAN APPROVAL GATE
            </h1>
            <Badge variant="warning" size="sm" dot>
              {pendingTasks.length} PENDING REVIEW
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Section 18 Compliance: Sensitive deliverables require explicit cryptographic signoff before release.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingTasks.length})
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('history')}
          >
            Signed Ledger ({historyTasks.length})
          </Button>
          <Button variant="ghost" size="sm" onClick={loadTasks} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 2. Main 2-Column Split: Queue List & Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search tasks, IDs, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded focus-ring text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted bg-surface rounded border border-border">
                No {activeTab} approval items found.
              </div>
            ) : (
              filteredList.map((task) => {
                const isSelected = selectedTask?.id === task.id
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-3.5 rounded-[8px] border transition-all cursor-pointer font-sans ${
                      isSelected
                        ? 'bg-white border-[#171717] shadow-sm'
                        : 'bg-[#fafafa] border-[#ebebeb] hover:border-[#d4d4d4]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-[#171717] font-mono">{task.id}</span>
                      <Badge
                        variant={
                          task.state === 'COMPLETED'
                            ? 'success'
                            : task.state === 'APPROVAL_REQUIRED'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      >
                        {task.state}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#4d4d4d] line-clamp-2 leading-relaxed mb-2 font-sans">
                      {task.title || task.prompt}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#8f8f8f] pt-1 border-t border-[#ebebeb] font-mono">
                      <span className="flex items-center gap-1 text-[#171717]">
                        <Cpu className="w-3 h-3 text-[#171717]" />
                        {task.model_used.split(' ')[0]}
                      </span>
                      <span>{task.created_at}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Approval Dossier (8 cols) */}
        <div className="lg:col-span-8">
          {selectedTask ? (
            <div className="rounded-[10px] bg-white border border-[#ebebeb] p-5 space-y-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#ebebeb]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#fafafa] text-[#171717] border border-[#ebebeb] font-mono">
                      {selectedTask.id}
                    </span>
                    <h2 className="text-base sm:text-lg font-semibold text-[#171717] tracking-tight font-sans">
                      {selectedTask.title}
                    </h2>
                  </div>
                  <p className="text-xs text-[#8f8f8f] font-sans italic">
                    Prompt: "{selectedTask.prompt}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedTask.state === 'APPROVAL_REQUIRED' ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsApproveModalOpen(true)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Approve & Release
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRejectModalOpen(true)}
                        className="text-[#ee0000] border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1.5" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge
                      variant={selectedTask.state === 'COMPLETED' ? 'success' : 'error'}
                      size="md"
                      dot
                    >
                      {selectedTask.approval_status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Model & Routing Provenance */}
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#171717]" />
                  <span className="font-semibold text-[#171717]">Model Assigned:</span>
                  <span className="text-[#171717] font-bold">{selectedTask.model_used}</span>
                </div>
                <div className="text-[11px] text-[#8f8f8f]">
                  Capability: <span className="text-[#171717] uppercase font-semibold">{selectedTask.capability}</span>
                </div>
              </div>

              {/* Evidence Chain Panel (Section 14: Evidence-First Response Design) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Evidence Chain & Compliance Verification
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {selectedTask.evidence_chain.length} Claims Cross-Examined
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedTask.evidence_chain.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded border border-border/80 bg-surface/50 space-y-2 hover:border-border-strong transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fafafa] text-[#171717] border border-[#ebebeb] font-mono">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[#171717] font-sans">
                            {item.claim}
                          </span>
                        </div>
                        <Badge
                          variant={item.status === 'VERIFIED' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                        <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                          <span className="text-[#8f8f8f] block text-[9px] uppercase font-bold">Source Standard:</span>
                          <span className="text-amber-800 font-semibold">{item.source}</span>
                        </div>
                        <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                          <span className="text-[#8f8f8f] block text-[9px] uppercase font-bold">Telemetry Finding:</span>
                          <span className="text-[#4d4d4d]">{item.evidence}</span>
                        </div>
                      </div>

                      {item.calculation && (
                        <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[11px] text-[#171717] font-mono">
                          <span className="text-[#171717] font-semibold mr-1">Formula & Delta:</span>
                          {item.calculation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Deliverables with Download Buttons */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] flex items-center gap-1.5 font-sans">
                  <FileText className="w-4 h-4 text-[#171717]" />
                  Compiled Certified Artifacts ({selectedTask.deliverables.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedTask.deliverables.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-[8px] border border-[#ebebeb] bg-white flex flex-col justify-between hover:border-[#d4d4d4] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    >
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="default" size="sm">
                            {doc.file_type}
                          </Badge>
                          <span className="text-[10px] text-[#8f8f8f] font-mono">
                            {(doc.size_bytes / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#171717] truncate font-sans" title={doc.filename}>
                          {doc.filename}
                        </p>
                        <span className="text-[9px] font-mono text-emerald-700 block font-medium">
                          SHA256: {doc.checksum_sha256.slice(0, 12)}...
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.filename)}
                        className="w-full text-xs font-medium border border-[#ebebeb] bg-white hover:bg-[#f5f5f5] text-[#171717]"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download {doc.file_type}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution State Timeline */}
              <div className="space-y-2 pt-2 border-t border-[#ebebeb]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8f8f8f] block mb-2 font-mono">
                  Deterministic Execution Timeline ({selectedTask.steps.length} Steps)
                </span>
                <div className="space-y-1.5 text-xs">
                  {selectedTask.steps.map((s) => (
                    <div
                      key={s.step_number}
                      className="flex items-center justify-between p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-[#171717]">Step {s.step_number}: {s.name}</span>
                      </div>
                      <span className="text-[10px] text-[#8f8f8f] font-mono">{s.elapsed_ms}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] bg-white border border-dashed border-[#ebebeb] p-12 text-center text-[#8f8f8f] text-xs">
              Select an item from the left queue to inspect its complete evidence chain and ISO 10816 sign-off dossier.
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {selectedTask && (
        <Modal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          title={`Countersign & Release Deliverable: ${selectedTask.id}`}
        >
          <ModalBody className="space-y-4 font-mono text-xs">
            <p className="text-[#4d4d4d] font-sans leading-relaxed">
              You are about to countersign the AI-drafted Technical Approval Note for Gas Turbine Unit #4B.
              This will cryptographically attest the deliverable in the hardware ledger and authorize corrective actions.
            </p>

            <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#8f8f8f]">Reviewing Authority:</span>
              <p className="text-[#171717] font-semibold">Lead Plant Engineer (ENG-KAI-CHEN)</p>
              <span className="text-[10px] uppercase font-bold text-[#8f8f8f] pt-1 block">Attestation Key:</span>
              <p className="text-emerald-700 font-mono font-medium">HSM-YUBI-FIPS-LVL3-09412</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-text-primary uppercase">
                Approval Justification & Sign-off Notes:
              </label>
              <textarea
                rows={3}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="e.g. Reviewed by Lead Engineer. Authorize 85% de-rate and 48h boroscope inspection."
                className="w-full p-2.5 rounded bg-surface border border-border text-xs text-text-primary focus-ring"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold"
            >
              {isSubmitting ? 'Signing...' : 'Countersign & Release (HSM)'}
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedTask && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title={`Reject Deliverable: ${selectedTask.id}`}
        >
          <ModalBody className="space-y-4 font-mono text-xs">
            <p className="text-text-secondary font-sans leading-relaxed">
              Rejecting this deliverable will prevent official distribution and trigger an audit event in the sovereignty log.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-text-primary uppercase">
                Rejection Rationale:
              </label>
              <textarea
                rows={3}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Reason for rejection, sensor recalibration required, etc."
                className="w-full p-2.5 rounded bg-surface border border-border text-xs text-text-primary focus-ring"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={isSubmitting}
              className="border-red-500/50 text-red-400 hover:bg-red-950/30"
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  )
}
