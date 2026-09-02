import React from 'react'
import {
  Play,
  Clock,
  RotateCw,
  Cpu,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface WorkflowPipeline {
  id: string
  name: string
  trigger: 'CRON (02:00 UTC)' | 'ON_CAD_INGEST' | 'CONTINUOUS_TELEMETRY' | 'MANUAL'
  stepsCount: number
  lastRun: string
  status: 'RUNNING' | 'COMPLETED' | 'STANDBY' | 'FAILED'
  assignedEnclave: string
  duration: string
}

const pipelines: WorkflowPipeline[] = [
  {
    id: 'WF-PIPE-01',
    name: 'High-Temperature Blade Fatigue Simulation',
    trigger: 'ON_CAD_INGEST',
    stepsCount: 5,
    lastRun: '14 mins ago',
    status: 'RUNNING',
    assignedEnclave: 'CLUSTER-ALPHA // NODE-04',
    duration: '04m 12s',
  },
  {
    id: 'WF-PIPE-02',
    name: 'PLC IEC 61131-3 Static Safety Analysis & Linting',
    trigger: 'MANUAL',
    stepsCount: 4,
    lastRun: '1 hour ago',
    status: 'COMPLETED',
    assignedEnclave: 'CLUSTER-ALPHA // NODE-01',
    duration: '01m 45s',
  },
  {
    id: 'WF-PIPE-03',
    name: 'Real-Time SCADA Telemetry Anomaly Inference',
    trigger: 'CONTINUOUS_TELEMETRY',
    stepsCount: 3,
    lastRun: 'Continuous',
    status: 'RUNNING',
    assignedEnclave: 'CLUSTER-ALPHA // NODE-02',
    duration: 'Live',
  },
  {
    id: 'WF-PIPE-04',
    name: 'Cryptographic Air-Gap Hash Attestation & Ledger Seal',
    trigger: 'CRON (02:00 UTC)',
    stepsCount: 6,
    lastRun: 'Yesterday 02:00',
    status: 'COMPLETED',
    assignedEnclave: 'HSM-TITAN-ENCLAVE',
    duration: '00m 34s',
  },
]

export const Workflows: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              WORKFLOW & PIPELINE ORCHESTRATION
            </h1>
            <Badge variant="cyan" size="sm" dot>
              AIR-GAPPED RUNNERS
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Automated execution pipelines for engineering validation, simulation, and deterministic model passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-4 h-4" />}
          >
            DISPATCH PIPELINE
          </Button>
        </div>
      </div>

      {/* Pipeline List */}
      <div className="space-y-4">
        {pipelines.map((p) => (
          <Card key={p.id} hoverEffect className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    {p.id}
                  </span>
                  <h3 className="font-mono text-sm font-semibold text-slate-100">
                    {p.name}
                  </h3>
                  <Badge
                    variant={
                      p.status === 'RUNNING'
                        ? 'cyan'
                        : p.status === 'COMPLETED'
                        ? 'emerald'
                        : 'amber'
                    }
                    size="sm"
                    dot={p.status === 'RUNNING'}
                  >
                    {p.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    TRIGGER: <span className="text-slate-300">{p.trigger}</span>
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    RUNNER: <span className="text-slate-300">{p.assignedEnclave}</span>
                  </span>
                  <span className="text-slate-700">|</span>
                  <span>
                    STEPS: <span className="text-slate-300">{p.stepsCount} STAGES</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block font-mono text-xs">
                  <div className="text-slate-400 text-[11px]">LAST RUN</div>
                  <div className="text-slate-200">{p.lastRun}</div>
                </div>

                <Button variant="outline" size="sm" leftIcon={<RotateCw className="w-3.5 h-3.5" />}>
                  TRIGGER
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Workflows
