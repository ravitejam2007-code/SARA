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
        `TRACE_ID: sara-dash-${Date.now()}\nTIMESTAMP: ${new Date().toISOString()}\nREASON: Simulated hardware enclave gateway timeout.\nCOMPONENT: SaraDashboardService::fetchDashboardData`
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

  const greetingName = user?.name || (role ? role.toUpperCase() : 'ENGINEER')

  // Role Badge Variant Mapper
  const roleBadgeVariants: Record<UserRole, 'info' | 'success' | 'warning' | 'default'> = {
    Admin: 'info',
    Manager: 'default',
    Engineer: 'success',
    Auditor: 'warning',
  }

  // Status Badge Mapper
  const getStatusBadgeVariant = (status: AgentRunStatus) => {
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
    <div className="space-y-6 text-[#171717] pb-8 font-sans">
      {/* 1. Header Section */}
      <div className="rounded-[10px] bg-white border border-[#ebebeb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Welcome Greeting */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-[6px] bg-[#171717] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] flex items-center gap-2 font-sans">
                  <span>Welcome, {greetingName}</span>
                </h1>
                <p className="text-xs text-[#8f8f8f]">
                  SARA AI — Sovereign On-Premise Industrial AI Control Center
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Metadata & System Security Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            {/* System Security Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="font-semibold tracking-wide uppercase">System Secure</span>
              <span className="text-emerald-300">|</span>
              <span className="text-emerald-700 text-[10px]">AIR-GAPPED ENCLAVE</span>
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
        <div className="mt-4 pt-3 border-t border-[#ebebeb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#8f8f8f] text-[11px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
              DEV MODE
            </span>
            <span>
              Telemetry utilizes development placeholders. Backend microservices remain authoritative.
            </span>
          </div>

          {/* UI State Controls for Review */}
          <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono">
            <span className="text-[#8f8f8f] mr-1 uppercase">SIMULATE:</span>
            {(['normal', 'loading', 'empty', 'error'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSimulatedState(mode)}
                className={`px-2 py-0.5 rounded-[4px] border uppercase font-medium transition-colors cursor-pointer ${
                  simulatedState === mode
                    ? 'bg-[#171717] border-[#171717] text-white'
                    : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
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
        <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between text-[#8f8f8f] mb-2 font-mono">
            <span className="text-[11px] uppercase font-semibold">Active Models</span>
            <Cpu className="w-4 h-4 text-[#171717]" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-[#171717]">
                {data?.kpis.activeModels ?? 4}
              </span>
              <span className="text-xs text-[#8f8f8f]">/ {data?.kpis.activeModelsTotal ?? 4}</span>
            </div>
          )}
          <div className="text-[10px] text-emerald-700 mt-2 flex items-center gap-1 font-mono font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Local Enclave
          </div>
        </div>

        {/* KPI 2: Documents Processed */}
        <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between text-[#8f8f8f] mb-2 font-mono">
            <span className="text-[11px] uppercase font-semibold">Documents</span>
            <FileText className="w-4 h-4 text-[#171717]" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-[#171717] font-mono">
              {data?.kpis.documentsProcessed ?? 37}
            </div>
          )}
          <div className="text-[10px] text-[#8f8f8f] mt-2 font-mono">STEP, CAD & Specs</div>
        </div>

        {/* KPI 3: Agent Runs */}
        <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between text-[#8f8f8f] mb-2 font-mono">
            <span className="text-[11px] uppercase font-semibold">Agent Runs</span>
            <Sparkles className="w-4 h-4 text-[#171717]" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-[#171717] font-mono">
              {data?.kpis.agentRuns ?? 12}
            </div>
          )}
          <div className="text-[10px] text-[#8f8f8f] mt-2 font-mono">Completed Today</div>
        </div>

        {/* KPI 4: Generated Deliverables */}
        <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between text-[#8f8f8f] mb-2 font-mono">
            <span className="text-[11px] uppercase font-semibold">Deliverables</span>
            <Package className="w-4 h-4 text-[#171717]" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-[#171717] font-mono">
              {data?.kpis.generatedDeliverables ?? 8}
            </div>
          )}
          <div className="text-[10px] text-emerald-700 mt-2 font-mono font-medium">Signed & Validated</div>
        </div>

        {/* KPI 5: External API Calls */}
        <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between text-[#8f8f8f] mb-2 font-mono">
            <span className="text-[11px] uppercase font-semibold">External Calls</span>
            <Radio className="w-4 h-4 text-[#8f8f8f]" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-2xl font-bold text-emerald-700 font-mono">
              {data?.kpis.externalApiCalls ?? 0}
            </div>
          )}
          <div className="text-[10px] text-emerald-700 mt-2 font-semibold font-mono">
            0 B Egress / Air-Gapped
          </div>
        </div>

        {/* KPI 6: Local Services Status */}
        <div className="rounded-[10px] bg-white border border-[#ebebeb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between text-[#8f8f8f] mb-2 font-mono">
            <span className="text-[11px] uppercase font-semibold">Local Services</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} />
          ) : (
            <div className="text-base font-bold text-emerald-700 font-mono">
              {data?.kpis.localServicesStatus ?? 'OPERATIONAL'}
            </div>
          )}
          <div className="text-[10px] text-[#8f8f8f] mt-2 font-mono">
            {data?.kpis.servicesHealthyCount ?? 5}/{data?.kpis.servicesTotalCount ?? 5} Healthy
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Bar */}
      <div className="p-3.5 rounded-[10px] bg-white border border-[#ebebeb] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 text-xs text-[#4d4d4d]">
          <span className="text-[#171717] font-semibold uppercase tracking-wider font-mono">COMMAND SHORTCUTS:</span>
          <span className="text-[#8f8f8f] hidden md:inline">Instant dispatch to sovereign engineering modules</span>
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
                <Activity className="w-4 h-4 text-[#171717]" />
                HOURLY AGENT TASK EXECUTIONS & INFERENCE THROUGHPUT
              </CardTitle>
              <CardDescription>
                Air-gapped tokens processed per second vs. scheduled engineering task completions
              </CardDescription>
            </div>
            <Badge variant="default" size="sm">
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
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#171717" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" />
                    <XAxis
                      dataKey="time"
                      stroke="#8f8f8f"
                      tick={{ fontSize: 11, fontFamily: 'Geist Mono, monospace' }}
                    />
                    <YAxis
                      stroke="#8f8f8f"
                      tick={{ fontSize: 11, fontFamily: 'Geist Mono, monospace' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #ebebeb',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: '12px',
                        color: '#171717',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="throughputTokPerSec"
                      stroke="#171717"
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
                <Lock className="w-4 h-4 text-[#171717]" />
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
                  className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] space-y-1 hover:border-[#d4d4d4] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#171717]">
                      {item.label}
                    </span>
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-[#171717] font-semibold truncate font-mono">
                    {item.telemetry}
                  </div>
                  <div className="text-[10px] text-[#8f8f8f] truncate font-mono">
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
            <Cpu className="w-4 h-4 text-[#171717]" />
            <h2 className="text-sm font-semibold tracking-tight text-[#171717] uppercase font-sans">
              LOCAL MODEL ACTIVITY & COMPUTE LOAD
            </h2>
          </div>
          <span className="text-[11px] text-[#8f8f8f] font-mono">
            DEDICATED SMALL OPEN-WEIGHT LOCAL RUNTIMES
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
                    <h3 className="text-xs font-bold text-[#171717] truncate font-sans">
                      {model.name}
                    </h3>
                    <p className="text-[10px] text-[#8f8f8f] mt-0.5 line-clamp-1 font-mono">
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
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#4d4d4d]">Compute Load</span>
                    <span className="text-[#171717] font-bold">{model.currentLoad}%</span>
                  </div>
                  <ProgressBar
                    value={model.currentLoad}
                    size="sm"
                    variant={model.currentLoad > 70 ? 'warning' : 'info'}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8f8f8f] pt-2 border-t border-[#ebebeb] font-mono">
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
                <Sparkles className="w-4 h-4 text-[#171717]" />
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
              <div className="hidden md:flex items-center gap-1 text-[10px] font-mono">
                {(['ALL', 'COMPLETED', 'RUNNING', 'QUEUED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded-[4px] border transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#171717] border-[#171717] text-white font-bold'
                        : 'bg-[#fafafa] border-[#ebebeb] text-[#8f8f8f] hover:text-[#171717]'
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
            <div className="overflow-x-auto rounded-[8px] border border-[#ebebeb]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#ebebeb] text-[#8f8f8f] text-[11px] bg-[#fafafa]">
                    <th className="py-2.5 px-3 font-semibold">TASK</th>
                    <th className="py-2.5 px-3 font-semibold">USER / OPERATOR</th>
                    <th className="py-2.5 px-3 font-semibold">MODEL</th>
                    <th className="py-2.5 px-3 font-semibold">DURATION</th>
                    <th className="py-2.5 px-3 font-semibold">TIMESTAMP</th>
                    <th className="py-2.5 px-3 font-semibold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                  {filteredRuns.map((run) => (
                    <tr
                      key={run.id}
                      className="hover:bg-[#fafafa] transition-colors cursor-pointer group"
                      onClick={() => navigate('/assistant')}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#171717] group-hover:text-[#0070f3] transition-colors">
                          {run.task}
                        </div>
                        <div className="text-[10px] text-[#8f8f8f] font-mono">
                          ID: {run.id}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#4d4d4d] whitespace-nowrap">
                        {run.user}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#fafafa] border border-[#ebebeb] text-[11px] text-[#171717] font-mono">
                          {run.model}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#8f8f8f] font-mono whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {run.duration}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#8f8f8f] font-mono whitespace-nowrap">
                        {run.timestamp}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Badge
                          variant={getStatusBadgeVariant(run.status)}
                          size="sm"
                          dot={run.status === 'RUNNING'}
                        >
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
