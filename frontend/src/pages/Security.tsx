import React, { useState, useEffect, useCallback } from 'react'
import {
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'

import {
  securityApi,
  setSecurityProvenanceMode,
  getSecurityProvenanceMode,
} from '@/services/securityApi'
import type {
  SovereigntySummary,
  LocalServiceHealthItem,
  NetworkMonitorEntry,
  AuditTimelineEntry,
  SecurityEvent,
  DataSourceOrigin,
} from '@/types/security'

import { TransparencyBanner } from '@/components/security/TransparencyBanner'
import { SovereigntySummaryGrid } from '@/components/security/SovereigntySummaryGrid'
import { LocalServiceHealth } from '@/components/security/LocalServiceHealth'
import { NetworkMonitor } from '@/components/security/NetworkMonitor'
import { AuditTimeline } from '@/components/security/AuditTimeline'
import { SecurityEventsFeed } from '@/components/security/SecurityEventsFeed'

export const Security: React.FC = () => {
  const { toast } = useToast()

  // Provenance Mode (DEV_TEST_DATA by default, switchable to LIVE_API or UNAVAILABLE)
  const [provenanceMode, setProvenanceMode] = useState<DataSourceOrigin>(
    getSecurityProvenanceMode()
  )

  // Telemetry States
  const [summary, setSummary] = useState<SovereigntySummary | null>(null)
  const [services, setServices] = useState<LocalServiceHealthItem[]>([])
  const [networkEntries, setNetworkEntries] = useState<NetworkMonitorEntry[]>([])
  const [auditEntries, setAuditEntries] = useState<AuditTimelineEntry[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch all telemetry according to active provenance mode
  const fetchAllTelemetry = useCallback(async () => {
    setIsLoading(true)
    try {
      const [sum, srvs, net, aud, evs] = await Promise.all([
        securityApi.getSovereigntySummary(),
        securityApi.getLocalServicesHealth(),
        securityApi.getNetworkMonitorEntries(),
        securityApi.getAuditTimeline(),
        securityApi.getSecurityEvents(),
      ])

      setSummary(sum)
      setServices(srvs)
      setNetworkEntries(net)
      setAuditEntries(aud)
      setSecurityEvents(evs)
    } catch {
      toast.error('Telemetry Error', 'Failed to retrieve telemetry data.')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAllTelemetry()
  }, [fetchAllTelemetry, provenanceMode])

  // Handle Mode Change
  const handleModeChange = (newMode: DataSourceOrigin) => {
    setSecurityProvenanceMode(newMode)
    setProvenanceMode(newMode)
    if (newMode === 'LIVE_API') {
      toast.info(
        'Switched to LIVE API Mode',
        'Attempting direct connection to backend telemetry microservices.'
      )
    } else if (newMode === 'DEV_TEST_DATA') {
      toast.warning(
        'Switched to DEV / TEST Mode',
        'Displaying simulated test fixtures. Not evidence of real air gap.'
      )
    } else {
      toast.info(
        'Switched to UNAVAILABLE Mode',
        'Simulating missing/unprovisioned backend telemetry endpoints.'
      )
    }
  }

  return (
    <div className="space-y-6 font-mono text-text-primary pb-8">
      {/* 1. Page Header */}
      <div className="rounded-[12px] bg-white border border-[#ebebeb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#171717] flex items-center gap-2">
                <span>SECURITY, SOVEREIGNTY & AUDIT</span>
              </h1>
              <p className="text-xs text-[#8f8f8f]">
                Confidential Hardware Telemetry • Air-Gap Network Egress • Immutable Cryptographic Audit Log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllTelemetry}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Telemetry
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Transparency Banner (Provenance Notice & Dev Selector) */}
      <TransparencyBanner
        currentMode={provenanceMode}
        onModeChange={handleModeChange}
      />

      {/* 3. Sovereignty Summary Grid (5 Metrics with Provenance) */}
      {isLoading && !summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={130} />
          ))}
        </div>
      ) : (
        <SovereigntySummaryGrid summary={summary} isLoading={isLoading} />
      )}

      {/* 4. Local Service Health (7 Sovereign Components) */}
      {isLoading && services.length === 0 ? (
        <Skeleton variant="rectangular" height={280} />
      ) : (
        <LocalServiceHealth services={services} />
      )}

      {/* 5. Network Monitor (Egress & IPC Intercept Log) */}
      {isLoading && networkEntries.length === 0 ? (
        <Skeleton variant="rectangular" height={240} />
      ) : (
        <NetworkMonitor entries={networkEntries} />
      )}

      {/* 6. Cryptographic Audit Timeline */}
      {isLoading && auditEntries.length === 0 ? (
        <Skeleton variant="rectangular" height={280} />
      ) : (
        <AuditTimeline entries={auditEntries} />
      )}

      {/* 7. Security Events Feed */}
      {isLoading && securityEvents.length === 0 ? (
        <Skeleton variant="rectangular" height={220} />
      ) : (
        <SecurityEventsFeed events={securityEvents} />
      )}
    </div>
  )
}

export default Security
