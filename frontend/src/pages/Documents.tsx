import React from 'react'
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileCheck,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

interface DocumentItem {
  id: string
  title: string
  format: 'PDF' | 'STEP-CAD' | 'ISO-SPEC' | 'PLC-XML'
  size: string
  checksum: string
  ingestedAt: string
  status: 'INDEXED' | 'PROCESSING' | 'QUEUED'
  classification: 'RESTRICTED' | 'PROPRIETARY' | 'CONFIDENTIAL'
}

const mockDocs: DocumentItem[] = [
  {
    id: 'DOC-8021',
    title: 'Turbine-Assembly-Hydraulics-Spec-Rev4.step',
    format: 'STEP-CAD',
    size: '148.2 MB',
    checksum: 'sha256:d8a9...41c2',
    ingestedAt: '2026-09-02 10:14 UTC',
    status: 'INDEXED',
    classification: 'RESTRICTED',
  },
  {
    id: 'DOC-8022',
    title: 'Thermal-Stress-Boundary-Conditions-ISO1982.pdf',
    format: 'ISO-SPEC',
    size: '12.4 MB',
    checksum: 'sha256:7b11...90f4',
    ingestedAt: '2026-09-02 08:32 UTC',
    status: 'INDEXED',
    classification: 'PROPRIETARY',
  },
  {
    id: 'DOC-8023',
    title: 'Siemens-S7-1500-Safety-Interlock-Logic.xml',
    format: 'PLC-XML',
    size: '4.8 MB',
    checksum: 'sha256:9c02...aa18',
    ingestedAt: '2026-09-02 04:19 UTC',
    status: 'INDEXED',
    classification: 'RESTRICTED',
  },
  {
    id: 'DOC-8024',
    title: 'Titanium-Alloy-Additive-Manufacturing-Cert.pdf',
    format: 'PDF',
    size: '28.6 MB',
    checksum: 'sha256:3e45...bc77',
    ingestedAt: '2026-09-01 19:45 UTC',
    status: 'PROCESSING',
    classification: 'CONFIDENTIAL',
  },
]

export const Documents: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              INDUSTRIAL DOCUMENT INTELLIGENCE
            </h1>
            <Badge variant="cyan" size="sm" dot>
              SOVEREIGN REPOSITORY
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Air-gapped ingestion of CAD models, hydraulic schematics, and proprietary manufacturing standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            INGEST SPECIFICATION
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search by doc ID, sha256 checksum, or title..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            FILTER FORMATS
          </Button>
          <div className="text-xs font-mono text-slate-500 pl-2 hidden lg:inline">
            TOTAL STORAGE: <span className="text-slate-300">194.0 MB</span> / 2.0 TB ISOLATED
          </div>
        </div>
      </div>

      {/* Documents Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                INGESTED TECHNICAL ASSETS
              </CardTitle>
              <CardDescription>
                Cryptographically hashed and indexed in local sovereign vector space
              </CardDescription>
            </div>
            <Badge variant="emerald" size="sm">
              4 TOTAL ASSETS
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3">DOCUMENT ID</th>
                  <th className="pb-3">TITLE / FILENAME</th>
                  <th className="pb-3">FORMAT</th>
                  <th className="pb-3">SIZE</th>
                  <th className="pb-3">CLASSIFICATION</th>
                  <th className="pb-3">CHECKSUM</th>
                  <th className="pb-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {mockDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 font-semibold text-cyan-300">{doc.id}</td>
                    <td className="py-3 text-slate-200 flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate max-w-xs">{doc.title}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                        {doc.format}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{doc.size}</td>
                    <td className="py-3">
                      <Badge
                        variant={doc.classification === 'RESTRICTED' ? 'amber' : 'default'}
                        size="sm"
                      >
                        {doc.classification}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px] font-mono">{doc.checksum}</td>
                    <td className="py-3 text-right">
                      {doc.status === 'INDEXED' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          INDEXED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          PARSING
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Documents
