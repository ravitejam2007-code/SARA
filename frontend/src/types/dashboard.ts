/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Dashboard Domain Types
 */

export interface DashboardKPIs {
  activeModels: number
  activeModelsTotal: number
  documentsProcessed: number
  agentRuns: number
  generatedDeliverables: number
  externalApiCalls: number
  localServicesStatus: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE'
  servicesHealthyCount: number
  servicesTotalCount: number
}

export type AgentRunStatus = 'COMPLETED' | 'RUNNING' | 'QUEUED' | 'FAILED'

export interface AgentRunItem {
  id: string
  task: string
  user: string
  model: string
  status: AgentRunStatus
  duration: string
  timestamp: string
  tokensProcessed?: number
}

export type ModelStatus = 'ONLINE' | 'INFERENCE' | 'WARM' | 'STANDBY'

export interface ModelActivityItem {
  id: string
  name: string
  capability: string
  status: ModelStatus
  currentLoad: number // 0 - 100
  vramUsage: string
  contextLimit: string
}

export interface SecurityPillarItem {
  id: string
  label: string
  status: 'SECURE' | 'ISOLATED' | 'ENFORCED' | 'DEGRADED'
  telemetry: string
  detail: string
  badgeVariant: 'success' | 'info' | 'warning' | 'error'
}

export interface DashboardAnalyticsPoint {
  time: string
  agentRuns: number
  throughputTokPerSec: number
}

export interface DashboardData {
  kpis: DashboardKPIs
  recentRuns: AgentRunItem[]
  modelActivity: ModelActivityItem[]
  securitySummary: SecurityPillarItem[]
  analytics: DashboardAnalyticsPoint[]
  isDevelopmentPlaceholder: boolean
  lastSyncedAt: string
}
