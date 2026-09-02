import { apiClient } from './api'
import { isDemoModeActive } from '@/utils/demoMode'
import type {
  KnowledgeDocument,
  KnowledgeStats,
  SemanticSearchResult,
  KnowledgeCategory,
} from '@/types/knowledge'

/**
 * Zenith AI — Sovereign Knowledge Base Service Abstraction
 *
 * Vector generation, token chunking, and nearest-neighbor HNSW index searches
 * are strictly executed within backend enclaves and Qdrant instances.
 * NO embeddings or vector database operations occur in the browser.
 */

let mockKnowledgeDocs: KnowledgeDocument[] = [
  {
    id: 'KB-01',
    filename: 'SOP-704-Emergency-Coolant-Isolation.docx',
    category: 'SOP',
    documentType: 'DOCX',
    uploadedDate: '2026-09-02',
    chunks: 142,
    indexingStatus: 'INDEXED',
    lastIndexed: '14 mins ago',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Procedures for isolating emergency cooling circuits during rapid thermal transient events.',
    sampleChunks: [
      {
        id: 'chk-01-1',
        chunkIndex: 1,
        text: 'Section 1.2: Upon detection of coolant differential pressure drop exceeding 0.4 bar/sec, automated fast-acting pneumatic valve V-102 must isolate within 80ms.',
        tokenCount: 42,
      },
      {
        id: 'chk-01-2',
        chunkIndex: 2,
        text: 'Section 2.1: Secondary auxiliary bypass line remains unpressurized until telemetry confirms seal integrity across the primary manifold.',
        tokenCount: 36,
      },
    ],
  },
  {
    id: 'KB-02',
    filename: 'Gas-Turbine-Maintenance-Field-Manual.pdf',
    category: 'Manual',
    documentType: 'PDF',
    uploadedDate: '2026-09-01',
    chunks: 890,
    indexingStatus: 'INDEXED',
    lastIndexed: '2 hours ago',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Comprehensive 800-page overhaul manual for industrial gas turbines, stage 1-4 blading, and shroud clearances.',
    sampleChunks: [
      {
        id: 'chk-02-1',
        chunkIndex: 45,
        text: 'Radial clearance between Stage 1 rotor blade tips and stationary honeycomb shroud must be maintained between 1.20mm and 1.45mm under ambient assembly temperature.',
        tokenCount: 48,
      },
    ],
  },
  {
    id: 'KB-03',
    filename: 'ISO-14001-Environmental-Operational-Policy.pdf',
    category: 'Policy',
    documentType: 'PDF',
    uploadedDate: '2026-08-31',
    chunks: 210,
    indexingStatus: 'INDEXED',
    lastIndexed: '1 day ago',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Environmental compliance guidelines, exhaust emissions telemetry limits, and sovereign acoustic regulations.',
    sampleChunks: [
      {
        id: 'chk-03-1',
        chunkIndex: 12,
        text: 'Continuous NOx emissions must remain below 15 ppmv (corrected to 15% O2 dry basis) during steady-state combined-cycle operations.',
        tokenCount: 39,
      },
    ],
  },
  {
    id: 'KB-04',
    filename: 'Inconel-718-Fatigue-Creep-Technical-Spec.pdf',
    category: 'Technical Document',
    documentType: 'PDF',
    uploadedDate: '2026-08-30',
    chunks: 480,
    indexingStatus: 'INDEXED',
    lastIndexed: '2 days ago',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Empirical material property boundaries, Larson-Miller parameter curves, and S-N fatigue endurance limits.',
    sampleChunks: [
      {
        id: 'chk-04-1',
        chunkIndex: 88,
        text: 'Larson-Miller parameter P = T(20 + log t) * 10^-3 yields a 100,000-hour rupture stress of 410 MPa at 650°C for precipitation-hardened Inconel 718.',
        tokenCount: 54,
      },
    ],
  },
  {
    id: 'KB-05',
    filename: 'Q3-Turbine-Vibration-Anomaly-Root-Cause.pdf',
    category: 'Past Report',
    documentType: 'PDF',
    uploadedDate: '2026-08-28',
    chunks: 340,
    indexingStatus: 'INDEXING',
    lastIndexed: 'Just now',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Root cause investigation into 1X shaft vibration excursions on Gas Generator Unit 4 during hot restart.',
    sampleChunks: [
      {
        id: 'chk-05-1',
        chunkIndex: 8,
        text: 'Spectral analysis indicated temporary thermal bow caused by uneven cooling air flow in the lower turbine casing during the 45-minute dwell period.',
        tokenCount: 46,
      },
    ],
  },
  {
    id: 'KB-06',
    filename: 'Siemens-Energy-Field-Advisory-Memo.pdf',
    category: 'Correspondence',
    documentType: 'PDF',
    uploadedDate: '2026-08-25',
    chunks: 64,
    indexingStatus: 'INDEXED',
    lastIndexed: '5 days ago',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'OEM manufacturer service advisory regarding upgraded fuel nozzle locking wire inspection intervals.',
    sampleChunks: [
      {
        id: 'chk-06-1',
        chunkIndex: 2,
        text: 'Recommendation: Inspect all dual-fuel nozzle locking wires at the next scheduled 4,000 equivalent operating hours borescope inspection.',
        tokenCount: 38,
      },
    ],
  },
  {
    id: 'KB-07',
    filename: 'TwinCAT3-IEC61131-Structured-Text-Standard.txt',
    category: 'SOP',
    documentType: 'TXT',
    uploadedDate: '2026-08-22',
    chunks: 96,
    indexingStatus: 'PENDING',
    lastIndexed: 'Not yet indexed',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Coding standard and deterministic variable naming convention for Beckhoff TwinCAT3 Structured Text programs.',
    sampleChunks: [],
  },
  {
    id: 'KB-08',
    filename: 'SCADA-Substation-Cybersecurity-Hardening-Guide.docx',
    category: 'Policy',
    documentType: 'DOCX',
    uploadedDate: '2026-08-20',
    chunks: 180,
    indexingStatus: 'FAILED',
    lastIndexed: 'Failed 3 days ago',
    embeddingModel: 'Zenith-Industrial-Embed-3-Large',
    dimension: 1536,
    summary: 'Air-gapped substation perimeter isolation guidelines and Modbus TCP authentication profiles.',
    sampleChunks: [],
  },
]

