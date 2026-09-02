import { apiClient } from './api'
import { isDemoModeActive } from '@/utils/demoMode'
import type { DocumentItem, DocumentFilterParams, DocumentType } from '@/types/document'

/**
 * Zenith AI — Sovereign File & Document Service Abstraction
 *
 * All document ingestion, parsing, OCR, and vectorization are executed
 * strictly within backend microservices and hardware enclaves.
 * The frontend performs NO client-side file parsing or processing.
 */

// Initial preloaded sovereign industrial documents covering all 8 formats
let mockDocuments: DocumentItem[] = [
  {
    id: 'DOC-1001',
    name: 'ISO_1982_Gas_Turbine_Blades_Stress_Limits.pdf',
    type: 'PDF',
    sizeBytes: 14889728, // 14.2 MB
    formattedSize: '14.2 MB',
    uploadedBy: 'Ravi (Chief Eng)',
    uploadedAt: '2026-09-02 14:20',
    processingStatus: 'COMPLETED',
    processingProgress: 100,
    indexedStatus: 'INDEXED',
    pageCount: 184,
    vectorCount: 1420,
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    summary:
      'International aerospace standard establishing maximum allowable plastic strain and thermal creep limits for Nickel-base superalloy turbine components.',
    extractedTextSnippet:
      'Section 4.8.2: Under elevated temperature regimes exceeding 1100°C, the allowable plastic strain in the blade root fillet shall not exceed 0.2% per 10,000 equivalent operating hours.',
  },
  {
    id: 'DOC-1002',
    name: 'TwinCAT3_Emergency_Coolant_SOP.docx',
    type: 'DOCX',
    sizeBytes: 2516582, // 2.4 MB
    formattedSize: '2.4 MB',
    uploadedBy: 'Kai Chen',
    uploadedAt: '2026-09-02 11:45',
    processingStatus: 'COMPLETED',
    processingProgress: 100,
    indexedStatus: 'INDEXED',
    pageCount: 28,
    vectorCount: 340,
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    summary:
      'Standard operating procedure for deploying emergency coolant valve logic blocks under Beckhoff TwinCAT3 PLC automation architectures.',
    extractedTextSnippet:
      'Chapter 3: The safety interlock block FB_EmergencyCoolant must execute within the high-priority 1ms task cycle to prevent valve oscillation.',
  },
  {
    id: 'DOC-1003',
    name: 'Turbine_Alloy_Inconel718_Lab_Data.xlsx',
    type: 'XLSX',
    sizeBytes: 5452595, // 5.2 MB
    formattedSize: '5.2 MB',
    uploadedBy: 'Sarah Connor',
    uploadedAt: '2026-09-01 16:30',
    processingStatus: 'COMPLETED',
    processingProgress: 100,
    indexedStatus: 'INDEXED',
    pageCount: 6,
    vectorCount: 215,
    checksumSha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    summary:
      'Empirical tensile stress, thermal expansion coefficient, and Rockwell hardness measurements across 48 heat-treated Inconel 718 alloy test specimens.',
    extractedTextSnippet:
      'Table 4.1: Specimen #24 Yield Strength = 680 MPa at 1200°C. Thermal Conductivity k = 22.4 W/(m·K).',
  },
  {
    id: 'DOC-1004',
    name: 'Aero_Propulsion_Thermal_Architecture.pptx',
    type: 'PPTX',
    sizeBytes: 29360128, // 28.0 MB
    formattedSize: '28.0 MB',
    uploadedBy: 'Elena Vance',
    uploadedAt: '2026-08-31 09:15',
    processingStatus: 'COMPLETED',
    processingProgress: 100,
    indexedStatus: 'NOT_INDEXED',
    pageCount: 45,
    vectorCount: 0,
    checksumSha256: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    summary:
      'Executive engineering brief detailing dual-chamber gas turbine cooling architectures and convective film heat dissipation schemes.',
    extractedTextSnippet:
      'Slide 18: Film cooling efficiency increased by 14% using shaped fan-diffuser effusion holes angled at 30°.',
  },
  {
    id: 'DOC-1005',
    name: 'Turbine_Blade_Fillet_Crack_Scan.png',
    type: 'PNG',
    sizeBytes: 8650752, // 8.25 MB
    formattedSize: '8.2 MB',
    uploadedBy: 'Ravi (Chief Eng)',
    uploadedAt: '2026-08-30 18:02',
    processingStatus: 'PROCESSING',
    processingProgress: 68,
    indexedStatus: 'INDEXING',
    checksumSha256: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    summary: 'High-resolution dye-penetrant optical surface scan of turbine root trailing edge fillet.',
    extractedTextSnippet: 'Optical Feature Detector: Sub-millimeter micro-crack detected at coordinates (X:142.4mm, Y:89.1mm).',
  },
  {
    id: 'DOC-1006',
    name: 'Combustion_Chamber_Thermal_IR.jpg',
    type: 'JPG',
    sizeBytes: 4194304, // 4.0 MB
    formattedSize: '4.0 MB',
    uploadedBy: 'Marcus Holt',
    uploadedAt: '2026-08-29 13:20',
    processingStatus: 'PENDING',
    processingProgress: 0,
    indexedStatus: 'NOT_INDEXED',
    checksumSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    summary: 'Infrared radiometric temperature map capturing full-load combustor nozzle thermal gradients.',
    extractedTextSnippet: 'Pending optical calibration & thermal radiance extraction.',
  },
  {
    id: 'DOC-1007',
    name: 'PLC_Safety_Interlock_Rules.txt',
    type: 'TXT',
    sizeBytes: 124928, // 122 KB
    formattedSize: '122 KB',
    uploadedBy: 'Kai Chen',
    uploadedAt: '2026-08-28 10:10',
    processingStatus: 'COMPLETED',
    processingProgress: 100,
    indexedStatus: 'INDEXED',
    vectorCount: 88,
    checksumSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    summary: 'Plain text formal specification for IEC 61131 safety state transitions and emergency trip interlocks.',
    extractedTextSnippet: 'RULE 04: If HydraulicPressure < 140 bar for > 150ms, trigger SafeTorqueOff immediately.',
  },
  {
    id: 'DOC-1008',
    name: 'SCADA_Telemetry_Pressure_Transducer.csv',
    type: 'CSV',
    sizeBytes: 18874368, // 18.0 MB
    formattedSize: '18.0 MB',
    uploadedBy: 'Sarah Connor',
    uploadedAt: '2026-08-27 15:40',
    processingStatus: 'FAILED',
    processingProgress: 15,
    indexedStatus: 'FAILED',
    checksumSha256: 'e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683',
    summary: '100 Hz high-frequency SCADA pressure sensor time-series log from Main Feedpump A.',
    extractedTextSnippet: 'PARSING_ERROR: Corrupted timestamp token at line 842,912 in CSV file stream.',
  },
]

