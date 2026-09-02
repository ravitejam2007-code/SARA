/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Workflows & Deliverables Domain Types
 */

export type WorkflowComplexity = 'STANDARD' | 'MEDIUM' | 'COMPLEX'

export interface WorkflowStepDefinition {
  id: string
  name: string
  description: string
  tool?: string
}

export interface WorkflowDefinition {
  id: string
  title: string
  description: string
  inputTypes: string[]
  steps: WorkflowStepDefinition[]
  complexity: WorkflowComplexity
  estimatedDuration: string
  category: string
  iconName: string
}

export type StepExecutionStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface StepExecutionState {
  stepId: string
  name: string
  status: StepExecutionStatus
  elapsedMs?: number
  logSnippet?: string
}

export interface WorkflowOutputArtifact {
  id: string
  filename: string
  fileType: string
  size: string
  summary: string
  checksumSha256: string
  downloadUrl?: string
}

export interface WorkflowExecutionSession {
  executionId: string
  workflowId: string
  workflowTitle: string
  status: 'CONFIGURING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  activeStepIndex: number
  progressPercent: number
  steps: StepExecutionState[]
  logs: string[]
  elapsedSeconds: number
  artifact?: WorkflowOutputArtifact
  startedAt?: string
  completedAt?: string
}
