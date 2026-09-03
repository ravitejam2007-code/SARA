import React, { useState } from 'react'
import {
  Activity,
  Wrench,
  Cpu,
  BookOpen,
  Package,
  CheckCircle2,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  FileCode,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import type {
  AgentStep,
  ToolCallItem,
  ModelSelectionInfo,
  SourceCitation,
  GeneratedArtifact,
} from '@/types/workspace'
import { cn } from '@/utils/cn'

export interface AgentInspectorProps {
  currentTask?: string
  steps: AgentStep[]
  toolCalls: ToolCallItem[]
  modelInfo?: ModelSelectionInfo
  sources: SourceCitation[]
  artifacts: GeneratedArtifact[]
  isExecuting?: boolean
  elapsedSeconds?: number
  className?: string
}

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  currentTask = 'Standby // Awaiting task dispatch',
  steps,
  toolCalls,
  modelInfo,
  sources,
  artifacts,
  isExecuting = false,
  elapsedSeconds = 0,
  className,
}) => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('activity')
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null)
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null)

  const handleCopySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet)
    setCopiedSnippetId(id)
    setTimeout(() => setCopiedSnippetId(null), 2000)
  }

  const handleDownload = (artifact: GeneratedArtifact) => {
    toast.success('Download Initiated', `Exporting ${artifact.filename} from sovereign storage.`)
  }

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'Python':
        return <FileCode className="w-3.5 h-3.5 text-[#171717]" />
      case 'Excel':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
      case 'OCR':
        return <FileText className="w-3.5 h-3.5 text-amber-700" />
      case 'Document Generator':
        return <Package className="w-3.5 h-3.5 text-[#0070f3]" />
      default:
        return <Wrench className="w-3.5 h-3.5 text-[#8f8f8f]" />
    }
  }

  return (
    <div
      className={cn(
        'rounded-[10px] bg-white border border-[#ebebeb] flex flex-col h-full overflow-hidden font-mono shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {/* Top Inspector Status Bar */}
      <div className="p-3.5 border-b border-[#ebebeb] bg-[#fafafa] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#171717]" />
          <span className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
            AGENT RUNTIME INSPECTOR
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isExecuting ? (
            <Badge variant="info" size="sm" dot>
              RUNNING ({elapsedSeconds}s)
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              IDLE
            </Badge>
          )}
        </div>
      </div>

      {/* Tab Controls */}
      <div className="px-3 pt-3 border-b border-border/80 bg-surface-sunken/40">
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabList className="w-full justify-start overflow-x-auto">
            <TabTrigger value="activity" icon={<Activity className="w-3.5 h-3.5" />}>
              Activity ({steps.length})
            </TabTrigger>
            <TabTrigger value="tools" icon={<Wrench className="w-3.5 h-3.5" />}>
              Tools ({toolCalls.length})
            </TabTrigger>
            <TabTrigger value="model" icon={<Cpu className="w-3.5 h-3.5" />}>
              Model
            </TabTrigger>
            <TabTrigger value="sources" icon={<BookOpen className="w-3.5 h-3.5" />}>
              Sources ({sources.length})
            </TabTrigger>
            <TabTrigger value="artifacts" icon={<Package className="w-3.5 h-3.5" />}>
              Deliverables ({artifacts.length})
            </TabTrigger>
          </TabList>

          {/* ================= TAB 1: AGENT ACTIVITY ================= */}
          <TabContent value="activity" className="p-3.5 space-y-4 overflow-y-auto max-h-[580px]">
            {/* Current Active Task Card */}
            <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#8f8f8f]">
                <span className="uppercase font-semibold">Active Operational Task:</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {elapsedSeconds}s elapsed
                </span>
              </div>
              <p className="text-xs font-semibold text-[#171717] leading-snug">{currentTask}</p>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#8f8f8f] uppercase font-semibold block">
                Execution Progression
              </span>

              {steps.length === 0 ? (
                <div className="p-6 text-center text-[#8f8f8f] text-xs border border-dashed border-[#ebebeb] rounded-[6px]">
                  No execution steps recorded. Dispatch a prompt to begin orchestration.
                </div>
              ) : (
                <div className="space-y-2">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        'p-2.5 rounded-[6px] border text-xs transition-all flex items-start justify-between gap-3',
                        step.status === 'completed'
                          ? 'bg-emerald-50/50 border-emerald-200 text-[#171717]'
                          : step.status === 'running'
                          ? 'bg-[#f5f5f5] border-[#171717] text-[#171717]'
                          : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f]'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {step.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {step.status === 'running' && (
                            <span className="h-3.5 w-3.5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin block" />
                          )}
                          {step.status === 'pending' && (
                            <span className="h-2 w-2 rounded-full bg-[#8f8f8f] block my-1" />
                          )}
                        </div>

                        <div>
                          <div className="font-semibold text-[#171717]">{step.title}</div>
                          {step.outputSummary && (
                            <p className="text-[11px] text-[#8f8f8f] mt-0.5 leading-normal">
                              {step.outputSummary}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {step.toolName && (
                          <Badge variant="default" size="sm" className="text-[9px] py-0">
                            {step.toolName}
                          </Badge>
                        )}
                        {step.elapsedMs !== undefined && (
                          <div className="text-[10px] text-[#8f8f8f] mt-0.5">
                            {step.elapsedMs}ms
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabContent>

          {/* ================= TAB 2: TOOL INVOCATIONS ================= */}
          <TabContent value="tools" className="p-3.5 space-y-3 overflow-y-auto max-h-[580px]">
            <div className="flex items-center justify-between text-[11px] text-[#8f8f8f]">
              <span className="uppercase font-semibold">Local Sandboxed Tools</span>
              <span>Total Invocations: {toolCalls.length}</span>
            </div>

            {toolCalls.length === 0 ? (
              <div className="p-6 text-center text-[#8f8f8f] text-xs border border-dashed border-[#ebebeb] rounded-[6px]">
                No deterministic tool calls executed yet.
              </div>
            ) : (
              toolCalls.map((tc) => (
                <div
                  key={tc.id}
                  className="rounded-[6px] border border-[#ebebeb] bg-[#fafafa] overflow-hidden text-xs space-y-2 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getToolIcon(tc.tool)}
                      <span className="font-semibold text-[#171717] uppercase">{tc.tool}</span>
                    </div>
                    <Badge variant={tc.status === 'completed' ? 'success' : 'default'} size="sm">
                      {tc.status}
                    </Badge>
                  </div>

                  {/* Tool Input */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8f8f8f] uppercase">Input:</span>
                    <pre className="p-2 rounded-[6px] bg-white border border-[#ebebeb] text-[11px] text-[#171717] overflow-x-auto whitespace-pre-wrap">
                      {tc.input}
                    </pre>
                  </div>

                  {/* Tool Output */}
                  {tc.output && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-muted uppercase">Output Result:</span>
                      <pre className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[11px] text-[#171717] overflow-x-auto whitespace-pre-wrap">
                        {tc.output}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-between text-[10px] text-text-muted pt-1 border-t border-border/60">
                    <span>LATENCY: {tc.elapsedMs}ms</span>
                    <span>TIMESTAMP: {tc.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </TabContent>

          {/* ================= TAB 3: MODEL SELECTION RESULT ================= */}
          <TabContent value="model" className="p-3.5 space-y-4 overflow-y-auto max-h-[580px]">
            {modelInfo ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white border border-[#ebebeb] space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717] flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#171717]" />
                      {modelInfo.modelName}
                    </span>
                    <Badge variant="success" size="sm" dot>
                      {modelInfo.modelStatus}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-semibold">
                      Task Classification:
                    </span>
                    <p className="text-xs text-text-primary">{modelInfo.taskType}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border">
                    <span className="text-[10px] text-text-muted uppercase font-semibold">
                      Reason for Selection:
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {modelInfo.reasonForSelection}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px]">
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-text-muted block text-[10px]">INFERENCE LATENCY</span>
                      <span className="text-[#171717] font-bold">{modelInfo.latencyMs}ms</span>
                    </div>
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-text-muted block text-[10px]">MAX CONTEXT</span>
                      <span className="text-text-primary font-bold">{modelInfo.contextWindow}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-text-muted text-xs border border-dashed border-border rounded">
                No model dynamically selected yet.
              </div>
            )}
          </TabContent>

          {/* ================= TAB 4: SOURCES (CITATIONS) ================= */}
          <TabContent value="sources" className="p-3.5 space-y-3 overflow-y-auto max-h-[580px]">
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span className="uppercase font-semibold">Sovereign Knowledge Citations</span>
              <span>Vector Relevance Score</span>
            </div>

            {sources.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-xs border border-dashed border-border rounded">
                No document sources cited for current turn.
              </div>
            ) : (
              sources.map((src) => {
                const isExpanded = expandedSourceId === src.id
                return (
                  <div
                    key={src.id}
                    className="rounded border border-border bg-surface-sunken p-3 text-xs space-y-2 hover:border-border-strong transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-semibold text-text-primary truncate flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#171717] shrink-0" />
                          <span className="truncate">{src.filename}</span>
                        </div>
                        <div className="text-[10px] text-text-muted">
                          PAGE {src.page} • FORMAT: {src.fileType}
                        </div>
                      </div>

                      <Badge variant="success" size="sm">
                        {src.relevance}% MATCH
                      </Badge>
                    </div>

                    {/* Expandable Snippet Preview */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedSourceId(isExpanded ? null : src.id)}
                        className="flex items-center gap-1 text-[11px] text-[#171717] hover:underline font-semibold transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Citation Snippet' : 'Inspect Snippet'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[11px] text-[#4d4d4d] leading-relaxed relative font-sans">
                          <p>{src.snippet}</p>
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(src.snippet, src.id)}
                            className="mt-2 text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1"
                          >
                            {copiedSnippetId === src.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </TabContent>

          {/* ================= TAB 5: GENERATED DELIVERABLES ================= */}
          <TabContent value="artifacts" className="p-3.5 space-y-3 overflow-y-auto max-h-[580px]">
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span className="uppercase font-semibold">Generated Deliverables</span>
              <span>Cryptographic Exports</span>
            </div>

            {artifacts.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-xs border border-dashed border-border rounded">
                No artifacts generated yet. Ask the agent to produce an engineering brief or code package.
              </div>
            ) : (
              artifacts.map((art) => (
                <div
                  key={art.id}
                  className="p-3 rounded-lg border border-border bg-white space-y-2 hover:border-[#d4d4d4] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-text-primary text-xs truncate flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#171717] shrink-0" />
                        <span className="truncate">{art.filename}</span>
                      </div>
                      <div className="text-[10px] text-text-muted">
                        SIZE: {art.size} • GENERATED: {art.createdAt}
                      </div>
                    </div>

                    <Badge variant="info" size="sm">
                      {art.fileType}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-border/80 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      READY FOR EXPORT
                    </span>

                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleDownload(art)}
                      leftIcon={<Download className="w-3 h-3" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AgentInspector