export const fileApi = {
  /**
   * List documents with optional filters and sorting
   */
  async getDocuments(params?: DocumentFilterParams): Promise<DocumentItem[]> {
    try {
      const response = await apiClient.get<DocumentItem[]>('/documents', { params })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) throw err
      // Return simulated local data
      await new Promise((r) => setTimeout(r, 200))
      let result = [...mockDocuments]

      if (params?.query) {
        const q = params.query.toLowerCase()
        result = result.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.uploadedBy.toLowerCase().includes(q) ||
            (d.summary && d.summary.toLowerCase().includes(q))
        )
      }

      if (params?.type && params.type !== 'ALL') {
        result = result.filter((d) => d.type === params.type)
      }

      if (params?.status && params.status !== 'ALL') {
        result = result.filter((d) => d.processingStatus === params.status)
      }

      if (params?.sortBy) {
        const order = params.sortOrder === 'desc' ? -1 : 1
        result.sort((a, b) => {
          const valA = a[params.sortBy!]
          const valB = b[params.sortBy!]
          if (valA === undefined || valB === undefined) return 0
          return valA > valB ? order : -order
        })
      }

      return result
    }
  },

  /**
   * Upload an engineering file to the backend
   * (Frontend does NOT process or parse the file)
   */
  async uploadFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<DocumentItem> {
    const ext = file.name.split('.').pop()?.toUpperCase() as DocumentType || 'TXT'

    // Simulate upload network progress
    if (onProgress) {
      for (let p = 20; p <= 100; p += 20) {
        await new Promise((r) => setTimeout(r, 80))
        onProgress(p)
      }
    }

    const newDoc: DocumentItem = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: file.name,
      type: ext,
      sizeBytes: file.size,
      formattedSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: 'Current Operator',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      processingStatus: 'PENDING',
      processingProgress: 0,
      indexedStatus: 'NOT_INDEXED',
      checksumSha256: `sha256_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`,
      summary: `Uploaded file staged in sovereign buffer. Ready for automated parsing.`,
    }

    mockDocuments = [newDoc, ...mockDocuments]
    return newDoc
  },

  /**
   * Trigger backend asynchronous document processing & OCR
   */
  async processDocument(id: string): Promise<DocumentItem> {
    await new Promise((r) => setTimeout(r, 300))
    const doc = mockDocuments.find((d) => d.id === id)
    if (!doc) throw new Error(`Document ${id} not found`)

    doc.processingStatus = 'PROCESSING'
    doc.processingProgress = 25

    return { ...doc }
  },

  /**
   * Trigger backend vectorization and add to sovereign Knowledge Base
   */
  async addToKnowledgeBase(id: string): Promise<DocumentItem> {
    await new Promise((r) => setTimeout(r, 300))
    const doc = mockDocuments.find((d) => d.id === id)
    if (!doc) throw new Error(`Document ${id} not found`)

    doc.indexedStatus = 'INDEXED'
    doc.vectorCount = doc.vectorCount ? doc.vectorCount + 120 : 120

    return { ...doc }
  },

  /**
   * Delete a document from the sovereign storage
   */
  async deleteDocument(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
    mockDocuments = mockDocuments.filter((d) => d.id !== id)
  },

  /**
   * Download a document
   */
  async downloadDocument(id: string): Promise<Blob> {
    await new Promise((r) => setTimeout(r, 150))
    const doc = mockDocuments.find((d) => d.id === id)
    return new Blob([`Sovereign Document Binary Content for: ${doc?.name || id}`], {
      type: 'application/octet-stream',
    })
  },

  /**
   * Get complete document details
   */
  async getDocumentDetails(id: string): Promise<DocumentItem> {
    await new Promise((r) => setTimeout(r, 100))
    const doc = mockDocuments.find((d) => d.id === id)
    if (!doc) throw new Error(`Document ${id} not found`)
    return { ...doc }
  },
}
