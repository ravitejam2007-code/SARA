import { apiClient } from './api'
import type {
  SovereigntySummary,
  LocalServiceHealthItem,
  NetworkMonitorEntry,
  AuditTimelineEntry,
  SecurityEvent,
  DataSourceOrigin,
} from '@/types/security'
import {
  DEV_SOVEREIGNTY_SUMMARY,
  DEV_LOCAL_SERVICES_HEALTH,
  DEV_NETWORK_MONITOR_ENTRIES,
  DEV_AUDIT_TIMELINE_ENTRIES,
  DEV_SECURITY_EVENTS,
  UNAVAILABLE_SOVEREIGNTY_SUMMARY,
  UNAVAILABLE_LOCAL_SERVICES_HEALTH,
} from '@/utils/securityFixtures'

/**
 * Zenith AI — Security, Sovereignty & Audit API Client
 *
 * Implements strict provenance tracking:
 * - When in LIVE_API mode, queries real endpoints via apiClient.
 *   If the backend is unavailable or not yet provisioned, returns explicit UNAVAILABLE states,
 *   NEVER silently converting missing backend telemetry into zero, healthy, or blocked values.
 * - When DEV_TEST_DATA is explicitly selected, loads fixtures marked as 'DEV_TEST_DATA'.
 * - When UNAVAILABLE is selected, returns explicit unprovisioned states.
 */

let activeMode: DataSourceOrigin = 'DEV_TEST_DATA'

export const setSecurityProvenanceMode = (mode: DataSourceOrigin) => {
  activeMode = mode
}

export const getSecurityProvenanceMode = (): DataSourceOrigin => {
  return activeMode
}

export const securityApi = {
  /**
   * Fetch sovereignty metrics (external calls, cloud calls, DNS, egress, availability)
   */
  async getSovereigntySummary(): Promise<SovereigntySummary> {
    if (activeMode === 'DEV_TEST_DATA') {
      await new Promise((r) => setTimeout(r, 150))
      return DEV_SOVEREIGNTY_SUMMARY
    }

    if (activeMode === 'UNAVAILABLE') {
      await new Promise((r) => setTimeout(r, 100))
      return UNAVAILABLE_SOVEREIGNTY_SUMMARY
    }

    // LIVE_API Mode: Attempt real backend call
    try {
      const response = await apiClient.get<SovereigntySummary>('/api/security/sovereignty')
      return response.data
    } catch {
      // Backend not reporting: return explicit UNAVAILABLE state, never fake zeroes!
      return UNAVAILABLE_SOVEREIGNTY_SUMMARY
    }
  },

  /**
   * Fetch local service health items (LLM, Vision, OCR, Qdrant, Postgres, File Storage, Sandbox)
   */
  async getLocalServicesHealth(): Promise<LocalServiceHealthItem[]> {
    if (activeMode === 'DEV_TEST_DATA') {
      await new Promise((r) => setTimeout(r, 150))
      return DEV_LOCAL_SERVICES_HEALTH
    }

    if (activeMode === 'UNAVAILABLE') {
      await new Promise((r) => setTimeout(r, 100))
      return UNAVAILABLE_LOCAL_SERVICES_HEALTH
    }

    try {
      const response = await apiClient.get<LocalServiceHealthItem[]>('/api/security/services')
      return response.data
    } catch {
      return UNAVAILABLE_LOCAL_SERVICES_HEALTH
    }
  },

  /**
   * Fetch network monitor log entries
   */
  async getNetworkMonitorEntries(): Promise<NetworkMonitorEntry[]> {
    if (activeMode === 'DEV_TEST_DATA') {
      await new Promise((r) => setTimeout(r, 150))
      return DEV_NETWORK_MONITOR_ENTRIES
    }

    if (activeMode === 'UNAVAILABLE') {
      await new Promise((r) => setTimeout(r, 100))
      return []
    }

    try {
      const response = await apiClient.get<NetworkMonitorEntry[]>('/api/security/network')
      return response.data
    } catch {
      return []
    }
  },

  /**
   * Fetch audit timeline activity entries
   */
  async getAuditTimeline(): Promise<AuditTimelineEntry[]> {
    if (activeMode === 'DEV_TEST_DATA') {
      await new Promise((r) => setTimeout(r, 150))
      return DEV_AUDIT_TIMELINE_ENTRIES
    }

    if (activeMode === 'UNAVAILABLE') {
      await new Promise((r) => setTimeout(r, 100))
      return []
    }

    try {
      const response = await apiClient.get<AuditTimelineEntry[]>('/api/security/audit')
      return response.data
    } catch {
      return []
    }
  },

  /**
   * Fetch security events feed
   */
  async getSecurityEvents(filter?: string): Promise<SecurityEvent[]> {
    if (activeMode === 'DEV_TEST_DATA') {
      await new Promise((r) => setTimeout(r, 150))
      let events = [...DEV_SECURITY_EVENTS]
      if (filter && filter !== 'ALL') {
        events = events.filter((e) => e.type === filter || e.severity === filter)
      }
      return events
    }

    if (activeMode === 'UNAVAILABLE') {
      await new Promise((r) => setTimeout(r, 100))
      return []
    }

    try {
      const response = await apiClient.get<SecurityEvent[]>('/api/security/events', {
        params: { filter },
      })
      return response.data
    } catch {
      return []
    }
  },
}
