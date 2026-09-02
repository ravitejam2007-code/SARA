import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  Cpu,
  FileText,
  GitBranch,
  Package,
  Radio,
  Search,
  Upload,
  Database,
  RefreshCw,
  Clock,
  Sparkles,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { useToast } from '@/components/ui/Toast'

import { fetchDashboardData } from '@/services/dashboardService'
import type { DashboardData, AgentRunStatus } from '@/types/dashboard'
import type { UserRole } from '@/types'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const { toast } = useToast()

  // State Management
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Interactive UI State Simulation Toggles
  const [simulatedState, setSimulatedState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal')

  const loadData = async (stateOverride?: 'normal' | 'loading' | 'empty' | 'error') => {
    const activeMode = stateOverride || simulatedState
    setIsLoading(true)
    setError(null)
    setErrorDetails(null)

    if (activeMode === 'loading') {
      return // Keep loading spinner active for inspection
    }

    try {
      const result = await fetchDashboardData({
        simulateError: activeMode === 'error',
        simulateEmpty: activeMode === 'empty',
      })
      setData(result)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Telemetry gateway unreachable'
      setError(errorMessage)
      setErrorDetails(
        `TRACE_ID: zn-dash-${Date.now()}\nTIMESTAMP: ${new Date().toISOString()}\nREASON: Simulated hardware enclave gateway timeout.\nCOMPONENT: ZenithDashboardService::fetchDashboardData`
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(simulatedState)
  }, [simulatedState])

  // Filtered Agent Runs
  const filteredRuns = useMemo(() => {
    if (!data?.recentRuns) return []
    return data.recentRuns.filter((run) => {
      const matchesSearch =
        run.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.model.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || run.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data?.recentRuns, searchQuery, statusFilter])

  // Dynamic user name for greeting
  const greetingName = user?.name || user?.username || 'Ravi'

  // Role Badge Styling
  const roleBadgeVariants: Record<UserRole, 'info' | 'success' | 'amber' | 'default'> = {
    Admin: 'info',
    Engineer: 'info',
    Manager: 'amber',
    Auditor: 'success',
  }

  const statusBadgeVariant = (status: AgentRunStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'RUNNING':
        return 'info'
      case 'QUEUED':
        return 'warning'
      case 'FAILED':
        return 'error'
    }
  }

  return (
    <div className="space-y-6 font-mono text-text-primary pb-8">
      {/* 1. Header Section */}
      <div className="rounded-lg bg-surface border border-border p-5 shadow-industrial">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Welcome Greeting */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-text-primary uppercase flex items-center gap-2">
                  <span>Welcome, {greetingName}</span>
                </h1>
                <p className="text-xs text-text-secondary">
                  Zenith AI — Sovereign On-Premise Industrial AI Control Center
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Metadata & System Security Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            {/* System Security Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-elevated border border-emerald-800/60 text-xs text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-bold tracking-wider uppercase">System Secure</span>
              <span className="text-border-strong">|</span>
              <span className="text-text-muted text-[10px]">AIR-GAPPED ENCLAVE</span>
            </div>

            {/* Current Role Badge */}
            {role && (
              <Badge variant={roleBadgeVariants[role]} size="md">
                ROLE: {role.toUpperCase()}
              </Badge>
            )}

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadData()
                toast.info('Telemetry Refreshed', 'Local model & node states re-synchronized.')
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              SYNC
            </Button>
          </div>
        </div>

        {/* Development Placeholder Notice & UI State Simulation Bar */}
        <div className="mt-4 pt-3 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-muted text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400 font-semibold">
              DEV MODE
            </span>
            <span>
              Telemetry utilizes development placeholders. Backend microservices remain authoritative.
            </span>
          </div>

          {/* UI State Controls for Review */}
          <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
            <span className="text-text-muted mr-1">SIMULATE STATE:</span>
            {(['normal', 'loading', 'empty', 'error'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSimulatedState(mode)}
                className={`px-2 py-0.5 rounded border uppercase font-medium transition-colors ${
                  simulatedState === mode
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                    : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Error State Banner */}
      {error && (
        <ErrorState
          title="Telemetry Ingestion Disrupted"
          code="ERR_ENCLAVE_GATEWAY_TIMEOUT"
          description={error}
          details={errorDetails || undefined}
          onRetry={() => {
            setSimulatedState('normal')
            loadData('normal')
          }}
          retryText="Re-establish Link"
        />
      )}

      {/* 2. 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Active Models */}
        <div className="rounded-md bg-surface border border-border p-4 shadow-industrial hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] uppercase font-semibold">Active Models</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text-primary">
                {data?.kpis.activeModels ?? 4}
              </span>
              <span className="text-xs text-text-muted">/ {data?.kpis.activeModelsTotal ?? 4}</span>
            </div>
          )}
          <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Local Enclave
          </div>
        </div>

        {/* KPI 2: Documents Processed */}
        <div className="rounded-md bg-surface border border-border p-4 shadow-industrial hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] uppercase font-semibold">Documents</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-text-primary">
              {data?.kpis.documentsProcessed ?? 37}
            </div>
          )}
          <div className="text-[10px] text-text-muted mt-2">STEP, CAD & Specs</div>
        </div>

        {/* KPI 3: Agent Runs */}
        <div className="rounded-md bg-surface border border-border p-4 shadow-industrial hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] uppercase font-semibold">Agent Runs</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-text-primary">
              {data?.kpis.agentRuns ?? 12}
            </div>
          )}
          <div className="text-[10px] text-cyan-400 mt-2">Completed Today</div>
        </div>

        {/* KPI 4: Generated Deliverables */}
        <div className="rounded-md bg-surface border border-border p-4 shadow-industrial hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] uppercase font-semibold">Deliverables</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-text-primary">
              {data?.kpis.generatedDeliverables ?? 8}
            </div>
          )}
          <div className="text-[10px] text-emerald-400 mt-2">Signed & Validated</div>
        </div>

        {/* KPI 5: External API Calls */}
        <div className="rounded-md bg-surface border border-border p-4 shadow-industrial hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] uppercase font-semibold">External Calls</span>
            <Radio className="w-4 h-4 text-text-muted" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-emerald-400">
              {data?.kpis.externalApiCalls ?? 0}
            </div>
          )}
          <div className="text-[10px] text-emerald-400 mt-2 font-semibold">
            0 B Egress / Air-Gapped
          </div>
        </div>

        {/* KPI 6: Local Services Status */}
        <div className="rounded-md bg-surface border border-border p-4 shadow-industrial hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-[11px] uppercase font-semibold">Local Services</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-base font-bold text-emerald-300">
              {data?.kpis.localServicesStatus ?? 'OPERATIONAL'}
            </div>
          )}
          <div className="text-[10px] text-text-muted mt-2">
            {data?.kpis.servicesHealthyCount ?? 5}/{data?.kpis.servicesTotalCount ?? 5} Services Healthy
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Bar */}
      <div className="p-3.5 rounded-lg bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-industrial">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">COMMAND SHORTCUTS:</span>
          <span className="text-text-muted hidden md:inline">Instant dispatch to sovereign engineering modules</span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/assistant')}
            leftIcon={<Cpu className="w-3.5 h-3.5" />}
          >
            Start AI Task
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/documents')}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Upload Document
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/knowledge-base')}
            leftIcon={<Database className="w-3.5 h-3.5" />}
          >
            Search Knowledge
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/workflows')}
            leftIcon={<GitBranch className="w-3.5 h-3.5" />}
          >
            Run Workflow
          </Button>
        </div>
      </div>

      {/* 4. Analytics Visualization & Security Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Analytics Visualization (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                HOURLY AGENT TASK EXECUTIONS & INFERENCE THROUGHPUT
              </CardTitle>
              <CardDescription>
                Air-gapped tokens processed per second vs. scheduled engineering task completions
              </CardDescription>
            </div>
            <Badge variant="info" size="sm">
              TELEMETRY: 24H
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex flex-col justify-center gap-2">
                <Skeleton variant="rectangular" height={220} />
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data?.analytics || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="dashboardThroughputGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    />
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
                      dataKey="throughputTokPerSec"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#dashboardThroughputGlow)"
                      name="Tokens/Sec"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Summary Matrix (1 col) */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                SECURITY SUMMARY (ON-PREMISE)
              </CardTitle>
              <CardDescription>
                Zero-trust sovereign posture enforcement
              </CardDescription>
            </div>
            <StatusBadge status="air-gapped" size="sm" />
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={45} />
              ))
            ) : (
              data?.securitySummary.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded bg-surface-sunken border border-border space-y-1 hover:border-border-strong transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">
                      {item.label}
                    </span>
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-semibold truncate">
                    {item.telemetry}
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {item.detail}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5. Model Activity Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wider text-text-primary uppercase">
              LOCAL MODEL ACTIVITY & COMPUTE LOAD
            </h2>
          </div>
          <span className="text-[11px] text-text-muted">
            DEDICATED FP8 TENSOR ENCLAVES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={130} />
            ))
          ) : (
            data?.modelActivity.map((model) => (
              <Card key={model.id} hoverEffect className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-cyan-300 truncate">
                      {model.name}
                    </h3>
                    <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
                      {model.capability}
                    </p>
                  </div>
                  <Badge
                    variant={model.status === 'INFERENCE' ? 'info' : 'success'}
                    size="sm"
                    dot
                  >
                    {model.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-secondary">Compute Load</span>
                    <span className="text-text-primary font-bold">{model.currentLoad}%</span>
                  </div>
                  <ProgressBar
                    value={model.currentLoad}
                    size="sm"
                    variant={model.currentLoad > 70 ? 'warning' : 'info'}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border/60">
                  <span>VRAM: {model.vramUsage}</span>
                  <span>CTX: {model.contextLimit}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 6. Recent Agent Runs Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                RECENT AGENT RUNS
              </CardTitle>
              <CardDescription>
                Autonomous engineering task executions & deterministic verifications
              </CardDescription>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              <div className="w-48 sm:w-64">
                <Input
                  sizeVariant="sm"
                  placeholder="Filter runs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-3.5 h-3.5" />}
                  clearable
                  onClear={() => setSearchQuery('')}
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="hidden md:flex items-center gap-1 text-[10px]">
                {(['ALL', 'COMPLETED', 'RUNNING', 'QUEUED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded border transition-colors ${
                      statusFilter === st
                        ? 'bg-surface-elevated border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-surface-sunken border-border text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={40} />
              ))}
            </div>
          ) : filteredRuns.length === 0 ? (
            <EmptyState
              title="No Agent Runs Found"
              description={
                searchQuery
                  ? 'No task runs match your search query filter.'
                  : 'No sovereign agent runs have been executed today. Launch an autonomous task to begin.'
              }
              action={
                <Button
                  size="sm"
                  onClick={() => navigate('/assistant')}
                  leftIcon={<Cpu className="w-3.5 h-3.5" />}
                >
                  Start New AI Task
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-text-secondary text-[11px] bg-surface-sunken/60">
                    <th className="py-2.5 px-3">TASK</th>
                    <th className="py-2.5 px-3">USER / OPERATOR</th>
                    <th className="py-2.5 px-3">MODEL</th>
                    <th className="py-2.5 px-3">DURATION</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRuns.map((run) => (
                    <tr
                      key={run.id}
                      onClick={() => toast.info(`Viewing Task Details`, run.task)}
                      className="hover:bg-surface-elevated/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-text-primary group-hover:text-cyan-300 transition-colors">
                          {run.task}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          ID: {run.id} {run.tokensProcessed ? `• ${run.tokensProcessed.toLocaleString()} tokens` : ''}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                        {run.user}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border text-cyan-300 text-[11px]">
                          {run.model}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {run.duration}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                        {run.timestamp}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Badge variant={statusBadgeVariant(run.status)} size="sm" dot>
                          {run.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
