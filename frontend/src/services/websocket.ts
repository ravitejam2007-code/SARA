import type {
  WebSocketAgentEvent,
  UploadedAttachment,
  AgentStep,
  ToolCallItem,
  ModelSelectionInfo,
  SourceCitation,
  GeneratedArtifact,
  HumanApprovalRequestPayload,
} from '@/types/workspace'
import { isDemoModeActive } from '@/utils/demoMode'

/**
 * Zenith AI — Sovereign WebSocket Client & Gateway
 *
 * Connects to the FastAPI backend WebSocket stream for real-time agent telemetry:
 * - agent status
 * - tool calls
 * - model selection & reasoning rationale
 * - progress updates
 * - errors & timeouts
 * - completion & artifact compilation
 * - human approval requests (Human-in-the-Loop)
 *
 * When VITE_DEMO_MODE is active and the backend is unreachable, seamlessly
 * falls back to the deterministic enclave simulator.
 */

const WS_BASE_URL: string =
  import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/ws'

export interface IAgentWebSocketService {
  connect(sessionId: string): Promise<void>
  disconnect(): void
  sendMessage(content: string, attachments?: UploadedAttachment[]): void
  sendStop(): void
  sendApproval(approvalId: string, approved: boolean, rationale?: string): void
  onMessage(callback: (msg: WebSocketAgentEvent) => void): () => void
  isConnected(): boolean
}

export class SovereignAgentWebSocketService implements IAgentWebSocketService {
  private socket: WebSocket | null = null
  private sessionId = 'default-session'
  private listeners: ((msg: WebSocketAgentEvent) => void)[] = []
  private activeTimers: ReturnType<typeof setTimeout>[] = []
  private isProcessing = false
  private isSimulating = false

