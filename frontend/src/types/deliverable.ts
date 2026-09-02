/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Deliverables & Artifact Domain Types
 */

export type DeliverableType =
  | 'DOCX'
  | 'XLSX'
  | 'PPTX'
  | 'PDF'
  | 'ZIP'
  | 'CODE'

export type VerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'UNVERIFIED' | 'REJECTED'

export interface DeliverableItem {
  id: string
  filename: string
  fileType: DeliverableType
  workflow: string
  workflowId: string
  generatedBy: string
  createdDate: string
  sizeBytes: number
  formattedSize: string
  verificationStatus: VerificationStatus
  checksumSha256: string
  hsmAttestation: string
  previewContent?: string
  auditTrailId: string
}

export interface DeliverableFilterParams {
  query?: string
  type?: DeliverableType | 'ALL'
  workflow?: string | 'ALL'
  dateRange?: 'ALL' | '24H' | '7D' | '30D'
  status?: VerificationStatus | 'ALL'
  sortBy?: 'filename' | 'createdDate' | 'sizeBytes' | 'verificationStatus'
  sortOrder?: 'asc' | 'desc'
}

export interface DeliverableAuditTrail {
  id: string
  deliverableId: string
  filename: string
  timestamp: string
  actor: string
  enclaveId: string
  hsmSignature: string
  checksumSha256: string
  verificationResult: 'FIPS 140-3 PASS' | 'PENDING' | 'INVALID'
  ledgerBlock: string
  policyVersion: string
}
