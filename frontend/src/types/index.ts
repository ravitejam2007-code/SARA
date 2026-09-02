/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Core TypeScript Definitions
 */

export type EnclaveSecurityState = 'SECURE' | 'DEGRADED' | 'AIR_GAPPED' | 'ISOLATED' | 'MAINTENANCE'

export type UserRole = 'Engineer' | 'Manager' | 'Admin' | 'Auditor'

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
  username: string
  name: string
  email: string
  callsign: string
  role: UserRole
  clearanceLevel: string
  terminalId: string
  sessionExpiresAt?: string
}

export interface AuthCredentials {
  username: string
  password: string
}

export interface NavigationItem {
  name: string
  path: string
  icon: string
  badge?: string
  badgeVariant?: 'default' | 'emerald' | 'amber' | 'cyan'
  description?: string
  allowedRoles?: UserRole[]
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
