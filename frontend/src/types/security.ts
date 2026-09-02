/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Security, Sovereignty & Audit Domain Types
 */

export type DataSourceOrigin =
  | 'LIVE_API'
  | 'DEV_TEST_DATA'
  | 'UNAVAILABLE'

export interface SecurityMetric<T = number> {
  value: T | null
  origin: DataSourceOrigin
  note?: string
  lastUpdated?: string
}

export interface SovereigntySummary {
  externalApiCalls: SecurityMetric<number>
  cloudModelCalls: SecurityMetric<number>
  externalDnsRequests: SecurityMetric<number>
  networkEgressBytes: {
    bytes: number | null
    formatted: string
    origin: DataSourceOrigin
    note?: string
    lastUpdated?: string
  }
  localServiceAvailabilityPercent: SecurityMetric<number>
}

export type LocalServiceStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'UNAVAILABLE'
  | 'MAINTENANCE'

export interface LocalServiceHealthItem {
  id: string
  name: string
  status: LocalServiceStatus
  latencyMs: number | null
  uptime: string | null
  memoryVram: string | null
  version: string | null
  dataOrigin: DataSourceOrigin
}

export type NetworkRequestType =
  | 'LOCAL_IPC'
  | 'BLOCKED_EGRESS'
  | 'INTERNAL_RPC'

export type NetworkRequestStatus =
  | 'ALLOWED'
  | 'BLOCKED_BY_AIRGAP'
  | 'VERIFIED'

export interface NetworkMonitorEntry {
  id: string
  timestamp: string
  service: string
  requestType: NetworkRequestType
  targetEndpoint: string
  status: NetworkRequestStatus
  protocol: string
  dataOrigin: DataSourceOrigin
}

export type AuditStatus =
  | 'CONFIRMED'
  | 'BLOCKED'
  | 'FLAGGED'

export interface AuditTimelineEntry {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  model: string
  tool: string
  status: AuditStatus
  checksumSha256?: string
  dataOrigin?: DataSourceOrigin
}

export type SecurityEventType =
  | 'WARNING'
  | 'BLOCKED_REQUEST'
  | 'AUTH_EVENT'
  | 'FILE_ACCESS'

export type SecuritySeverity =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFO'

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: SecuritySeverity
  title: string
  detail: string
  timestamp: string
  dataOrigin: DataSourceOrigin
}
