/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * AI Workspace Domain Types
 */

export type MessageSender = 'user' | 'assistant' | 'system'

export type MessageStatus = 'sending' | 'streaming' | 'completed' | 'error'

export interface UploadedAttachment {
  id: string
  name: string
  size: number
  type: string
  extension: string
  progress: number
  status: 'uploading' | 'ready' | 'error'
  previewUrl?: string
}

export type ToolType =
  | 'OCR'
  | 'RAG Search'
  | 'Calculator'
  | 'Python'
  | 'Excel'
  | 'Document Generator'
  | 'Code Sandbox'

export interface ToolCallItem {
  id: string
  tool: ToolType
  status: 'running' | 'completed' | 'failed'
  input: string
  output?: string
  elapsedMs: number
  timestamp: string
}

export interface ModelSelectionInfo {
  modelName: string
  taskType: string
  reasonForSelection: string
  modelStatus: 'ONLINE' | 'ACTIVE' | 'WARM' | 'STANDBY'
  latencyMs: number
  contextWindow: string
}

export interface SourceCitation {
  id: string
  filename: string
  page: number
  relevance: number // e.g. 98.4%
  snippet: string
  fileType: 'PDF' | 'CAD' | 'STEP' | 'ISO' | 'XML'
}

export interface GeneratedArtifact {
  id: string
  filename: string
  fileType: 'PDF' | 'STEP' | 'PY' | 'XLSX' | 'JSON' | 'CSV'
  size: string
  status: 'READY' | 'GENERATING' | 'FAILED'
  downloadUrl?: string
  createdAt: string
}

export interface AgentStep {
  id: string
  stepNumber: number
  title: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  toolName?: ToolType
  elapsedMs?: number
  outputSummary?: string
}

export interface ChatMessage {
  id: string
  sender: MessageSender
  content: string
  timestamp: string
  status: MessageStatus
  attachments?: UploadedAttachment[]
  modelUsed?: ModelSelectionInfo
  toolCalls?: ToolCallItem[]
  sources?: SourceCitation[]
  artifacts?: GeneratedArtifact[]
}

// WebSocket Event Payloads
export type WebSocketAgentEventType =
  | 'agent:start'
  | 'agent:step'
  | 'agent:token'
  | 'agent:tool_call'
  | 'agent:model_selected'
  | 'agent:sources'
  | 'agent:artifact'
  | 'agent:complete'
  | 'agent:error'
  | 'agent:stopped'

export interface WebSocketAgentEvent {
  type: WebSocketAgentEventType
  sessionId: string
  payload: any
  timestamp: string
}