  async connect(sessionId: string): Promise<void> {
    this.sessionId = sessionId

    // Attempt real WebSocket connection first
    try {
      const url = `${WS_BASE_URL}/${sessionId}`
      this.socket = new WebSocket(url)

      this.socket.onopen = () => {
        console.info(`[Zenith AgentWS] Live WebSocket connected to sovereign gateway: ${url}`)
        this.isSimulating = false
        this.emit({
          type: 'agent:status',
          sessionId: this.sessionId,
          payload: { status: 'ONLINE', mode: 'LIVE_WEBSOCKET' },
          timestamp: new Date().toLocaleTimeString(),
        })
      }

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data) as WebSocketAgentEvent
          this.emit(parsed)
        } catch {
          console.warn('[Zenith AgentWS] Received non-JSON payload:', event.data)
        }
      }

      this.socket.onerror = (err) => {
        console.warn('[Zenith AgentWS] Live WebSocket encountered error:', err)
      }

      this.socket.onclose = () => {
        if (!isDemoModeActive()) {
          this.emit({
            type: 'agent:error',
            sessionId: this.sessionId,
            payload: { message: 'WebSocket connection to FastAPI gateway closed.' },
            timestamp: new Date().toLocaleTimeString(),
          })
        } else {
          // In Demo Mode: Seamless fallback to enclave simulation engine
          this.isSimulating = true
        }
      }
    } catch {
      if (isDemoModeActive()) {
        this.isSimulating = true
      }
    }
  }

  disconnect(): void {
    this.sendStop()
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.listeners = []
    this.isSimulating = false
  }

  isConnected(): boolean {
    return (this.socket && this.socket.readyState === WebSocket.OPEN) || this.isSimulating
  }

  onMessage(callback: (msg: WebSocketAgentEvent) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private emit(event: WebSocketAgentEvent) {
    this.listeners.forEach((l) => l(event))
  }

  sendApproval(approvalId: string, approved: boolean, rationale?: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'agent:human_approval_response',
          sessionId: this.sessionId,
          payload: { approvalId, approved, rationale },
          timestamp: new Date().toISOString(),
        })
      )
    }

    this.emit({
      type: 'agent:human_approval_resolved',
      sessionId: this.sessionId,
      payload: { approvalId, approved, rationale },
      timestamp: new Date().toLocaleTimeString(),
    })
  }

  sendStop(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'agent:stop',
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        })
      )
    }

    if (!this.isProcessing) return
    this.isProcessing = false
    this.clearAllTimers()

    this.emit({
      type: 'agent:stopped',
      sessionId: this.sessionId,
      payload: { reason: 'Operator requested emergency abort' },
      timestamp: new Date().toLocaleTimeString(),
    })
  }

  private clearAllTimers() {
    this.activeTimers.forEach((t) => clearTimeout(t))
    this.activeTimers = []
  }

  sendMessage(content: string, attachments?: UploadedAttachment[]): void {
    // If live WebSocket is connected, send real payload
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'agent:user_message',
          sessionId: this.sessionId,
          payload: { content, attachments },
          timestamp: new Date().toISOString(),
        })
      )
      return
    }

    // Otherwise, if Demo Mode is enabled, execute deterministic simulation
    if (isDemoModeActive()) {
      this.executeSimulationPipeline(content, attachments)
    }
  }

  private executeSimulationPipeline(content: string, attachments?: UploadedAttachment[]) {
    this.clearAllTimers()
    this.isProcessing = true

    const hasAttachment = attachments && attachments.length > 0
    const attachmentNames = attachments?.map((a) => a.name).join(', ') || ''

    // 1. Dispatch Status: Reasoning
    this.emit({
      type: 'agent:status',
      sessionId: this.sessionId,
      payload: { status: 'REASONING', description: 'Autonomous agent reasoning initiated' },
      timestamp: new Date().toLocaleTimeString(),
    })

    // 2. Select Model & Reasoning Rationale
    const tModel = setTimeout(() => {
      if (!this.isProcessing) return

      const modelInfo: ModelSelectionInfo = hasAttachment
        ? {
            modelName: 'DeepCAD-Vision-v2 + Zenith-Engineer-70B',
            taskType: 'Multi-Modal Geometric & Thermal Analysis',
            reasonForSelection: `Detected technical attachment(s) [${attachmentNames}]. Dispatched to on-premise vision encoder and 70B FP8 reasoning engine.`,
            modelStatus: 'ACTIVE',
            latencyMs: 38,
            contextWindow: '128k Tokens (Hardware Enclave)',
          }
        : {
            modelName: 'Zenith-Engineer-70B-FP8',
            taskType: 'Engineering Physics & Structured Logic Reasoning',
            reasonForSelection:
              'Selected local 70B parameter model with specialized mechanical engineering and thermodynamics fine-tuning.',
            modelStatus: 'ACTIVE',
            latencyMs: 14,
            contextWindow: '128k Tokens (Hardware Enclave)',
          }

      this.emit({
        type: 'agent:model_selected',
        sessionId: this.sessionId,
        payload: modelInfo,
        timestamp: new Date().toLocaleTimeString(),
      })

      // Emit Progress: 25%
      this.emit({
        type: 'agent:progress',
        sessionId: this.sessionId,
        payload: { progressPercent: 25, currentStage: 'Model Selection & Query Decomposition' },
        timestamp: new Date().toLocaleTimeString(),
      })
    }, 400)
    this.activeTimers.push(tModel)

    // 3. Step 1: Ingestion & OCR
    const tStep1 = setTimeout(() => {
      if (!this.isProcessing) return

      const step: AgentStep = {
        id: `step-${Date.now()}-1`,
        stepNumber: 1,
        title: hasAttachment
          ? `Ingesting & OCR scanning "${attachmentNames}"`
          : 'Parsing engineering instructions & extracting parameters',
        status: 'completed',
        toolName: hasAttachment ? 'OCR' : undefined,
        elapsedMs: 240,
        outputSummary: hasAttachment
          ? 'Optical character recognition extracted 4 dimensional callouts and material spec Inconel 718.'
          : 'Query parsed into 2 sub-tasks: stress calculation and regulatory verification.',
      }

      this.emit({
        type: 'agent:step',
        sessionId: this.sessionId,
        payload: step,
        timestamp: new Date().toLocaleTimeString(),
      })
    }, 900)
    this.activeTimers.push(tStep1)

    // 4. Step 2: RAG Vector Search & Citations
    const tStep2 = setTimeout(() => {
      if (!this.isProcessing) return

      const toolCall: ToolCallItem = {
        id: `tool-${Date.now()}-1`,
        tool: 'RAG Search',
        status: 'completed',
        input: 'Query sovereign Qdrant collection: Inconel 718 thermal yield limit ISO 1982',
        output: 'Retrieved 3 authoritative chunks (Cosine similarity > 0.94). Matched ISO 1982 Section 4.8.',
        elapsedMs: 180,
        timestamp: new Date().toLocaleTimeString(),
      }

      this.emit({
        type: 'agent:tool_call',
        sessionId: this.sessionId,
        payload: toolCall,
        timestamp: new Date().toLocaleTimeString(),
      })

      const citations: SourceCitation[] = [
        {
          id: 'src-1',
          filename: 'ISO_1982_Gas_Turbine_Blades_Stress_Limits.pdf',
          page: 42,
          relevance: 98.4,
          snippet:
            'Section 4.8.2: Maximum allowable plastic strain for Inconel 718 blade root under 1100°C shall not exceed 0.20% per 10,000 equivalent operating hours.',
          fileType: 'ISO',
        },
        {
          id: 'src-2',
          filename: 'Inconel_718_Creep_Fatigue_Technical_Spec.pdf',
          page: 18,
          relevance: 95.1,
          snippet:
            'Yield strength at 650°C is 680 MPa. Secondary creep regime exhibits steady-state strain rate of 1.4e-8 s^-1.',
          fileType: 'PDF',
        },
      ]

      this.emit({
        type: 'agent:sources',
        sessionId: this.sessionId,
        payload: citations,
        timestamp: new Date().toLocaleTimeString(),
      })

      this.emit({
        type: 'agent:progress',
        sessionId: this.sessionId,
        payload: { progressPercent: 60, currentStage: 'Sovereign Knowledge Retrieval & Tool Calls' },
        timestamp: new Date().toLocaleTimeString(),
      })
    }, 1600)
    this.activeTimers.push(tStep2)

    // 5. Human-in-the-Loop Approval Request (If sensitive command)
    if (content.toLowerCase().includes('isolate') || content.toLowerCase().includes('override') || content.toLowerCase().includes('approve')) {
      const tApproval = setTimeout(() => {
        if (!this.isProcessing) return

        const approvalPayload: HumanApprovalRequestPayload = {
          approvalId: `appr-${Date.now().toString(36)}`,
          actionTitle: 'Authorize Emergency Pneumatic Valve Actuation',
          description: 'Autonomous reasoning identified critical coolant transient. Operator confirmation required to commit actuation signal to field bus.',
          toolName: 'Code Sandbox / Hardware Interlock',
          riskLevel: 'CRITICAL',
          params: { valveId: 'V-102', pressureDropBarPerSec: 0.42, isolationWindowMs: 80 },
        }

        this.emit({
          type: 'agent:human_approval_request',
          sessionId: this.sessionId,
          payload: approvalPayload,
          timestamp: new Date().toLocaleTimeString(),
        })
      }, 2100)
      this.activeTimers.push(tApproval)
    }

    // 6. Token Streaming Simulation
    const tStream = setTimeout(() => {
      if (!this.isProcessing) return

      const streamChunks = [
        '### Sovereign Engineering Assessment\n\n',
        'Based on verified on-premise standards and multi-physics verification:\n\n',
        '1. **Material Compliance**: Evaluated against **ISO 1982 Section 4.8.2**.\n',
        '2. **Peak Root Stress**: Calculated at `542.80 MPa` with ambient boundary temperature `650°C`.\n',
        '3. **Yield Margin**: Material yield limit is `680.00 MPa` yielding an effective safety factor of **`1.25x`**.\n\n',
        '```python\n# Von Mises Stress Matrix Verification\nimport numpy as np\nsigma_x, sigma_y, tau_xy = 480.0, 120.0, 85.0\nvon_mises = np.sqrt(sigma_x**2 - sigma_x*sigma_y + sigma_y**2 + 3*tau_xy**2)\nassert von_mises < 680.0, "Yield threshold exceeded!"\n```\n\n',
        '**Certified Disposition**: The component fulfills dimensional clearance tolerances. Official deliverable artifact compiled below.\n',
      ]

      streamChunks.forEach((chunk, idx) => {
        const tChunk = setTimeout(() => {
          if (!this.isProcessing) return
          this.emit({
            type: 'agent:token',
            sessionId: this.sessionId,
            payload: { token: chunk },
            timestamp: new Date().toLocaleTimeString(),
          })
        }, idx * 120)
        this.activeTimers.push(tChunk)
      })
    }, 2400)
    this.activeTimers.push(tStream)

    // 7. Deliverable Compilation & Completion
    const tArtifact = setTimeout(() => {
      if (!this.isProcessing) return

      const artifact: GeneratedArtifact = {
        id: `art-${Date.now()}`,
        filename: 'Turbine_Blade_Thermal_Stress_Certified_Report.pdf',
        fileType: 'PDF',
        size: '14.8 MB',
        status: 'READY',
        createdAt: new Date().toLocaleTimeString(),
      }

      this.emit({
        type: 'agent:artifact',
        sessionId: this.sessionId,
        payload: artifact,
        timestamp: new Date().toLocaleTimeString(),
      })

      this.emit({
        type: 'agent:progress',
        sessionId: this.sessionId,
        payload: { progressPercent: 100, currentStage: 'Complete' },
        timestamp: new Date().toLocaleTimeString(),
      })

      this.emit({
        type: 'agent:complete',
        sessionId: this.sessionId,
        payload: { totalTokens: 3420, totalElapsedMs: 3200 },
        timestamp: new Date().toLocaleTimeString(),
      })

      this.isProcessing = false
    }, 3600)
    this.activeTimers.push(tArtifact)
  }
}

// Global Singleton Export
export const agentWebSocketService = new SovereignAgentWebSocketService()
export const agentWs = agentWebSocketService
export default agentWebSocketService
