/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Core TypeScript Definitions
 */

export type EnclaveSecurityState = 'SECURE' | 'DEGRADED' | 'AIR_GAPPED' | 'ISOLATED' | 'MAINTENANCE'

export interface SovereignEnclaveStatus {
  enclaveId: string
  airGapVerified: boolean
  securityState: EnclaveSecurityState
  hsmAttestation: string
  cryptographicIntegrity: number // percentage e.g. 100.0
  activeNodes: number
  fipsLevel: string
  lastHeartbeat: string
}

export interface UserProfile {
  id: string
  callsign: string
  name: string
  email: string
  role: 'SOVEREIGN_ADMIN' | 'CHIEF_ENGINEER' | 'OPERATIONS_ANALYST' | 'AUDIT_OBSERVER'
  clearanceLevel: 'LEVEL-4 (TOP SECRET / RESTRICTED)' | 'LEVEL-3 (CONFIDENTIAL)' | 'LEVEL-2 (INTERNAL)'
  terminalId: string
  sessionExpiresAt: string
}

export interface NavigationItem {
  name: string
  path: string
  icon: string
  badge?: string
  badgeVariant?: 'default' | 'emerald' | 'amber' | 'cyan'
  description?: string
}

export interface TelemetryMetric {
  timestamp: string
  inferenceRate: number // tokens / sec or ops / sec
  clusterLoad: number // percentage
  memoryUsage: number // percentage
  temperatureC: number
  activePipelines: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  targetResource: string
  enclaveId: string
  status: 'VERIFIED' | 'FLAGGED' | 'BLOCKED' | 'PENDING'
  sha256Hash: string
  ipOrInterface: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  timestamp: string
  requestId: string
  enclaveAttestation?: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
  requestId: string
}
