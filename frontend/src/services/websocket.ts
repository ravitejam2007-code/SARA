import type {
  WebSocketAgentEvent,
  UploadedAttachment,
  AgentStep,
  ToolCallItem,
  ModelSelectionInfo,
  SourceCitation,
  GeneratedArtifact,
} from '@/types/workspace'

/**
 * Zenith AI — Sovereign WebSocket Service Abstraction
 *
 * Provides a clean interface for real-time streaming agent communication,
 * allowing the backend WebSocket connection to be attached seamlessly later.
 * Includes a deterministic simulation engine for frontend development and testing.
 */

export interface IAgentWebSocketService {
  connect(sessionId: string): Promise<void>
  disconnect(): void
  sendMessage(content: string, attachments?: UploadedAttachment[]): void
  sendStop(): void
  onMessage(callback: (msg: WebSocketAgentEvent) => void): () => void
  isConnected(): boolean
}

export class MockAgentWebSocketService implements IAgentWebSocketService {
  private connected = false
  private sessionId = 'default-session'
  private listeners: ((msg: WebSocketAgentEvent) => void)[] = []
  private activeTimers: ReturnType<typeof setTimeout>[] = []
  private isProcessing = false

  async connect(sessionId: string): Promise<void> {
    this.sessionId = sessionId
    this.connected = true
    console.info(`[Zenith AgentWS] Subscribed to sovereign session: ${sessionId}`)
  }

  disconnect(): void {
    this.sendStop()
    this.connected = false
    this.listeners = []
    console.info('[Zenith AgentWS] Disconnected from sovereign session')
  }

