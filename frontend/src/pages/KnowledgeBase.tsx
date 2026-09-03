import React, { useState, useEffect, useRef } from 'react'
import {
  Database,
  Upload,
  Search,
  Sparkles,
  BookOpen,
  FileText,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'

import { knowledgeApi } from '@/services/knowledgeApi'
import type {
  KnowledgeDocument,
  KnowledgeStats,
  KnowledgeCategory,
  IndexingStatus,
  SemanticSearchResult,
  IndexingPipelineStep,
} from '@/types/knowledge'

export const KnowledgeBase: React.FC = () => {
  const { toast } = useToast()

  // State Management
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [stats, setStats] = useState<KnowledgeStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Semantic Search
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [semanticQuery, setSemanticQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[] | null>(null)

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<KnowledgeCategory>('Technical Document')
  const [stagedFile, setStagedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Document Details Drawer / Modal State
  const [drawerDoc, setDrawerDoc] = useState<KnowledgeDocument | null>(null)
  const [docToDelete, setDocToDelete] = useState<KnowledgeDocument | null>(null)

  // Indexing Pipeline Definition (Visual representation of Upload -> Extract -> Chunk -> Embed -> Index)
  const pipelineSteps: IndexingPipelineStep[] = [
    {
      name: 'Upload',
      label: '1. Ingest',
      description: 'Sovereign binary stream staging & sha256 attestation',
      status: 'completed',
      latency: '40ms',
    },
    {
      name: 'Extract',
      label: '2. Extract',
      description: 'OCR & layout-aware markdown normalization',
      status: 'completed',
      latency: '240ms',
    },
    {
      name: 'Chunk',
      label: '3. Chunk',
      description: 'Semantic overlapping window (512 tokens / 64 overlap)',
      status: 'completed',
      latency: '110ms',
    },
    {
      name: 'Embed',
      label: '4. Embed',
      description: 'Zenith-Embed-3-Large (1536-dim FP16 hardware vectorizer)',
      status: 'active',
      latency: '320ms',
    },
    {
      name: 'Index',
      label: '5. Index',
      description: 'Qdrant HNSW graph insertion with metadata payload',
      status: 'pending',
      latency: '80ms',
    },
  ]

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [docs, teleStats] = await Promise.all([
        knowledgeApi.getKnowledgeDocuments({
          category: selectedCategory,
        }),
        knowledgeApi.getKnowledgeStats(),
      ])
      setDocuments(docs)
      setStats(teleStats)
    } catch {
      setError('Unable to synchronize with sovereign vector knowledge cluster.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedCategory])

  // Handle Semantic Search Execution
  const handleSemanticSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!semanticQuery.trim()) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)
    try {
      const results = await knowledgeApi.semanticSearch(semanticQuery.trim())
      setSearchResults(results)
      toast.info(
        'Semantic Search Executed',
        `Retrieved ${results.length} cosine similarity match(es) from Qdrant vector store.`
      )
    } catch {
      toast.error('Search Failed', 'Vector similarity search failed.')
    } finally {
      setIsSearching(false)
    }
  }

  // Handle Upload Knowledge Document
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stagedFile) {
      toast.error('File Required', 'Please select an engineering document to upload.')
      return
    }

    try {
      const newDoc = await knowledgeApi.uploadKnowledgeDocument(stagedFile, uploadCategory)
      setDocuments((prev) => [newDoc, ...prev])
      setIsUploadOpen(false)
      setStagedFile(null)
      toast.success(
        'Knowledge Document Ingested',
        `${newDoc.filename} staged for vector indexing under ${uploadCategory}.`
      )

      // Refresh aggregate stats
      const updatedStats = await knowledgeApi.getKnowledgeStats()
      setStats(updatedStats)
    } catch {
      toast.error('Ingestion Failed', 'Enclave rejected document.')
    }
  }

  // Handle Re-index
  const handleReindex = async (id: string) => {
    try {
      const updated = await knowledgeApi.reindexDocument(id)
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)))
      toast.info('Re-indexing Dispatched', `Generating updated vector embeddings for ${updated.filename}.`)

      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, indexingStatus: 'INDEXED', lastIndexed: 'Just now' }
              : d
          )
        )
        toast.success('Indexing Completed', `${updated.filename} indexed with updated vectors.`)
      }, 1800)
    } catch {
      toast.error('Re-index Error', 'Failed to dispatch re-indexing.')
    }
  }

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!docToDelete) return
    try {
      await knowledgeApi.deleteKnowledgeDocument(docToDelete.id)
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id))
      toast.info('Document Removed', `${docToDelete.filename} purged from vector index.`)
      setDocToDelete(null)
      const updatedStats = await knowledgeApi.getKnowledgeStats()
      setStats(updatedStats)
    } catch {
      toast.error('Delete Error', 'Could not delete knowledge document.')
    }
  }

  // Categories list
  const categoriesList: KnowledgeCategory[] = [
    'SOP',
    'Manual',
    'Policy',
    'Technical Document',
    'Past Report',
    'Correspondence',
  ]

  // Category Badge Colors
  const getCategoryBadgeVariant = (
    cat: KnowledgeCategory
  ): 'default' | 'info' | 'success' | 'warning' | 'error' => {
    switch (cat) {
      case 'SOP':
        return 'warning'
      case 'Manual':
        return 'info'
      case 'Policy':
        return 'default'
      case 'Technical Document':
        return 'info'
      case 'Past Report':
        return 'success'
      case 'Correspondence':
        return 'default'
    }
  }

  const getStatusBadgeVariant = (status: IndexingStatus) => {
    switch (status) {
      case 'INDEXED':
        return 'success'
      case 'INDEXING':
        return 'info'
      case 'PENDING':
        return 'warning'
      case 'FAILED':
        return 'error'
    }
  }

  return (
    <div className="space-y-6 font-mono text-text-primary pb-8">
      {/* 1. Header Section with Metrics */}
      <div className="rounded-[12px] bg-white border border-[#ebebeb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-[#171717] flex items-center gap-2">
                  <span>SOVEREIGN KNOWLEDGE BASE</span>
                </h1>
                <p className="text-xs text-[#8f8f8f]">
                  Local Vector Store • Semantic RAG Retrieval • Qdrant Enclave Index
                </p>
              </div>
            </div>
          </div>

          {/* Aggregate Telemetry Counters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Total Documents */}
            <div className="px-3 py-1.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center gap-2">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-bold">TOTAL DOCS:</span>
              <span className="text-sm font-bold text-[#171717]">
                {stats?.totalDocuments ?? 42}
              </span>
            </div>

            {/* Indexed Documents */}
            <div className="px-3 py-1.5 rounded-[6px] bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <span className="text-[10px] text-emerald-800 uppercase font-bold">INDEXED:</span>
              <span className="text-sm font-bold text-emerald-700">
                {stats?.indexedDocuments ?? 38}
              </span>
            </div>

            {/* Processing Documents */}
            <div className="px-3 py-1.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center gap-2">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-bold">PROCESSING:</span>
              <span className="text-sm font-bold text-[#171717]">
                {stats?.processingDocuments ?? 4}
              </span>
            </div>

            {/* Primary Action: Upload Knowledge Document */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              Upload Document
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400 font-semibold">
              SERVICE ABSTRACTION
            </span>
            <span>All vectorization and nearest-neighbor search operate strictly backend-side via knowledgeApi.ts.</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>QDRANT ON-PREMISE HNSW</span>
          </div>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Vector Cluster Link Interrupted"
          code="ERR_QDRANT_ENCLAVE_DISCONNECTED"
          description={error}
          onRetry={loadData}
        />
      )}

      {/* 2. Visual Indexing Pipeline (Upload -> Extract -> Chunk -> Embed -> Index) */}
      <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#171717]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
              SOVEREIGN INDEXING PIPELINE (ZERO-EGRESS)
            </h2>
          </div>
          <span className="text-[10px] text-[#8f8f8f]">
            LIVE EMBEDDING PIPELINE: 5 STAGES
          </span>
        </div>

        {/* 5-Step Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.name}
              className={`p-3 rounded-[6px] border space-y-1.5 relative transition-all ${
                step.status === 'completed'
                  ? 'bg-emerald-50/50 border-emerald-200 text-[#171717]'
                  : step.status === 'active'
                  ? 'bg-[#f5f5f5] border-[#171717] text-[#171717] shadow-sm'
                  : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase flex items-center gap-1.5">
                  {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {step.status === 'active' && (
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                  {step.label}
                </span>

                <span className="text-[10px] font-mono text-[#8f8f8f]">{step.latency}</span>
              </div>

              <p className="text-[10px] text-[#4d4d4d] leading-snug">
                {step.description}
              </p>

              {/* Arrow separator indicator for desktop */}
              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-3 h-3 text-[#d4d4d4]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Semantic Search Field & Category Filter Toolbar */}
      <div className="p-4 rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
        {/* Semantic Search Form */}
        <form onSubmit={handleSemanticSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              sizeVariant="md"
              placeholder="Search semantically (e.g. Inconel 718 creep limits, coolant emergency SOP, turbine blade tip clearance)..."
              value={semanticQuery}
              onChange={(e) => setSemanticQuery(e.target.value)}
              leftIcon={<Sparkles className="w-4 h-4 text-[#171717]" />}
              clearable
              onClear={() => {
                setSemanticQuery('')
                setSearchResults(null)
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSearching}
            leftIcon={<Search className="w-4 h-4" />}
          >
            Semantic Query
          </Button>
        </form>

        {/* Category Filter Pills (6 Categories) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] text-[#8f8f8f] mr-1 uppercase font-semibold">
            CATEGORIES:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-[6px] border text-[11px] font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#171717] border-[#171717] text-white'
                : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
            }`}
          >
            ALL
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-[6px] border text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#171717] border-[#171717] text-white'
                  : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Search Results Display (if active query) */}
      {searchResults && (
        <div className="p-4 rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#171717]" />
              <span className="text-xs font-semibold uppercase text-[#171717]">
                SEMANTIC VECTOR SEARCH RESULTS ({searchResults.length} MATCHES)
              </span>
            </div>
            <button
              onClick={() => {
                setSearchResults(null)
                setSemanticQuery('')
              }}
              className="text-[11px] text-text-muted hover:text-text-primary underline"
            >
              Clear Results
            </button>
          </div>

          <div className="space-y-2">
            {searchResults.map((res, i) => (
              <div
                key={i}
                className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-1 hover:border-[#d4d4d4] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#171717]" />
                    <span className="text-xs font-bold text-[#171717]">{res.filename}</span>
                    <Badge variant={getCategoryBadgeVariant(res.category)} size="sm">
                      {res.category}
                    </Badge>
                  </div>
                  <Badge variant="success" size="sm">
                    {(res.score * 100).toFixed(1)}% COSINE SIMILARITY
                  </Badge>
                </div>
                <p className="text-xs text-[#4d4d4d] leading-relaxed pl-5 font-sans">
                  "{res.matchedSnippet}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Knowledge Document Table (8 Columns) */}
      <div className="rounded-[10px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={45} />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Knowledge Documents Found"
              description="No documents matched the active category filter."
              action={
                <Button
                  size="sm"
                  onClick={() => setIsUploadOpen(true)}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Upload Knowledge Document
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ebebeb] text-[#8f8f8f] text-[11px] bg-[#fafafa]">
                  <th className="py-3 px-4 font-semibold">FILENAME</th>
                  <th className="py-3 px-3 font-semibold">CATEGORY</th>
                  <th className="py-3 px-3 font-semibold">DOC TYPE</th>
                  <th className="py-3 px-3 font-semibold">UPLOADED</th>
                  <th className="py-3 px-3 font-semibold">CHUNKS</th>
                  <th className="py-3 px-3 font-semibold">INDEXING STATUS</th>
                  <th className="py-3 px-3 font-semibold">LAST INDEXED</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#fafafa] transition-colors group"
                  >
                    {/* Col 1: Filename */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#171717] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-[#171717] block truncate group-hover:text-[#0070f3] transition-colors cursor-pointer" onClick={() => setDrawerDoc(doc)}>
                            {doc.filename}
                          </span>
                          <span className="text-[10px] text-[#8f8f8f] font-mono block">
                            ID: {doc.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge variant={getCategoryBadgeVariant(doc.category)} size="sm">
                        {doc.category}
                      </Badge>
                    </td>

                    {/* Col 3: Document Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-[#fafafa] border border-[#ebebeb] text-[11px] text-[#171717] font-semibold">
                        {doc.documentType}
                      </span>
                    </td>

                    {/* Col 4: Uploaded Date */}
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {doc.uploadedDate}
                    </td>

                    {/* Col 5: Chunks */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-text-primary font-bold">{doc.chunks}</span>
                      <span className="text-text-muted ml-1 text-[10px]">vectors</span>
                    </td>

                    {/* Col 6: Indexing Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge
                        variant={getStatusBadgeVariant(doc.indexingStatus)}
                        size="sm"
                        dot={doc.indexingStatus === 'INDEXING'}
                      >
                        {doc.indexingStatus}
                      </Badge>
                    </td>

                    {/* Col 7: Last Indexed */}
                    <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.lastIndexed}
                      </span>
                    </td>

                    {/* Col 8: Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inspect Action (Opens Details Drawer) */}
                        <button
                          type="button"
                          onClick={() => setDrawerDoc(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors focus-ring cursor-pointer"
                          title="Open Document Details Drawer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Re-index Action */}
                        <button
                          type="button"
                          onClick={() => handleReindex(doc.id)}
                          className="p-1.5 rounded text-text-muted hover:text-amber-700 hover:bg-[#f5f5f5] transition-colors focus-ring cursor-pointer"
                          title="Re-index Document"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-[#ee0000] hover:bg-red-50 transition-colors focus-ring cursor-pointer"
                          title="Delete from Knowledge Base"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= 5. DOCUMENT DETAILS DRAWER / MODAL ================= */}
      <Modal
        isOpen={!!drawerDoc}
        onClose={() => setDrawerDoc(null)}
        title={drawerDoc?.filename || 'Document Details'}
        description={`Vector Metadata & Semantic Chunks Inspection`}
        size="lg"
      >
        {drawerDoc && (
          <ModalBody className="space-y-4">
            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[10px] text-[#8f8f8f] block uppercase">CATEGORY</span>
                <Badge variant={getCategoryBadgeVariant(drawerDoc.category)} size="sm" className="mt-1">
                  {drawerDoc.category}
                </Badge>
              </div>
              <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[10px] text-[#8f8f8f] block uppercase">DIMENSIONS</span>
                <span className="font-bold text-[#171717] block mt-1">{drawerDoc.dimension} dims (FP16)</span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[10px] text-[#8f8f8f] block uppercase">TOTAL CHUNKS</span>
                <span className="font-bold text-emerald-700 block mt-1">{drawerDoc.chunks} chunks</span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[10px] text-[#8f8f8f] block uppercase">DISTANCE METRIC</span>
                <span className="font-bold text-[#171717] block mt-1">Cosine Similarity</span>
              </div>
            </div>

            {/* Embedding Model Specification */}
            <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-1">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-semibold">
                ACTIVE VECTOR EMBEDDING MODEL:
              </span>
              <div className="flex items-center gap-2 text-xs text-[#171717] font-bold">
                <Cpu className="w-4 h-4 text-[#171717]" />
                <span>{drawerDoc.embeddingModel}</span>
                <span className="text-[#8f8f8f] text-[10px] font-normal">
                  (In-enclave accelerated inference)
                </span>
              </div>
            </div>

            {/* Document Summary */}
            {drawerDoc.summary && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-[#8f8f8f] uppercase font-semibold">
                  Ontological Summary:
                </span>
                <p className="p-3 rounded-[6px] bg-white border border-[#ebebeb] text-[#4d4d4d] leading-relaxed font-sans">
                  {drawerDoc.summary}
                </p>
              </div>
            )}

            {/* Extracted Sample Chunks */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-semibold block">
                Sample Semantic Vector Chunks:
              </span>

              {drawerDoc.sampleChunks && drawerDoc.sampleChunks.length > 0 ? (
                drawerDoc.sampleChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#8f8f8f]">
                      <span className="text-[#171717] font-bold">
                        CHUNK #{chunk.chunkIndex}
                      </span>
                      <span>{chunk.tokenCount} TOKENS</span>
                    </div>
                    <p className="text-[#171717] leading-relaxed font-sans text-xs">
                      {chunk.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#8f8f8f] text-xs border border-dashed border-[#ebebeb] rounded-[6px]">
                  No sample chunks cached in local buffer.
                </div>
              )}
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setDrawerDoc(null)}>
            Close Drawer
          </Button>
          {drawerDoc && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                handleReindex(drawerDoc.id)
                setDrawerDoc(null)
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-index Vectors
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* ================= 6. UPLOAD KNOWLEDGE DOCUMENT MODAL ================= */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Knowledge Document"
        description="Ingest technical documentation into the sovereign vector index"
        size="md"
      >
        <form onSubmit={handleUploadSubmit}>
          <ModalBody className="space-y-4">
            {/* File Drop / Select Area */}
            <div>
              <span className="text-xs font-semibold text-text-primary block mb-1.5">
                Target Engineering Document:
              </span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setStagedFile(e.target.files[0])
                  }
                }}
                accept=".pdf,.docx,.xlsx,.txt,.xml,.csv"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-[8px] border border-dashed border-[#ebebeb] hover:border-[#171717] bg-[#fafafa] text-center cursor-pointer transition-colors"
              >
                {stagedFile ? (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#171717]">{stagedFile.name}</div>
                    <div className="text-[10px] text-[#8f8f8f]">
                      {(stagedFile.size / 1024).toFixed(0)} KB • Click to change file
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs">
                    <Upload className="w-5 h-5 text-[#171717] mx-auto mb-1" />
                    <span className="font-semibold text-[#171717] block">
                      Click to choose file
                    </span>
                    <span className="text-[10px] text-[#8f8f8f] block">
                      PDF, DOCX, XLSX, TXT, XML, or CSV
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Category Select (All 6 Categories) */}
            <div>
              <Select
                label="Knowledge Category"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as KnowledgeCategory)}
                options={categoriesList.map((cat) => ({
                  value: cat,
                  label: cat,
                }))}
              />
            </div>

            <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[11px] text-[#8f8f8f] space-y-1">
              <span className="text-[#171717] font-semibold block uppercase">
                Vector Indexing Notice:
              </span>
              <p>
                Document will be chunked into 512-token segments and embedded using
                SARA-Industrial-Embed within the confidential enclave.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" size="sm" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!stagedFile}>
              Ingest & Index
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* ================= 7. DELETE CONFIRMATION DIALOG ================= */}
      <Dialog
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Purge Knowledge Document"
        description={`Are you sure you want to permanently delete "${docToDelete?.filename}"? This will drop all associated vectors from the Qdrant index.`}
        variant="destructive"
        confirmText="Confirm Purge"
        cancelText="Cancel"
      />
    </div>
  )
}

export default KnowledgeBase
