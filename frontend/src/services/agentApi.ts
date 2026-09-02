import { apiClient } from './api'
import { isDemoModeActive } from '@/utils/demoMode'

/**
 * Zenith AI — Sovereign Agent API Module
 * Connects with FastAPI /agent endpoints for chat, tool execution, and human approval.
 */

export interface AgentChatMessagePayload {
  sessionId: string
  content: string
  attachments?: string[]
}

export interface AgentRunRecord {
  id: string
  timestamp: string
  agentName: string
  taskDescription: string
  modelUsed: string
  tokensTotal: number
  latencyMs: number
  status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'APPROVAL_REQUIRED'
}

export interface HumanApprovalDecision {
  approvalId: string
  action: 'APPROVE' | 'REJECT'
  rationale?: string
}

export const agentApi = {
  /**
   * Send a prompt or engineering instruction to the autonomous agent
   */
  async sendMessage(payload: AgentChatMessagePayload): Promise<{ messageId: string; status: string }> {
    try {
      const response = await apiClient.post('/agent/chat', payload)
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 200))
      return {
        messageId: `msg-${Date.now().toString(36)}`,
        status: 'DISPATCHED_TO_LOCAL_ENCLAVE',
      }
    }
  },

  /**
   * Fetch historical agent telemetry runs
   */
  async getAgentRunHistory(): Promise<AgentRunRecord[]> {
    try {
      const response = await apiClient.get<AgentRunRecord[]>('/agent/runs')
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 150))
      return [
        {
          id: 'RUN-902',
          timestamp: '2026-09-02 17:15',
          agentName: 'Thermal Stress Analyst',
          taskDescription: 'Von Mises strain verification on Stage 1 rotor blade mesh',
          modelUsed: 'Zenith-Engineer-70B-FP8',
          tokensTotal: 3420,
          latencyMs: 1420,
          status: 'COMPLETED',
        },
        {
          id: 'RUN-901',
          timestamp: '2026-09-02 16:40',
          agentName: 'PLC Logic Synthesizer',
          taskDescription: 'Structured Text interlock logic synthesis for coolant loop',
          modelUsed: 'CodePLC-IEC-61131',
          tokensTotal: 1840,
          latencyMs: 980,
          status: 'COMPLETED',
        },
      ]
    }
  },

  /**
   * Submit Human-in-the-Loop decision on high-consequence operations
   */
  async submitHumanApproval(decision: HumanApprovalDecision): Promise<{ success: boolean; authorizationSeal: string }> {
    try {
      const response = await apiClient.post('/agent/tools/approve', decision)
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 250))
      return {
        success: true,
        authorizationSeal: `HSM_SIG_${decision.action}_${Date.now().toString(36)}`,
      }
    }
  },
}
