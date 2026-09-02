import React from 'react'
import {
  Database,
  Search,
  Plus,
  Network,
  HardDrive,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

const collections = [
  {
    name: 'AEROSPACE-TURBINE-ONTOLOGY',
    type: 'Domain Vector Store',
    dimensions: '1,536 (Float32)',
    vectorsCount: '482,910',
    indexType: 'HNSW / Cosine',
    memory: '3.8 GB',
    status: 'OPTIMIZED',
  },
  {
    name: 'METALLURGY-FATIGUE-DATABASE',
    type: 'Scientific Graph DB',
    dimensions: '3,072 (Float16)',
    vectorsCount: '1,290,400',
    indexType: 'IVFPQ-48',
    memory: '7.2 GB',
    status: 'OPTIMIZED',
  },
  {
    name: 'SCADA-TELEMETRY-ANOMALIES',
    type: 'Time-Series Embedding',
    dimensions: '768 (Int8 Quantized)',
    vectorsCount: '5,810,000',
    indexType: 'Flat / L2',
    memory: '4.4 GB',
    status: 'INDEXING',
  },
  {
    name: 'SAFETY-INTERLOCK-RULES-ISO',
    type: 'Deterministic Rule Graph',
    dimensions: '512 (Binary)',
    vectorsCount: '42,100',
    indexType: 'Radix Trie',
    memory: '410 MB',
    status: 'OPTIMIZED',
  },
]

export const KnowledgeBase: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              SOVEREIGN KNOWLEDGE BASE & ONTOLOGIES
            </h1>
            <Badge variant="cyan" size="sm" dot>
              LOCAL VECTOR ENGINE
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Proprietary domain embeddings, semantic graphs, and air-gapped vector stores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            NEW VECTOR COLLECTION
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div className="font-mono">
            <div className="text-xs text-slate-400 uppercase">Total Vectors</div>
            <div className="text-lg font-bold text-slate-100">7,625,410</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
            <Network className="w-5 h-5" />
          </div>
          <div className="font-mono">
            <div className="text-xs text-slate-400 uppercase">Ontology Triples</div>
            <div className="text-lg font-bold text-slate-100">1,940,812</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-amber-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="font-mono">
            <div className="text-xs text-slate-400 uppercase">Enclave RAM Allocated</div>
            <div className="text-lg font-bold text-slate-100">15.8 GB / 64 GB</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <Input
          placeholder="Search collections or ontology schemas..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Vector Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((c) => (
          <Card key={c.name} hoverEffect>
            <CardHeader>
              <div>
                <CardTitle className="text-cyan-300">{c.name}</CardTitle>
                <CardDescription>{c.type}</CardDescription>
              </div>
              <Badge variant={c.status === 'OPTIMIZED' ? 'emerald' : 'amber'} size="sm">
                {c.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">DIMENSIONS</span>
                  <span className="text-slate-200 font-semibold">{c.dimensions}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">TOTAL VECTORS</span>
                  <span className="text-slate-200 font-semibold">{c.vectorsCount}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">INDEX STRUCTURE</span>
                  <span className="text-slate-200 font-semibold">{c.indexType}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">ENCLAVE FOOTPRINT</span>
                  <span className="text-slate-200 font-semibold">{c.memory}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default KnowledgeBase