  isConnected(): boolean {
    return this.connected
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

  sendStop(): void {
    if (!this.isProcessing) return
    this.isProcessing = false
    this.clearAllTimers()

    this.emit({
      type: 'agent:stopped',
      sessionId: this.sessionId,
      payload: { message: 'Agent execution halted by operator override.' },
      timestamp: new Date().toISOString(),
    })
  }

  private clearAllTimers() {
    this.activeTimers.forEach((t) => clearTimeout(t))
    this.activeTimers = []
  }

  sendMessage(_content: string, attachments?: UploadedAttachment[]): void {
    this.sendStop()
    this.isProcessing = true

    const hasAttachment = attachments && attachments.length > 0
    const filename = hasAttachment ? attachments[0].name : 'Turbine_Blade_Assembly.step'

    // 1. Agent Start Event
    this.emit({
      type: 'agent:start',
      sessionId: this.sessionId,
      payload: {
        task: hasAttachment
          ? `Ingest and analyze engineering asset: ${filename}`
          : 'Deterministic Thermal Stress & Structural Simulation',
      },
      timestamp: new Date().toISOString(),
    })

    // 2. Step 1: File Received
    const t1 = setTimeout(() => {
      if (!this.isProcessing) return
      const step1: AgentStep = {
        id: 'step-1',
        stepNumber: 1,
        title: `File received: ${filename}`,
        status: 'completed',
        elapsedMs: 84,
        outputSummary: 'Binary checksum sha256:d8a9... validated within enclave buffer',
      }
      this.emit({
        type: 'agent:step',
        sessionId: this.sessionId,
        payload: { step: step1 },
        timestamp: new Date().toISOString(),
      })
    }, 400)
    this.activeTimers.push(t1)

    // 3. Step 2: OCR & Text Extractor Tool
    const t2 = setTimeout(() => {
      if (!this.isProcessing) return
      const ocrTool: ToolCallItem = {
        id: 'tool-ocr-01',
        tool: 'OCR',
        status: 'completed',
        input: `Extract geometric tolerance notes & callouts from ${filename}`,
        output: 'Extracted 14 GD&T tolerances: Perpendicularity 0.02mm, Max Operating Temp 1450°C, Alloy: Inconel 718',
        elapsedMs: 310,
        timestamp: '14:21:02 UTC',
      }
      this.emit({
        type: 'agent:tool_call',
        sessionId: this.sessionId,
        payload: { toolCall: ocrTool },
        timestamp: new Date().toISOString(),
      })

      const step2: AgentStep = {
        id: 'step-2',
        stepNumber: 2,
        title: 'OCR completed & GD&T annotations extracted',
        status: 'completed',
        toolName: 'OCR',
        elapsedMs: 310,
      }
      this.emit({
        type: 'agent:step',
        sessionId: this.sessionId,
        payload: { step: step2 },
        timestamp: new Date().toISOString(),
      })
    }, 1100)
    this.activeTimers.push(t2)

    // 4. Step 3: RAG Search & Sources
    const t3 = setTimeout(() => {
      if (!this.isProcessing) return
      const ragTool: ToolCallItem = {
        id: 'tool-rag-02',
        tool: 'RAG Search',
        status: 'completed',
        input: 'Query: Inconel 718 thermal expansion coefficient & yield strength at 1200C',
        output: 'Retrieved 3 matched vectors from AEROSPACE-TURBINE-ONTOLOGY (Cosine: 0.984)',
        elapsedMs: 195,
        timestamp: '14:21:03 UTC',
      }
      this.emit({
        type: 'agent:tool_call',
        sessionId: this.sessionId,
        payload: { toolCall: ragTool },
        timestamp: new Date().toISOString(),
      })

      const sources: SourceCitation[] = [
        {
          id: 'src-1',
          filename: 'ISO_1982_Gas_Turbine_Blades_Stress_Limits.pdf',
          page: 42,
          relevance: 98.4,
          fileType: 'ISO',
          snippet: 'Section 4.8: For Nickel-base superalloys (Inconel 718) operating above 1100°C, the allowable plastic strain shall not exceed 0.2% per 10,000 equivalent operating hours.',
        },
        {
          id: 'src-2',
          filename: 'Turbine-Assembly-Hydraulics-Spec-Rev4.step',
          page: 1,
          relevance: 94.1,
          fileType: 'STEP',
          snippet: 'Geometric boundary definition: Leading edge root fillet radius R=3.50mm, trailing edge cooling channel diameter d=1.20mm.',
        },
        {
          id: 'src-3',
          filename: 'Metallurgy_Fatigue_Inconel718_Lab_Data.xml',
          page: 7,
          relevance: 89.6,
          fileType: 'XML',
          snippet: 'Experimental yield strength at 1200°C: 680 MPa. Thermal conductivity k = 22.4 W/(m·K).',
        },
      ]
      this.emit({
        type: 'agent:sources',
        sessionId: this.sessionId,
        payload: { sources },
        timestamp: new Date().toISOString(),
      })

      const step3: AgentStep = {
        id: 'step-3',
        stepNumber: 3,
        title: 'RAG searched & local ontology vectors aligned',
        status: 'completed',
        toolName: 'RAG Search',
        elapsedMs: 195,
      }
      this.emit({
        type: 'agent:step',
        sessionId: this.sessionId,
        payload: { step: step3 },
        timestamp: new Date().toISOString(),
      })
    }, 2000)
    this.activeTimers.push(t3)

    // 5. Step 4: Model Selection & Rationale
    const t4 = setTimeout(() => {
      if (!this.isProcessing) return
      const modelInfo: ModelSelectionInfo = {
        modelName: 'Zenith-Engineer-70B-FP8 + DeepCAD-Vision',
        taskType: 'Multimodal Boundary-Representation & Thermal FEM',
        reasonForSelection:
          'Selected for deterministic FP8 tensor performance and specialized boundary representation (B-Rep) geometric parsing.',
        modelStatus: 'ACTIVE',
        latencyMs: 14,
        contextWindow: '128K',
      }
      this.emit({
        type: 'agent:model_selected',
        sessionId: this.sessionId,
        payload: { modelInfo },
        timestamp: new Date().toISOString(),
      })

      const pythonTool: ToolCallItem = {
        id: 'tool-py-03',
        tool: 'Python',
        status: 'completed',
        input: `import numpy as np\n# Solve Von Mises Stress Matrix\nsigma_vm = np.sqrt(0.5 * ((s1 - s2)**2 + (s2 - s3)**2 + (s3 - s1)**2))\nprint(f"Peak Stress: {np.max(sigma_vm):.2f} MPa")`,
        output: 'Peak Von Mises Stress: 542.80 MPa (Safety Factor: 1.25, Pass Threshold: 1.15)',
        elapsedMs: 420,
        timestamp: '14:21:04 UTC',
      }
      this.emit({
        type: 'agent:tool_call',
        sessionId: this.sessionId,
        payload: { toolCall: pythonTool },
        timestamp: new Date().toISOString(),
      })

      const step4: AgentStep = {
        id: 'step-4',
        stepNumber: 4,
        title: 'Python thermal stress solver executed in sandbox',
        status: 'completed',
        toolName: 'Python',
        elapsedMs: 420,
      }
      this.emit({
        type: 'agent:step',
        sessionId: this.sessionId,
        payload: { step: step4 },
        timestamp: new Date().toISOString(),
      })
    }, 3100)
    this.activeTimers.push(t4)

    // 6. Step 5: Streaming Token Delivery
    const tokens = [
      '### Deterministic Thermal & Structural Evaluation\n\n',
      'The multi-physics inspection for **',
      filename,
      '** has completed across the sovereign enclave cluster.\n\n',
      '#### 1. Key Engineering Findings\n',
      '- **Material**: Inconel 718 (Nickel-Chromium Superalloy)\n',
      '- **Operating Temperature Boundary**: `1,450°C`\n',
      '- **Peak Von Mises Stress**: `542.80 MPa` localized at leading edge root fillet (`R=3.50mm`)\n',
      '- **Yield Safety Margin**: **`1.25x`** (Meets ISO 1982 requirement of `≥ 1.15x`)\n\n',
      '```python\n',
      '# Verification code executed in sovereign sandbox\n',
      'def verify_thermal_compliance(peak_stress_mpa: float, yield_limit_mpa: float) -> bool:\n',
      '    safety_factor = yield_limit_mpa / peak_stress_mpa\n',
      '    return safety_factor >= 1.15  # ISO 1982 Section 4.8\n\n',
      'assert verify_thermal_compliance(542.80, 680.0) == True\n',
      '```\n\n',
      '#### 2. Recommendation\n',
      'The blade root cooling channels maintain acceptable convective heat transfer. All geometric tolerances conform to aerospace manufacturing boundaries.',
    ]

    tokens.forEach((chunk, index) => {
      const t = setTimeout(() => {
        if (!this.isProcessing) return
        this.emit({
          type: 'agent:token',
          sessionId: this.sessionId,
          payload: { text: chunk },
          timestamp: new Date().toISOString(),
        })
      }, 3500 + index * 100)
      this.activeTimers.push(t)
    })

    // 7. Step 6: Artifact Generation & Completion
    const totalDelay = 3500 + tokens.length * 100 + 400
    const tFinal = setTimeout(() => {
      if (!this.isProcessing) return
      const artifact: GeneratedArtifact = {
        id: 'art-01',
        filename: 'Turbine_Blade_Thermal_Stress_Report.pdf',
        fileType: 'PDF',
        size: '14.8 MB',
        status: 'READY',
        createdAt: 'Just now',
      }
      this.emit({
        type: 'agent:artifact',
        sessionId: this.sessionId,
        payload: { artifact },
        timestamp: new Date().toISOString(),
      })

      const docTool: ToolCallItem = {
        id: 'tool-doc-04',
        tool: 'Document Generator',
        status: 'completed',
        input: 'Assemble engineering compliance certification report & SHA-256 seal',
        output: 'Created Turbine_Blade_Thermal_Stress_Report.pdf (SHA256: 8f4a...d91c)',
        elapsedMs: 280,
        timestamp: '14:21:07 UTC',
      }
      this.emit({
        type: 'agent:tool_call',
        sessionId: this.sessionId,
        payload: { toolCall: docTool },
        timestamp: new Date().toISOString(),
      })

      const step5: AgentStep = {
        id: 'step-5',
        stepNumber: 5,
        title: 'Generated deliverable artifact & sealed report',
        status: 'completed',
        toolName: 'Document Generator',
        elapsedMs: 280,
      }
      this.emit({
        type: 'agent:step',
        sessionId: this.sessionId,
        payload: { step: step5 },
        timestamp: new Date().toISOString(),
      })

      this.emit({
        type: 'agent:complete',
        sessionId: this.sessionId,
        payload: { totalElapsedMs: 4200 },
        timestamp: new Date().toISOString(),
      })

      this.isProcessing = false
    }, totalDelay)
    this.activeTimers.push(tFinal)
  }
}

// Export singleton instance
export const agentWebSocketService: IAgentWebSocketService = new MockAgentWebSocketService()