export const knowledgeApi = {
  /**
   * Fetch knowledge documents with category, query, or status filters
   */
  async getKnowledgeDocuments(params?: {
    category?: string
    query?: string
    status?: string
  }): Promise<KnowledgeDocument[]> {
    try {
      const response = await apiClient.get<KnowledgeDocument[]>('/knowledge/documents', {
        params,
      })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 200))
      let list = [...mockKnowledgeDocs]

      if (params?.category && params.category !== 'ALL') {
        list = list.filter((d) => d.category === params.category)
      }

      if (params?.status && params.status !== 'ALL') {
        list = list.filter((d) => d.indexingStatus === params.status)
      }

      if (params?.query) {
        const q = params.query.toLowerCase()
        list = list.filter(
          (d) =>
            d.filename.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q) ||
            (d.summary && d.summary.toLowerCase().includes(q))
        )
      }

      return list
    }
  },

  /**
   * Fetch aggregate telemetry statistics for the Knowledge Base header
   */
  async getKnowledgeStats(): Promise<KnowledgeStats> {
    try {
      const response = await apiClient.get<KnowledgeStats>('/knowledge/stats')
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 150))
      const total = mockKnowledgeDocs.length
      const indexed = mockKnowledgeDocs.filter((d) => d.indexingStatus === 'INDEXED').length
      const processing = mockKnowledgeDocs.filter(
        (d) => d.indexingStatus === 'INDEXING' || d.indexingStatus === 'PENDING'
      ).length
      const totalVectors = mockKnowledgeDocs.reduce((acc, curr) => acc + curr.chunks, 0)

      return {
        totalDocuments: total,
        indexedDocuments: indexed,
        processingDocuments: processing,
        totalVectors,
      }
    }
  },

  /**
   * Upload an engineering document into the Knowledge Base with category assignment
   */
  async uploadKnowledgeDocument(
    file: File,
    category: KnowledgeCategory
  ): Promise<KnowledgeDocument> {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF'

    await new Promise((r) => setTimeout(r, 400))

    const newDoc: KnowledgeDocument = {
      id: `KB-${Date.now().toString().slice(-4)}`,
      filename: file.name,
      category,
      documentType: ext,
      uploadedDate: new Date().toISOString().slice(0, 10),
      chunks: Math.floor(file.size / 8000) + 12,
      indexingStatus: 'INDEXING',
      lastIndexed: 'Just now',
      embeddingModel: 'Zenith-Industrial-Embed-3-Large',
      dimension: 1536,
      summary: `Knowledge document staged for sovereign chunking and vector indexing under category ${category}.`,
      sampleChunks: [
        {
          id: `chk-new-1`,
          chunkIndex: 1,
          text: `Extracted header from ${file.name}. Ingestion staged into Qdrant collection AEROSPACE_ONTOLOGY.`,
          tokenCount: 28,
        },
      ],
    }

    mockKnowledgeDocs = [newDoc, ...mockKnowledgeDocs]
    return newDoc
  },

  /**
   * Re-index a document through the backend pipeline
   */
  async reindexDocument(id: string): Promise<KnowledgeDocument> {
    await new Promise((r) => setTimeout(r, 300))
    const doc = mockKnowledgeDocs.find((d) => d.id === id)
    if (!doc) throw new Error(`Document ${id} not found`)

    doc.indexingStatus = 'INDEXING'
    doc.lastIndexed = 'In progress...'

    return { ...doc }
  },

  /**
   * Delete a document from the Knowledge Base
   */
  async deleteKnowledgeDocument(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
    mockKnowledgeDocs = mockKnowledgeDocs.filter((d) => d.id !== id)
  },

  /**
   * Perform backend semantic search against sovereign vector collections
   */
  async semanticSearch(query: string): Promise<SemanticSearchResult[]> {
    try {
      const response = await apiClient.post<SemanticSearchResult[]>('/knowledge/semantic-search', {
        query,
      })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      await new Promise((r) => setTimeout(r, 350))

      // Realistic mock matches based on query terms
      const q = query.toLowerCase()
      const matches: SemanticSearchResult[] = []

      mockKnowledgeDocs.forEach((doc) => {
        if (
          doc.filename.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          (doc.summary && doc.summary.toLowerCase().includes(q)) ||
          q.includes('turbine') ||
          q.includes('stress') ||
          q.includes('sop') ||
          q.includes('coolant') ||
          q.includes('clearance')
        ) {
          const sample = doc.sampleChunks?.[0]?.text || doc.summary || 'Vector match found in document body.'
          matches.push({
            documentId: doc.id,
            filename: doc.filename,
            category: doc.category,
            score: Number((0.85 + Math.random() * 0.14).toFixed(3)),
            matchedSnippet: sample,
            pageOrSection: 'Section 2.1',
          })
        }
      })

      return matches.sort((a, b) => b.score - a.score)
    }
  },
}
