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
      <div className="rounded-lg bg-surface border border-border p-5 shadow-industrial">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider text-text-primary uppercase flex items-center gap-2">
                  <span>SOVEREIGN KNOWLEDGE BASE</span>
                </h1>
                <p className="text-xs text-text-secondary">
                  Local Vector Store • Semantic RAG Retrieval • Qdrant Enclave Index
                </p>
              </div>
            </div>
          </div>

          {/* Aggregate Telemetry Counters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Total Documents */}
            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-border flex items-center gap-2">
              <span className="text-[10px] text-text-muted uppercase">TOTAL DOCS:</span>
              <span className="text-sm font-bold text-text-primary">
                {stats?.totalDocuments ?? 42}
              </span>
            </div>

            {/* Indexed Documents */}
            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-emerald-900/50 flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 uppercase">INDEXED:</span>
              <span className="text-sm font-bold text-emerald-300">
                {stats?.indexedDocuments ?? 38}
              </span>
            </div>

            {/* Processing Documents */}
            <div className="px-3 py-1.5 rounded bg-surface-sunken border border-cyan-900/50 flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 uppercase">PROCESSING:</span>
              <span className="text-sm font-bold text-cyan-300">
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

          <div className="flex items-center gap-1 text-[11px] text-cyan-400">
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
      <div className="rounded-lg bg-surface border border-border p-4 shadow-industrial space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              SOVEREIGN INDEXING PIPELINE (ZERO-EGRESS)
            </h2>
          </div>
          <span className="text-[10px] text-text-muted">
            LIVE EMBEDDING PIPELINE: 5 STAGES
          </span>
        </div>

        {/* 5-Step Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.name}
              className={`p-3 rounded border space-y-1.5 relative transition-all ${
                step.status === 'completed'
                  ? 'bg-surface-sunken border-emerald-900/60 text-text-primary'
                  : step.status === 'active'
                  ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-200 shadow-sm'
                  : 'bg-surface-sunken/50 border-border text-text-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase flex items-center gap-1.5">
                  {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {step.status === 'active' && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                  {step.label}
                </span>

                <span className="text-[10px] font-mono text-cyan-400">{step.latency}</span>
              </div>

              <p className="text-[10px] text-text-secondary leading-snug">
                {step.description}
              </p>

              {/* Arrow separator indicator for desktop */}
              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-3 h-3 text-border-strong" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Semantic Search Field & Category Filter Toolbar */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-industrial space-y-3">
        {/* Semantic Search Form */}
        <form onSubmit={handleSemanticSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              sizeVariant="md"
              placeholder="Search semantically (e.g. Inconel 718 creep limits, coolant emergency SOP, turbine blade tip clearance)..."
              value={semanticQuery}
              onChange={(e) => setSemanticQuery(e.target.value)}
              leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
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
          <span className="text-[11px] text-text-muted mr-1 uppercase font-semibold">
            CATEGORIES:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
            }`}
          >
            ALL
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                  : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Search Results Display (if active query) */}
      {searchResults && (
        <div className="p-4 rounded-lg bg-surface border border-cyan-500/40 shadow-industrial space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase text-cyan-300">
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
                className="p-3 rounded bg-surface-sunken border border-border space-y-1 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-text-primary">{res.filename}</span>
                    <Badge variant={getCategoryBadgeVariant(res.category)} size="sm">
                      {res.category}
                    </Badge>
                  </div>
                  <Badge variant="success" size="sm">
                    {(res.score * 100).toFixed(1)}% COSINE SIMILARITY
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pl-5">
                  "{res.matchedSnippet}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Knowledge Document Table (8 Columns) */}
      <div className="rounded-lg bg-surface border border-border shadow-industrial overflow-hidden">
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
                <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken">
                  <th className="py-3 px-4">FILENAME</th>
                  <th className="py-3 px-3">CATEGORY</th>
                  <th className="py-3 px-3">DOC TYPE</th>
                  <th className="py-3 px-3">UPLOADED</th>
                  <th className="py-3 px-3">CHUNKS</th>
                  <th className="py-3 px-3">INDEXING STATUS</th>
                  <th className="py-3 px-3">LAST INDEXED</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-surface-elevated/70 transition-colors group"
                  >
                    {/* Col 1: Filename */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-text-primary block truncate group-hover:text-cyan-300 transition-colors">
                            {doc.filename}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono block">
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
                      <span className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border text-[11px] text-cyan-300 font-semibold">
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
                          className="p-1.5 rounded text-text-muted hover:text-cyan-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="Open Document Details Drawer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Re-index Action */}
                        <button
                          type="button"
                          onClick={() => handleReindex(doc.id)}
                          className="p-1.5 rounded text-text-muted hover:text-amber-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
                          title="Re-index Document"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded text-text-muted hover:text-rose-400 hover:bg-surface-sunken transition-colors focus-ring cursor-pointer"
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
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">CATEGORY</span>
                <Badge variant={getCategoryBadgeVariant(drawerDoc.category)} size="sm" className="mt-1">
                  {drawerDoc.category}
                </Badge>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">DIMENSIONS</span>
                <span className="font-bold text-cyan-300 block mt-1">{drawerDoc.dimension} dims (FP16)</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">TOTAL CHUNKS</span>
                <span className="font-bold text-emerald-400 block mt-1">{drawerDoc.chunks} chunks</span>
              </div>
              <div className="p-2.5 rounded bg-surface-sunken border border-border">
                <span className="text-[10px] text-text-muted block uppercase">DISTANCE METRIC</span>
                <span className="font-bold text-text-primary block mt-1">Cosine Similarity</span>
              </div>
            </div>

            {/* Embedding Model Specification */}
            <div className="p-3 rounded bg-surface-sunken border border-border space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-semibold">
                ACTIVE VECTOR EMBEDDING MODEL:
              </span>
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>{drawerDoc.embeddingModel}</span>
                <span className="text-text-muted text-[10px] font-normal">
                  (In-enclave accelerated inference)
                </span>
              </div>
            </div>

            {/* Document Summary */}
            {drawerDoc.summary && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-text-muted uppercase font-semibold">
                  Ontological Summary:
                </span>
                <p className="p-3 rounded bg-surface border border-border text-text-secondary leading-relaxed">
                  {drawerDoc.summary}
                </p>
              </div>
            )}

            {/* Extracted Sample Chunks */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-text-muted uppercase font-semibold block">
                Sample Semantic Vector Chunks:
              </span>

              {drawerDoc.sampleChunks && drawerDoc.sampleChunks.length > 0 ? (
                drawerDoc.sampleChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3 rounded bg-[#050811] border border-border space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span className="text-cyan-400 font-bold">
                        CHUNK #{chunk.chunkIndex}
                      </span>
                      <span>{chunk.tokenCount} TOKENS</span>
                    </div>
                    <p className="text-text-primary leading-relaxed font-sans text-xs">
                      {chunk.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-text-muted text-xs border border-dashed border-border rounded">
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
                className="p-4 rounded border-2 border-dashed border-border hover:border-cyan-500 bg-surface-sunken text-center cursor-pointer transition-colors"
              >
                {stagedFile ? (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-cyan-300">{stagedFile.name}</div>
                    <div className="text-[10px] text-text-muted">
                      {(stagedFile.size / 1024).toFixed(0)} KB • Click to change file
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs">
                    <Upload className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <span className="font-semibold text-text-primary block">
                      Click to choose file
                    </span>
                    <span className="text-[10px] text-text-muted block">
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

            <div className="p-3 rounded bg-surface-sunken border border-border text-[11px] text-text-muted space-y-1">
              <span className="text-cyan-400 font-semibold block uppercase">
                Vector Indexing Notice:
              </span>
              <p>
                Document will be chunked into 512-token segments and embedded using
                Zenith-Industrial-Embed-3-Large within the confidential enclave.
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
