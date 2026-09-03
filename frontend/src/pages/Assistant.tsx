import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Send,
  Square,
  Upload,
  Paperclip,
  X,
  FileText,
  Bot,
  User,
  Radio,
  FileCheck,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

import { MarkdownMessage } from '@/components/workspace/MarkdownMessage'
import { AgentInspector } from '@/components/workspace/AgentInspector'
import { agentWebSocketService } from '@/services/websocket'

import type {
  ChatMessage,
  UploadedAttachment,
  AgentStep,
  ToolCallItem,
  ModelSelectionInfo,
  SourceCitation,
  GeneratedArtifact,
  WebSocketAgentEvent,
} from '@/types/workspace'

export const Assistant: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  // Conversation & Messaging State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content:
        '### Sovereign Industrial AI Agent Online\n\nEnclave initialized with `Zenith-Engineer-70B-FP8` and `DeepCAD-Vision`. All prompts, vector queries, and mathematical models operate strictly on-premise without external network egress.\n\nAttach engineering files (`.step`, `.pdf`, `.xml`, `.py`) or select a prompt below to dispatch an autonomous pipeline.',
      timestamp: '14:20 UTC',
      status: 'completed',
    },
  ])

  const [inputPrompt, setInputPrompt] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(true)

  // File Upload State
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Agent Inspector Live States
  const [currentTask, setCurrentTask] = useState<string>(
    'Standby // Awaiting engineering prompt or CAD upload'
  )
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCallItem[]>([])
  const [modelInfo, setModelInfo] = useState<ModelSelectionInfo | undefined>({
    modelName: 'Zenith-Engineer-70B-FP8 + DeepCAD-Vision',
    taskType: 'Multimodal Industrial Reasoning & CAD Simulation',
    reasonForSelection: 'Default sovereign baseline loaded in GPU enclave memory.',
    modelStatus: 'ONLINE',
    latencyMs: 14,
    contextWindow: '128K',
  })
  const [sources, setSources] = useState<SourceCitation[]>([])
  const [artifacts, setArtifacts] = useState<GeneratedArtifact[]>([])

  // Auto-scroll anchor
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Timer while executing
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isExecuting) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      setElapsedSeconds(0)
    }
    return () => clearInterval(timer)
  }, [isExecuting])

  // Subscribe to WebSocket events
  useEffect(() => {
    agentWebSocketService.connect('session-workspace-01')

    const unsubscribe = agentWebSocketService.onMessage((event: WebSocketAgentEvent) => {
      switch (event.type) {
        case 'agent:start':
          setCurrentTask(event.payload.task)
          setIsExecuting(true)
          break

        case 'agent:step':
          setSteps((prev) => {
            const existingIdx = prev.findIndex((s) => s.id === event.payload.step.id)
            if (existingIdx >= 0) {
              const updated = [...prev]
              updated[existingIdx] = event.payload.step
              return updated
            }
            return [...prev, event.payload.step]
          })
          break

        case 'agent:tool_call':
          setToolCalls((prev) => [event.payload.toolCall, ...prev])
          break

        case 'agent:model_selected':
          setModelInfo(event.payload.modelInfo)
          break

        case 'agent:sources':
          setSources(event.payload.sources)
          break

        case 'agent:token':
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.sender === 'assistant' && last.status === 'streaming') {
              const updatedLast = {
                ...last,
                content: last.content + event.payload.text,
              }
              return [...prev.slice(0, -1), updatedLast]
            }
            return prev
          })
          break

        case 'agent:artifact':
          setArtifacts((prev) => [event.payload.artifact, ...prev])
          toast.success('Artifact Ready', `${event.payload.artifact.filename} generated and signed.`)
          break

        case 'agent:complete':
          setIsExecuting(false)
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.sender === 'assistant') {
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  status: 'completed',
                  modelUsed: modelInfo,
                  sources: sources,
                  artifacts: artifacts,
                },
              ]
            }
            return prev
          })
          break

        case 'agent:stopped':
          setIsExecuting(false)
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.sender === 'assistant') {
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  content: last.content + '\n\n*(Execution halted by operator)*',
                  status: 'completed',
                },
              ]
            }
            return prev
          })
          toast.warning('Execution Halted', 'Agent execution was cancelled.')
          break
      }
    })

    return () => {
      unsubscribe()
      agentWebSocketService.disconnect()
    }
  }, [modelInfo, sources, artifacts, toast])

  // File Upload Handlers
  const handleFilesChosen = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const allowedExtensions = ['step', 'stp', 'pdf', 'xml', 'json', 'csv', 'py', 'xlsx', 'dwg']
    const maxSizeBytes = 100 * 1024 * 1024 // 100MB

    const newAttachments: UploadedAttachment[] = []

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!allowedExtensions.includes(ext)) {
        toast.error('Unsupported Format', `.${ext} is not allowed. Upload CAD (.step), PDF, or Code.`)
        return
      }
      if (file.size > maxSizeBytes) {
        toast.error('File Exceeds Limit', `${file.name} exceeds the 100MB enclave boundary.`)
        return
      }

      const attachment: UploadedAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type || ext.toUpperCase(),
        extension: ext,
        progress: 100,
        status: 'ready',
      }
      newAttachments.push(attachment)
    })

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments])
      toast.info('File Staged', `${newAttachments.length} file(s) staged for sovereign ingestion.`)
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  // Send Prompt Dispatcher
  const handleSendMessage = useCallback(() => {
    if ((!inputPrompt.trim() && attachments.length === 0) || isExecuting) return

    const userMessageText = inputPrompt.trim()
    const stagedAttachments = [...attachments]

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: userMessageText || 'Analyze the staged engineering attachment.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      attachments: stagedAttachments,
    }

    const assistantPlaceholderMsg: ChatMessage = {
      id: `msg-asst-${Date.now()}`,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'streaming',
    }

    setMessages((prev) => [...prev, userMsg, assistantPlaceholderMsg])
    setInputPrompt('')
    setAttachments([])

    // Dispatch message via WebSocket abstraction
    agentWebSocketService.sendMessage(userMessageText, stagedAttachments)
  }, [inputPrompt, attachments, isExecuting])

  const handleStopExecution = () => {
    agentWebSocketService.sendStop()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Starter suggestion prompts
  const starterPrompts = [
    'Verify Von Mises stress for Inconel 718 turbine blade root fillet under 1,450°C load.',
    'Inspect Beckhoff TwinCAT3 Structured Text emergency coolant valve interlock for race conditions.',
    'Extract GD&T perpendicularity tolerances from CAD STEP model and generate inspection brief.',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] font-mono text-text-primary gap-3">
      {/* 1. Header Strip */}
      <div className="p-3.5 rounded-[10px] bg-white border border-[#ebebeb] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.04)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-[#171717] uppercase flex items-center gap-2">
              <span>SARA AI WORKSPACE // SOVEREIGN RUNTIME</span>
            </h1>
            <span className="text-[10px] text-[#8f8f8f]">
              AIR-GAP ENCLAVE • USER: {user?.callsign || 'OPERATOR'} • LOCAL INFERENCE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-[#8f8f8f]">STATUS:</span>
            <span className="text-emerald-700 font-bold">AIR-GAP VERIFIED</span>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setMessages([
                {
                  id: 'msg-init-reset',
                  sender: 'assistant',
                  content: '### Session Cleared\n\nContext window has been cleared. Enclave ready for new tasks.',
                  timestamp: 'Just now',
                  status: 'completed',
                },
              ])
              setSteps([])
              setToolCalls([])
              setSources([])
              setArtifacts([])
              toast.info('Session Cleared', 'Conversation memory cleared.')
            }}
            leftIcon={<Trash2 className="w-3 h-3" />}
          >
            Clear Context
          </Button>

          <button
            type="button"
            onClick={() => setIsInspectorExpanded((prev) => !prev)}
            className="p-1.5 rounded text-text-muted hover:text-text-primary bg-surface-sunken border border-border text-xs flex items-center gap-1 cursor-pointer"
            title={isInspectorExpanded ? 'Collapse Inspector' : 'Expand Inspector'}
          >
            {isInspectorExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isInspectorExpanded ? 'Focus Chat' : 'Show Inspector'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout (Chat + Agent Inspector) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* ================= LEFT / MAIN: CONVERSATION AREA ================= */}
        <div
          className={`flex flex-col h-full rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ${
            isInspectorExpanded ? 'lg:col-span-7 xl:col-span-7' : 'lg:col-span-12'
          }`}
        >
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Assistant Avatar */}
                {msg.sender === 'assistant' && (
                  <div className="h-7 w-7 rounded-[6px] bg-[#171717] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-[10px] p-3.5 space-y-2 border leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-[#171717] border-[#171717] text-white'
                      : 'bg-[#fafafa] border-[#ebebeb] text-[#171717]'
                  }`}
                >
                  {/* Message Meta Header */}
                  <div className={`flex items-center justify-between text-[10px] gap-4 border-b pb-1.5 font-mono ${
                    msg.sender === 'user' ? 'border-white/20 text-white/70' : 'border-[#ebebeb] text-[#8f8f8f]'
                  }`}>
                    <span className="font-semibold uppercase tracking-wider">
                      {msg.sender === 'user' ? user?.callsign || 'OPERATOR' : 'SARA AGENT'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>{msg.timestamp}</span>
                      {msg.status === 'streaming' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          STREAMING
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Attached Files Chips in Message */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] border text-[11px] font-mono ${
                            msg.sender === 'user'
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-white border-[#ebebeb] text-[#171717]'
                          }`}
                        >
                          <FileText className="w-3 h-3" />
                          <span>{att.name}</span>
                          <span className="text-[9px] opacity-70">
                            ({(att.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Content */}
                  {msg.content ? (
                    <MarkdownMessage content={msg.content} />
                  ) : (
                    msg.status === 'streaming' && (
                      <div className="flex items-center gap-2 text-[#8f8f8f] py-2">
                        <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Initializing sovereign multi-physics reasoning...</span>
                      </div>
                    )
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="h-7 w-7 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[#171717] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter Suggestions (Shown when chat has only welcome) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-semibold block mb-1.5 font-mono">
                Suggested Sovereign Workflows:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {starterPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInputPrompt(prompt)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d] hover:text-[#171717] hover:border-[#171717] transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Composer & Drag-and-Drop Staging Area */}
          <div
            className={`p-3 border-t border-[#ebebeb] bg-white transition-colors relative ${
              isDraggingOver ? 'bg-[#f5f5f5]' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDraggingOver(true)
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDraggingOver(false)
              handleFilesChosen(e.dataTransfer.files)
            }}
          >
            {/* Drag & Drop Overlay Feedback */}
            {isDraggingOver && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm border-2 border-dashed border-white rounded-[6px] flex items-center justify-center z-20 pointer-events-none text-white">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4" /> DROP CAD OR ENGINEERING SPECIFICATION HERE
                </span>
              </div>
            )}

            {/* Staged Attachment Chips */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[10px] text-[#8f8f8f] uppercase font-semibold font-mono">
                  Attachments ({attachments.length}):
                </span>
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-white border border-[#ebebeb] text-[11px] text-[#171717] font-mono"
                  >
                    <FileCheck className="w-3 h-3 text-emerald-600" />
                    <span className="max-w-[140px] truncate">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-[#8f8f8f] hover:text-[#ee0000] transition-colors cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="flex items-end gap-2">
              {/* Hidden File Picker Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFilesChosen(e.target.files)}
                accept=".step,.stp,.pdf,.xml,.json,.csv,.py,.xlsx,.dwg"
              />

              {/* Upload Attachment Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] text-[#8f8f8f] hover:text-[#171717] hover:border-[#171717] transition-colors shrink-0 focus:outline-none cursor-pointer"
                title="Attach CAD model, PDF spec, or code"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a technical question, request thermal FEA, or describe workflow... (Enter to send)"
                  rows={2}
                  disabled={isExecuting}
                  className="w-full resize-none rounded-[6px] bg-white border border-[#ebebeb] p-2.5 text-xs text-[#171717] placeholder:text-[#8f8f8f] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] font-mono leading-relaxed"
                />
              </div>

              {/* Action Button: Send or Stop */}
              {isExecuting ? (
                <Button
                  variant="destructive"
                  size="md"
                  onClick={handleStopExecution}
                  leftIcon={<Square className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  STOP
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSendMessage}
                  disabled={!inputPrompt.trim() && attachments.length === 0}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  SEND
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT: AGENT RUNTIME & INSPECTOR ================= */}
        {isInspectorExpanded && (
          <div className="lg:col-span-5 xl:col-span-5 h-full overflow-hidden">
            <AgentInspector
              currentTask={currentTask}
              steps={steps}
              toolCalls={toolCalls}
              modelInfo={modelInfo}
              sources={sources}
              artifacts={artifacts}
              isExecuting={isExecuting}
              elapsedSeconds={elapsedSeconds}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Assistant
