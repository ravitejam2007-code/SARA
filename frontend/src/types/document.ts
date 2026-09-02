/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * File & Document Management Domain Types
 */

export type DocumentType =
  | 'PDF'
  | 'DOCX'
  | 'XLSX'
  | 'PPTX'
  | 'PNG'
  | 'JPG'
  | 'TXT'
  | 'CSV'

export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type IndexedStatus = 'INDEXED' | 'NOT_INDEXED' | 'INDEXING' | 'FAILED'

export interface DocumentItem {
  id: string
  name: string
  type: DocumentType
  sizeBytes: number
  formattedSize: string
  uploadedBy: string
  uploadedAt: string
  processingStatus: ProcessingStatus
  processingProgress: number // 0 to 100
  indexedStatus: IndexedStatus
  checksumSha256: string
  pageCount?: number
  vectorCount?: number
  summary?: string
  extractedTextSnippet?: string
  mimeType?: string
}

export interface DocumentFilterParams {
  query?: string
  type?: DocumentType | 'ALL'
  status?: ProcessingStatus | 'ALL'
  dateRange?: 'ALL' | '24H' | '7D' | '30D'
  sortBy?: 'name' | 'sizeBytes' | 'uploadedAt' | 'processingStatus'
  sortOrder?: 'asc' | 'desc'
}
