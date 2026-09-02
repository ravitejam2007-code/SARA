/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Knowledge Base Domain Types
 */

export type KnowledgeCategory =
  | 'SOP'
  | 'Manual'
  | 'Policy'
  | 'Technical Document'
  | 'Past Report'
  | 'Correspondence'

export type IndexingStatus = 'INDEXED' | 'INDEXING' | 'PENDING' | 'FAILED'

export type IndexingPipelineStepName = 'Upload' | 'Extract' | 'Chunk' | 'Embed' | 'Index'

export interface IndexingPipelineStep {
  name: IndexingPipelineStepName
  label: string
  description: string
  status: 'completed' | 'active' | 'pending'
  latency: string
}

export interface ChunkItem {
  id: string
  chunkIndex: number
  text: string
  tokenCount: number
  similarityScore?: number
}

export interface KnowledgeDocument {
  id: string
  filename: string
  category: KnowledgeCategory
  documentType: string
  uploadedDate: string
  chunks: number
  indexingStatus: IndexingStatus
  lastIndexed: string
  embeddingModel: string
  dimension: number
  sampleChunks?: ChunkItem[]
  summary?: string
}

export interface KnowledgeStats {
  totalDocuments: number
  indexedDocuments: number
  processingDocuments: number
  totalVectors: number
}

export interface SemanticSearchResult {
  documentId: string
  filename: string
  category: KnowledgeCategory
  score: number // e.g. 0.984
  matchedSnippet: string
  pageOrSection: string
}
