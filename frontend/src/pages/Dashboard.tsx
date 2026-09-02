import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
  Server,
  FileText,
  GitBranch,
  ArrowUpRight,
  Database,
  Radio,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'

// Telemetry Time-Series Data for charts
const throughputData = [
  { time: '00:00', throughput: 3120, latency: 18 },
  { time: '04:00', throughput: 3450, latency: 16 },
  { time: '08:00', throughput: 4280, latency: 14 },
  { time: '12:00', throughput: 4890, latency: 15 },
  { time: '16:00', throughput: 4620, latency: 13 },
  { time: '20:00', throughput: 4310, latency: 14 },
  { time: 'Current', throughput: 4540, latency: 12 },
]

const clusterLoadData = [
  { node: 'Node-01 (SGX)', load: 68, memory: 74 },
  { node: 'Node-02 (SGX)', load: 82, memory: 89 },
  { node: 'Node-03 (HSM)', load: 45, memory: 52 },
  { node: 'Node-04 (GPU)', load: 91, memory: 94 },
]

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              INDUSTRIAL OPERATIONS CONSOLE
            </h1>
            <Badge variant="cyan" size="sm" dot>
              LIVE ENCLAVE
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time sovereign AI compute, air-gapped node telemetry, and pipeline throughput.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Activity className="w-4 h-4" />}
            onClick={() => navigate('/audit-logs')}
          >
            AUDIT LOGS
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Cpu className="w-4 h-4" />}
            onClick={() => navigate('/assistant')}
          >
            LAUNCH ASSISTANT
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Sovereign Nodes"
          value="08 / 08"
          unit="ONLINE"
          statusVariant="emerald"
          icon={<Server className="w-5 h-5 text-emerald-400" />}
          trend={{ value: '100% HEALTHY', positive: true }}
          caption="SGX2 Hardware Isolated"
        />

        <StatCard
          title="Inference Throughput"
          value="4,540"
          unit="TOKENS/SEC"
          statusVariant="cyan"
          icon={<Zap className="w-5 h-5 text-cyan-400" />}
          trend={{ value: '+14.2% vs avg', positive: true }}
          caption="FP8 Tensor Acceleration"
        />

        <StatCard
          title="Active Workflows"
          value="03"
          unit="RUNNING"
          statusVariant="amber"
          icon={<GitBranch className="w-5 h-5 text-amber-400" />}
          trend={{ value: '18 COMPLETED TODAY', positive: true }}
          caption="CAD Stress & Simulation"
        />

        <StatCard
          title="Cryptographic Integrity"
          value="100.0"
          unit="%"
          statusVariant="emerald"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          trend={{ value: 'NO DRIFT DETECTED', positive: true }}
          caption="SHA-256 Ledger Verified"
        />
      </div>

      {/* Primary Telemetry Visualizations (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inference Throughput Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                SOVEREIGN INFERENCE PIPELINE TELEMETRY
              </CardTitle>
              <CardDescription>
                Tokens processed per second across air-gapped tensor clusters
              </CardDescription>
            </div>
            <Badge variant="cyan" size="sm">
              SAMPLE: 24H
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="throughputGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="throughput"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#throughputGlow)"
                    name="Tokens/Sec"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Node Cluster Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                CLUSTER COMPUTE LOAD
              </CardTitle>
              <CardDescription>
                Hardware enclave utilization
              </CardDescription>
            </div>
            <StatusIndicator status="online" pulse />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterLoadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="node" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="load" fill="#06b6d4" name="Compute %" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="memory" fill="#334155" name="Memory %" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launchpad & Hardware Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Launchpad */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>WORKBENCH LAUNCHPAD</CardTitle>
            <CardDescription>Instant access to sovereign modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              {
                title: 'Industrial AI Assistant',
                desc: 'Chat with air-gapped domain models',
                path: '/assistant',
                icon: Cpu,
                color: 'text-cyan-400',
              },
              {
                title: 'Technical Documents',
                desc: 'Inspect parsed CAD specs and schematics',
                path: '/documents',
                icon: FileText,
                color: 'text-emerald-400',
              },
              {
                title: 'Ontology Knowledge Base',
                desc: 'Access sovereign vector databases',
                path: '/knowledge-base',
                icon: Database,
                color: 'text-blue-400',
              },
              {
                title: 'Engineering Workflows',
                desc: 'Review automated execution pipelines',
                path: '/workflows',
                icon: GitBranch,
                color: 'text-amber-400',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full text-left p-3 rounded bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Live Hardware Enclave Telemetry Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  REAL-TIME HARDWARE ENCLAVE POSTURE
                </CardTitle>
                <CardDescription>
                  TPM 2.0 attestation verification & cryptographic heartbeat
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/security')}
              >
                SECURITY DETAILS
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2">NODE ID</th>
                    <th className="pb-2">HARDWARE CLASS</th>
                    <th className="pb-2">ATTESTATION</th>
                    <th className="pb-2">LATENCY</th>
                    <th className="pb-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {[
                    { id: 'NODE-ENCLAVE-01', type: 'Intel Xeon SGX2', hsm: 'VALIDATED', latency: '1.2ms', status: 'ACTIVE' },
                    { id: 'NODE-ENCLAVE-02', type: 'Intel Xeon SGX2', hsm: 'VALIDATED', latency: '1.4ms', status: 'ACTIVE' },
                    { id: 'NODE-ENCLAVE-03', type: 'AMD SEV-SNP Dedicated', hsm: 'VALIDATED', latency: '1.8ms', status: 'ACTIVE' },
                    { id: 'NODE-ACCEL-04', type: 'NVIDIA H100 Sovereign FP8', hsm: 'HARDENED', latency: '2.4ms', status: 'COMPUTE' },
                  ].map((node) => (
                    <tr key={node.id} className="hover:bg-slate-900/60">
                      <td className="py-2.5 text-cyan-300 font-semibold">{node.id}</td>
                      <td className="py-2.5 text-slate-300">{node.type}</td>
                      <td className="py-2.5">
                        <Badge variant="emerald" size="sm">
                          {node.hsm}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-slate-400">{node.latency}</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {node.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
