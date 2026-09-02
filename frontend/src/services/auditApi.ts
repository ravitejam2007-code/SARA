import { apiClient } from './api'
import { isDemoModeActive } from '@/utils/demoMode'
import type { AuditLogEntry } from '@/types'

/**
 * Zenith AI — Sovereign Audit API Module
 *
 * Interfaces with FastAPI /audit endpoints with demo fallback when enabled.
 */

const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8812',
    timestamp: '2026-09-02 16:29:10 UTC',
    actor: 'Ravi (Chief Eng)',
    action: 'DISPATCH_INFERENCE_PIPELINE',
    targetResource: 'CLUSTER-ALPHA // TURBINE-SPEC-04',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipOrInterface: 'mTLS-NODE-LOCAL-01',
  },
  {
    id: 'LOG-8811',
    timestamp: '2026-09-02 15:42:01 UTC',
    actor: 'SYSTEM_DAEMON_TPM',
    action: 'HARDWARE_ATTESTATION_HEARTBEAT',
    targetResource: 'INTEL-SGX2-CORE-ARRAY',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    ipOrInterface: 'HW-BUS-INTERNAL',
  },
  {
    id: 'LOG-8810',
    timestamp: '2026-09-02 14:18:22 UTC',
    actor: 'Kai Chen',
    action: 'INGEST_PROPRIETARY_STEP_FILE',
    targetResource: 'DOC-8021 // HYDRAULICS_REV4',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: '7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b',
    ipOrInterface: 'mTLS-NODE-LOCAL-02',
  },
  {
    id: 'LOG-8809',
    timestamp: '2026-09-02 12:00:00 UTC',
    actor: 'AIR_GAP_MONITOR',
    action: 'EGRESS_VERIFICATION_CHECK',
    targetResource: 'NETWORK_BOUNDARY_AIR01',
    enclaveId: 'ENCLAVE-TITAN-X8',
    status: 'VERIFIED',
    sha256Hash: '4b5c6d7e8f90123456789abcdef0123456789abcdef0a1b2c3d4e5f60718293a',
    ipOrInterface: 'ISOLATION-CONTROLLER',
  },
]

export const auditApi = {
  /**
   * Fetch cryptographic audit log ledger records
   */
  async getAuditLogs(params?: { search?: string; status?: string }): Promise<AuditLogEntry[]> {
    try {
      const response = await apiClient.get<AuditLogEntry[]>('/audit/logs', { params })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 150))
      let logs = [...DEMO_AUDIT_LOGS]
      if (params?.search) {
        const q = params.search.toLowerCase()
        logs = logs.filter(
          (l) =>
            l.actor.toLowerCase().includes(q) ||
            l.action.toLowerCase().includes(q) ||
            l.targetResource.toLowerCase().includes(q) ||
            l.sha256Hash.toLowerCase().includes(q)
        )
      }
      return logs
    }
  },

  /**
   * Export signed audit manifest in WORM format
   */
  async exportAuditManifest(): Promise<Blob> {
    try {
      const response = await apiClient.get('/audit/export', { responseType: 'blob' })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 200))
      return new Blob([JSON.stringify(DEMO_AUDIT_LOGS, null, 2)], {
        type: 'application/json',
      })
    }
  },

  /**
   * Verify cryptographic integrity of an individual log record
   */
  async verifyLogIntegrity(logId: string): Promise<{ verified: boolean; attestationSeal: string }> {
    try {
      const response = await apiClient.post(`/audit/logs/${logId}/verify`)
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 100))
      return {
        verified: true,
        attestationSeal: `TPM_PCR_VALIDATED_${Date.now().toString(36)}`,
      }
    }
  },
}
