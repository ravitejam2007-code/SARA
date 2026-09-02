import { apiClient } from './api'
import type { DashboardData } from '@/types/dashboard'

/**
 * Zenith AI — Sovereign Industrial Control Center
 * Dashboard Telemetry Service
 *
 * Provides API-driven data with structured development placeholders.
 * Explicitly marks non-production values to prevent unverified physical security claims.
 */

export const INITIAL_DASHBOARD_DATA: DashboardData = {
  isDevelopmentPlaceholder: true,
  lastSyncedAt: 'JUST NOW',
  kpis: {
    activeModels: 4,
    activeModelsTotal: 4,
    documentsProcessed: 37,
    agentRuns: 12,
    generatedDeliverables: 8,
    externalApiCalls: 0,
    localServicesStatus: 'OPERATIONAL',
    servicesHealthyCount: 5,
    servicesTotalCount: 5,
  },
  recentRuns: [
    {
      id: 'RUN-9104',
      task: 'High-Temperature Turbine Blade Thermal Stress Analysis',
      user: 'Ravi (Chief Eng)',
      model: 'Zenith-Engineer-70B-FP8',
      status: 'COMPLETED',
      duration: '2m 14s',
      timestamp: '8 mins ago',
      tokensProcessed: 14200,
    },
    {
      id: 'RUN-9103',
      task: 'Beckhoff TwinCAT3 Structured Text PLC Safety Interlock Verification',
      user: 'Kai Chen',
      model: 'CodePLC-IEC-61131',
      status: 'RUNNING',
      duration: '48s',
      timestamp: 'Just now',
      tokensProcessed: 6840,
    },
    {
      id: 'RUN-9102',
      task: 'STEP 3D Geometric Defect Segmentation & Wall-Thickness Check',
      user: 'Ravi (Chief Eng)',
      model: 'DeepCAD-Geometry-v2',
      status: 'COMPLETED',
      duration: '1m 32s',
      timestamp: '24 mins ago',
      tokensProcessed: 9100,
    },
    {
      id: 'RUN-9101',
      task: 'SCADA Pressure Transducer Spectral Anomaly Detection',
      user: 'Sarah Connor',
      model: 'AnomalyDetect-TS-8B',
      status: 'COMPLETED',
      duration: '18s',
      timestamp: '1 hour ago',
      tokensProcessed: 3200,
    },
    {
      id: 'RUN-9100',
      task: 'ISO 1982 Regulatory Compliance Traceability Matrix Build',
      user: 'Marcus Holt',
      model: 'Zenith-Engineer-70B-FP8',
      status: 'QUEUED',
      duration: '0s',
      timestamp: 'Pending queue',
      tokensProcessed: 0,
    },
    {
      id: 'RUN-9099',
      task: 'Hydraulic Actuator Fast-Fourier Transform Sensor Calibration',
      user: 'Elena Vance',
      model: 'Zenith-Engineer-70B-FP8',
      status: 'FAILED',
      duration: '14s',
      timestamp: '3 hours ago',
      tokensProcessed: 140,
    },
  ],
  modelActivity: [
    {
      id: 'MDL-01',
      name: 'Zenith-Engineer-70B-FP8',
      capability: 'Structural Mechanics, Thermodynamics & Fluid Dynamics',
      status: 'INFERENCE',
      currentLoad: 74,
      vramUsage: '38.4 GB / 80 GB',
      contextLimit: '128K',
    },
    {
      id: 'MDL-02',
      name: 'DeepCAD-Geometry-v2',
      capability: 'STEP / IGES 3D Boundary Representation & Mesh Reasoning',
      status: 'ONLINE',
      currentLoad: 48,
      vramUsage: '14.2 GB / 24 GB',
      contextLimit: '64K',
    },
    {
      id: 'MDL-03',
      name: 'CodePLC-IEC-61131',
      capability: 'Structured Text, Ladder Logic & Safety State Verification',
      status: 'INFERENCE',
      currentLoad: 62,
      vramUsage: '11.8 GB / 24 GB',
      contextLimit: '32K',
    },
    {
      id: 'MDL-04',
      name: 'AnomalyDetect-TS-8B',
      capability: 'SCADA High-Frequency Time-Series Inference & FFT Filter',
      status: 'ONLINE',
      currentLoad: 29,
      vramUsage: '7.6 GB / 16 GB',
      contextLimit: '16K',
    },
  ],
  securitySummary: [
    {
      id: 'sec-ext',
      label: 'External Calls',
      status: 'ISOLATED',
      telemetry: '0 Calls / 0 B Egress',
      detail: 'Network physical layer disconnected; strictly air-gapped domain',
      badgeVariant: 'success',
    },
    {
      id: 'sec-model',
      label: 'Local Model',
      status: 'SECURE',
      telemetry: 'Confidential Computing SGX2',
      detail: 'Weights cryptographically decrypted exclusively within CPU enclaves',
      badgeVariant: 'success',
    },
    {
      id: 'sec-rag',
      label: 'Local RAG',
      status: 'ENFORCED',
      telemetry: 'On-Premise HNSW Index',
      detail: 'Vector embeddings reside exclusively on local encrypted NVMe arrays',
      badgeVariant: 'info',
    },
    {
      id: 'sec-sandbox',
      label: 'Sandbox',
      status: 'ENFORCED',
      telemetry: 'Hardened Container Isolation',
      detail: 'gVisor sandbox blocks unauthorized system calls and IPC leakage',
      badgeVariant: 'info',
    },
    {
      id: 'sec-db',
      label: 'Database',
      status: 'SECURE',
      telemetry: 'Encrypted WORM Ledger',
      detail: 'Write-once read-many audit storage sealed with SHA-256 signatures',
      badgeVariant: 'success',
    },
  ],
  analytics: [
    { time: '02:00', agentRuns: 1, throughputTokPerSec: 2100 },
    { time: '04:00', agentRuns: 0, throughputTokPerSec: 1400 },
    { time: '06:00', agentRuns: 2, throughputTokPerSec: 2850 },
    { time: '08:00', agentRuns: 4, throughputTokPerSec: 4200 },
    { time: '10:00', agentRuns: 7, throughputTokPerSec: 4680 },
    { time: '12:00', agentRuns: 5, throughputTokPerSec: 3950 },
    { time: '14:00', agentRuns: 9, throughputTokPerSec: 5120 },
    { time: '16:00', agentRuns: 12, throughputTokPerSec: 4540 },
  ],
}

/**
 * Fetch dashboard control center telemetry
 */
export async function fetchDashboardData(options?: {
  simulateError?: boolean
  simulateEmpty?: boolean
}): Promise<DashboardData> {
  // Check for simulated error flag
  if (options?.simulateError) {
    await new Promise((r) => setTimeout(r, 400))
    throw new Error('COMMUNICATION_FAULT: Sovereign Enclave Telemetry Gateway did not respond within 400ms.')
  }

  try {
    // Attempt real backend call
    const response = await apiClient.get<DashboardData>('/dashboard/telemetry')
    return response.data
  } catch {
    // Graceful fallback to development placeholder data with realistic network latency
    await new Promise((r) => setTimeout(r, 300))

    if (options?.simulateEmpty) {
      return {
        ...INITIAL_DASHBOARD_DATA,
        kpis: {
          ...INITIAL_DASHBOARD_DATA.kpis,
          agentRuns: 0,
        },
        recentRuns: [],
      }
    }

    return INITIAL_DASHBOARD_DATA
  }
}
