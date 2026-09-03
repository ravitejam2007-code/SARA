import React, { useState, useEffect, useRef } from 'react'
import {
  GitBranch,
  Play,
  CheckCircle2,
  Clock,
  Terminal,
  Download,
  StopCircle,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Scan,
  ClipboardCheck,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

import { workflowApi, PREDEFINED_WORKFLOWS } from '@/services/workflowApi'
import type {
  WorkflowDefinition,
  WorkflowExecutionSession,
  WorkflowComplexity,
} from '@/types/workflow'

export const Workflows: React.FC = () => {
  const { toast } = useToast()

  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([])
  const [activeSession, setActiveSession] = useState<WorkflowExecutionSession | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [copiedHash, setCopiedHash] = useState(false)

  const unsubscribeRef = useRef<(() => void) | null>(null)
  const terminalLogsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setWorkflows(PREDEFINED_WORKFLOWS)
  }, [])

  // Auto-scroll terminal log
  useEffect(() => {
    terminalLogsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.logs])

  // Timer while executing
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isExecuting && activeSession?.status === 'RUNNING') {
      timer = setInterval(() => {
        setActiveSession((prev) => (prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isExecuting, activeSession?.status])

  // Start Workflow Execution
  const handleStartWorkflow = async (wf: WorkflowDefinition) => {
    setIsExecuting(true)

    try {
      const initialSession = await workflowApi.startWorkflow(wf.id)
      setActiveSession(initialSession)
      toast.info('Pipeline Dispatched', `Initializing container enclave for "${wf.title}".`)

      // Subscribe to live execution progress events
      unsubscribeRef.current = workflowApi.subscribeToExecution(
        initialSession,
        (updatedSession) => {
          setActiveSession(updatedSession)
        },
        (completedSession) => {
          setActiveSession(completedSession)
          setIsExecuting(false)
          toast.success(
            'Workflow Finalized',
            `Deliverable "${completedSession.artifact?.filename}" generated and sealed.`
          )
        }
      )
    } catch {
      setIsExecuting(false)
      toast.error('Execution Failed', 'Failed to dispatch workflow to enclave runtime.')
    }
  }

  // Cancel Workflow
  const handleCancelWorkflow = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
    setIsExecuting(false)
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        status: 'CANCELLED',
        logs: [
          ...activeSession.logs,
          `[${new Date().toISOString().slice(11, 19)}] [ABORT] Execution cancelled by operator command.`,
        ],
      })
    }
    toast.warning('Execution Halted', 'Workflow pipeline cancelled.')
  }

  const handleCloseModal = () => {
    if (isExecuting) {
      handleCancelWorkflow()
    }
    setActiveSession(null)
  }

  const handleDownloadArtifact = () => {
    if (!activeSession?.artifact) return
    toast.success('Download Triggered', `Exporting ${activeSession.artifact.filename}.`)
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  // Complexity Badge Colors
  const getComplexityVariant = (complexity: WorkflowComplexity): 'default' | 'info' | 'warning' | 'error' => {
    switch (complexity) {
      case 'STANDARD':
        return 'info'
      case 'MEDIUM':
        return 'warning'
      case 'COMPLEX':
        return 'error'
    }
  }

  // Workflow Icon Resolver
  const getWorkflowIcon = (iconName: string) => {
    switch (iconName) {
      case 'ClipboardCheck':
        return <ClipboardCheck className="w-5 h-5 text-amber-700" />
      case 'FileCode2':
        return <FileCode2 className="w-5 h-5 text-[#171717]" />
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#0070f3]" />
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
      case 'Scan':
        return <Scan className="w-5 h-5 text-purple-700" />
      default:
        return <GitBranch className="w-5 h-5 text-[#8f8f8f]" />
    }
  }

  return (
    <div className="space-y-6 font-mono text-text-primary pb-8">
      {/* 1. Header Section */}
      <div className="rounded-lg bg-surface border border-border p-5 shadow-industrial">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shrink-0 shadow-sm">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#171717] flex items-center gap-2">
                <span>AUTONOMOUS ENGINEERING WORKFLOWS</span>
              </h1>
              <p className="text-xs text-[#8f8f8f]">
                Deterministic Pipelines • Certified Deliverables • Hardware Enclave Execution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              ORCHESTRATOR ONLINE
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between text-xs text-[#8f8f8f]">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-[#f5f5f5] border border-[#ebebeb] text-[#171717] font-semibold">
              LIVE EXECUTION
            </span>
            <span>Workflow progression is driven dynamically by backend orchestration events.</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIPS 140-3 COMPLIANT ENCLAVES</span>
          </div>
        </div>
      </div>

      {/* 2. Predefined Workflow Cards Grid (All 5 Workflows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="rounded-[10px] bg-white border border-[#ebebeb] p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all space-y-4 group"
          >
            {/* Card Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] group-hover:border-[#d4d4d4] transition-colors">
                    {getWorkflowIcon(wf.iconName)}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#171717] group-hover:text-[#0070f3] transition-colors font-sans">
                      {wf.title}
                    </h2>
                    <span className="text-[10px] text-[#8f8f8f] uppercase font-mono">
                      {wf.category}
                    </span>
                  </div>
                </div>

                <Badge variant={getComplexityVariant(wf.complexity)} size="sm">
                  {wf.complexity}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-[#4d4d4d] leading-relaxed line-clamp-3 font-sans">
                {wf.description}
              </p>
            </div>

            {/* Middle: Sequential Steps Flow Preview */}
            <div className="space-y-2 pt-2 border-t border-[#ebebeb]">
              <div className="flex items-center justify-between text-[11px] text-[#8f8f8f]">
                <span className="uppercase font-semibold font-mono">Pipeline Steps:</span>
                <span className="text-[#171717] font-bold font-mono">{wf.steps.length} STAGES</span>
              </div>

              {/* Step Sequence Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                {wf.steps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <span className="px-1.5 py-0.5 rounded bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d] font-mono">
                      {step.name}
                    </span>
                    {idx < wf.steps.length - 1 && (
                      <ChevronRight className="w-2.5 h-2.5 text-[#8f8f8f] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Bottom: Inputs & Action Button */}
            <div className="space-y-3 pt-3 border-t border-[#ebebeb]">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8f8f8f] text-[10px] uppercase font-semibold font-mono">
                    INPUTS:
                  </span>
                  <div className="flex gap-1">
                    {wf.inputTypes.map((inp) => (
                      <span
                        key={inp}
                        className="px-1.5 py-0.5 rounded bg-[#fafafa] border border-[#ebebeb] text-[#171717] text-[9px] font-medium font-mono"
                      >
                        {inp}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] text-[#8f8f8f] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {wf.estimatedDuration}
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => handleStartWorkflow(wf)}
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                Run Workflow
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= 3. WORKFLOW EXECUTION DRAWER / MODAL ================= */}
      <Modal
        isOpen={!!activeSession}
        onClose={handleCloseModal}
        title={activeSession?.workflowTitle || 'Executing Workflow'}
        description={`Sovereign Pipeline Execution • ID: ${activeSession?.executionId}`}
        size="lg"
      >
        {activeSession && (
          <ModalBody className="space-y-4">
            {/* Top Status & Progress Bar */}
            <div className="p-3.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="uppercase font-bold text-[#171717] flex items-center gap-1.5">
                    {activeSession.status === 'RUNNING' && (
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                    STATUS: {activeSession.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#8f8f8f]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeSession.elapsedSeconds}s elapsed
                  </span>
                  <span className="font-bold text-[#171717]">
                    {activeSession.progressPercent}%
                  </span>
                </div>
              </div>

              <ProgressBar
                value={activeSession.progressPercent}
                size="md"
                variant={activeSession.status === 'COMPLETED' ? 'success' : 'info'}
              />
            </div>

            {/* Sequential Steps Progression Timeline */}
            <div className="space-y-2 font-mono">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8f8f8f] block">
                Execution Stages:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSession.steps.map((step, idx) => (
                  <div
                    key={step.stepId}
                    className={`p-2.5 rounded-[6px] border text-xs flex items-center justify-between gap-2 transition-all ${
                      step.status === 'completed'
                        ? 'bg-emerald-50/50 border-emerald-200 text-[#171717]'
                        : step.status === 'running'
                        ? 'bg-[#f5f5f5] border-[#171717] text-[#171717]'
                        : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {step.status === 'running' && (
                        <span className="h-3.5 w-3.5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin shrink-0 block" />
                      )}
                      {step.status === 'pending' && (
                        <span className="h-2 w-2 rounded-full bg-[#8f8f8f] shrink-0 block my-1" />
                      )}
                      <span className="font-semibold truncate">
                        {idx + 1}. {step.name}
                      </span>
                    </div>

                    {step.elapsedMs !== undefined && (
                      <span className="text-[10px] text-[#8f8f8f] shrink-0 font-mono">
                        {step.elapsedMs}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Terminal Diagnostic Logs Stream */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#8f8f8f]">
                <span className="flex items-center gap-1.5 uppercase font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-[#171717]" /> Live Orchestration Logs
                </span>
                <span>REAL-TIME STREAM</span>
              </div>

              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] h-40 overflow-y-auto font-mono text-[11px] text-[#4d4d4d] leading-relaxed space-y-1 select-text">
                {activeSession.logs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes('[SUCCESS]')
                        ? 'text-emerald-700 font-semibold'
                        : log.includes('[ABORT]')
                        ? 'text-red-600 font-semibold'
                        : log.includes('[EXEC]')
                        ? 'text-[#171717] font-semibold'
                        : 'text-[#8f8f8f]'
                    }
                  >
                    {log}
                  </div>
                ))}
                <div ref={terminalLogsEndRef} />
              </div>
            </div>

            {/* Generated Deliverable Box (Shown on completion) */}
            {activeSession.artifact && (
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/60 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300 uppercase">
                        CERTIFIED DELIVERABLE COMPILED
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary mt-1">
                      {activeSession.artifact.filename}
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      {activeSession.artifact.summary}
                    </p>
                  </div>

                  <Badge variant="success" size="sm">
                    {activeSession.artifact.fileType} • {activeSession.artifact.size}
                  </Badge>
                </div>

                {/* SHA-256 preview */}
                <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-emerald-900/40">
                  <span className="font-mono truncate max-w-[280px]">
                    SHA: {activeSession.artifact.checksumSha256}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(activeSession.artifact!.checksumSha256)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
              </div>
            )}
          </ModalBody>
        )}

        <ModalFooter>
          {activeSession?.status === 'RUNNING' ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancelWorkflow}
              leftIcon={<StopCircle className="w-3.5 h-3.5" />}
            >
              Cancel Execution
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          )}

          {activeSession?.artifact && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadArtifact}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Deliverable
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Workflows
