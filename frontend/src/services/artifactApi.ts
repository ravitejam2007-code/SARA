import { apiClient } from './api'
import { deliverableApi } from './deliverableApi'
import { isDemoModeActive } from '@/utils/demoMode'
import type {
  DeliverableItem,
  DeliverableFilterParams,
  DeliverableAuditTrail,
} from '@/types/deliverable'

/**
 * Zenith AI — Sovereign Artifact API Module
 *
 * Interfaces with FastAPI /artifacts endpoints with demo fallback when enabled.
 */

export const artifactApi = {
  /**
   * Fetch all certified deliverables and generated artifacts
   */
  async getArtifacts(params?: DeliverableFilterParams): Promise<DeliverableItem[]> {
    try {
      const response = await apiClient.get<DeliverableItem[]>('/artifacts', { params })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      return deliverableApi.getDeliverables(params)
    }
  },

  /**
   * Fetch a single artifact by unique ID
   */
  async getArtifactById(id: string): Promise<DeliverableItem> {
    try {
      const response = await apiClient.get<DeliverableItem>(`/artifacts/${id}`)
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      const all = await deliverableApi.getDeliverables()
      const found = all.find((a) => a.id === id)
      if (!found) throw new Error(`Artifact ${id} not found`)
      return found
    }
  },

  /**
   * Rename an existing artifact
   */
  async renameArtifact(id: string, newName: string): Promise<DeliverableItem> {
    try {
      const response = await apiClient.put<DeliverableItem>(`/artifacts/${id}/rename`, { newName })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      return deliverableApi.renameDeliverable(id, newName)
    }
  },

  /**
   * Delete an artifact from sovereign storage
   */
  async deleteArtifact(id: string): Promise<void> {
    try {
      await apiClient.delete(`/artifacts/${id}`)
    } catch (err) {
      if (!isDemoModeActive()) throw err
      return deliverableApi.deleteDeliverable(id)
    }
  },

  /**
   * Download binary stream of certified deliverable
   */
  async downloadArtifact(id: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/artifacts/${id}/download`, {
        responseType: 'blob',
      })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      return deliverableApi.downloadDeliverable(id)
    }
  },

  /**
   * Fetch cryptographic hardware audit trail
   */
  async getAuditTrail(id: string): Promise<DeliverableAuditTrail> {
    try {
      const response = await apiClient.get<DeliverableAuditTrail>(`/artifacts/${id}/audit-trail`)
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      return deliverableApi.getAuditTrail(id)
    }
  },
}
