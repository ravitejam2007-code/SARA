import type {
  SovereigntySummary,
  LocalServiceHealthItem,
  NetworkMonitorEntry,
  AuditTimelineEntry,
  SecurityEvent,
} from '@/types/security'

/**
 * Zenith AI — Development Security Telemetry Fixtures
 *
 * All records here are strictly local development fixtures.
 * Every item is explicitly tagged with `dataOrigin: 'DEV_TEST_DATA'`
 * to prevent misrepresenting simulation values as measured infrastructure telemetry.
 */

// ================= 1. DEV TEST DATA FIXTURES =================

export const DEV_SOVEREIGNTY_SUMMARY: SovereigntySummary = {
  externalApiCalls: {
    value: 0,
    origin: 'DEV_TEST_DATA',
    note: 'Simulated measurement: Host network interface iptables DROP rule active in test container.',
    lastUpdated: 'Just now',
  },
  cloudModelCalls: {
    value: 0,
    origin: 'DEV_TEST_DATA',
    note: 'Simulated fixture: Local LLM inference server routing enabled; WAN routes severed.',
    lastUpdated: 'Just now',
  },
  externalDnsRequests: {
    value: 0,
    origin: 'DEV_TEST_DATA',
    note: 'Simulated measurement: CoreDNS configured strictly for local enclave name resolution.',
    lastUpdated: 'Just now',
  },
  networkEgressBytes: {
    bytes: 0,
    formatted: '0 Bytes',
    origin: 'DEV_TEST_DATA',
    note: 'Simulated metric: Egress byte counter reset at start of local development session.',
    lastUpdated: 'Just now',
  },
  localServiceAvailabilityPercent: {
    value: 100,
    origin: 'DEV_TEST_DATA',
    note: 'Simulated metric: 7/7 local development support containers reporting HTTP 200.',
    lastUpdated: 'Just now',
  },
}

export const DEV_LOCAL_SERVICES_HEALTH: LocalServiceHealthItem[] = [
  {
    id: 'srv-01',
    name: 'LLM',
    status: 'HEALTHY',
    latencyMs: 14,
    uptime: '18h 42m',
    memoryVram: '38.4 GB (Simulated)',
    version: 'Zenith-Engineer-70B-FP8 (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'srv-02',
    name: 'Vision Model',
    status: 'HEALTHY',
    latencyMs: 28,
    uptime: '18h 42m',
    memoryVram: '14.2 GB (Simulated)',
    version: 'DeepCAD-Vision-v2 (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'srv-03',
    name: 'OCR',
    status: 'HEALTHY',
    latencyMs: 8,
    uptime: '42h 10m',
    memoryVram: '2.1 GB (Simulated)',
    version: 'Tesseract-Enclave-v5 (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'srv-04',
    name: 'Qdrant',
    status: 'HEALTHY',
    latencyMs: 4,
    uptime: '96h 04m',
    memoryVram: '6.8 GB (Simulated)',
    version: 'Qdrant-v1.12-HNSW (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'srv-05',
    name: 'PostgreSQL',
    status: 'HEALTHY',
    latencyMs: 2,
    uptime: '140h 20m',
    memoryVram: '4.0 GB (Simulated)',
    version: 'PostgreSQL-16-WORM (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'srv-06',
    name: 'File Storage',
    status: 'HEALTHY',
    latencyMs: 1,
    uptime: '140h 20m',
    memoryVram: '148 MB / 2 TB (Simulated)',
    version: 'Local-NVMe-Storage-v2 (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'srv-07',
    name: 'Code Sandbox',
    status: 'HEALTHY',
    latencyMs: 12,
    uptime: '18h 42m',
    memoryVram: '8.0 GB (Simulated)',
    version: 'gVisor-Sandbox-Runner (Fixture)',
    dataOrigin: 'DEV_TEST_DATA',
  },
]

export const DEV_NETWORK_MONITOR_ENTRIES: NetworkMonitorEntry[] = [
  {
    id: 'net-01',
    timestamp: '14:38:02 UTC',
    service: 'AI Assistant',
    requestType: 'LOCAL_IPC',
    targetEndpoint: 'unix:///var/run/zenith/llm_inference.sock',
    status: 'ALLOWED',
    protocol: 'UNIX DOMAIN SOCKET',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'net-02',
    timestamp: '14:37:44 UTC',
    service: 'Telemetry Daemon',
    requestType: 'BLOCKED_EGRESS',
    targetEndpoint: 'https://telemetry.external-cloud.com/v1/metrics',
    status: 'BLOCKED_BY_AIRGAP',
    protocol: 'HTTPS (BLOCKED BY CONTAINER NETFILTER)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'net-03',
    timestamp: '14:35:12 UTC',
    service: 'Knowledge Base',
    requestType: 'INTERNAL_RPC',
    targetEndpoint: 'http://127.0.0.1:6333/collections/aerospace',
    status: 'VERIFIED',
    protocol: 'HTTP/2 gRPC',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'net-04',
    timestamp: '14:30:19 UTC',
    service: 'Web Fetcher Probe',
    requestType: 'BLOCKED_EGRESS',
    targetEndpoint: 'https://api.openai.com/v1/chat/completions',
    status: 'BLOCKED_BY_AIRGAP',
    protocol: 'HTTPS (EGRESS REJECTED: NO DEFAULT ROUTE)',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'net-05',
    timestamp: '14:24:50 UTC',
    service: 'Audit Logger',
    requestType: 'INTERNAL_RPC',
    targetEndpoint: 'postgresql://zenith_audit@127.0.0.1:5432/ledger',
    status: 'VERIFIED',
    protocol: 'TLSv1.3 mTLS',
    dataOrigin: 'DEV_TEST_DATA',
  },
]

export const DEV_AUDIT_TIMELINE_ENTRIES: AuditTimelineEntry[] = [
  {
    id: 'aud-01',
    timestamp: '14:35:22 UTC',
    user: 'Ravi (Chief Eng)',
    action: 'DISPATCH_PIPELINE',
    resource: 'Turbine_Blade_Assembly.step',
    model: 'Zenith-Engineer-70B-FP8',
    tool: 'Python FEM Solver',
    status: 'CONFIRMED',
    checksumSha256: '8f4ad91ce7a328109bfbc42298fc1c149afbf4c8996fb92427ae41e4649b934c',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'aud-02',
    timestamp: '14:30:05 UTC',
    user: 'System Agent',
    action: 'ATTEMPT_EXTERNAL_CALL',
    resource: 'https://api.openai.com',
    model: '—',
    tool: 'Network Gateway Intercept',
    status: 'BLOCKED',
    checksumSha256: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'aud-03',
    timestamp: '14:15:40 UTC',
    user: 'Kai Chen',
    action: 'VECTOR_INDEX_INGESTION',
    resource: 'TwinCAT3_Emergency_Coolant_SOP.docx',
    model: 'Zenith-Embed-3-Large',
    tool: 'Qdrant HNSW Ingestion',
    status: 'CONFIRMED',
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'aud-04',
    timestamp: '13:50:11 UTC',
    user: 'Sarah Connor',
    action: 'EXPORT_DELIVERABLE',
    resource: 'SCADA_Pump_Telemetry_Statistical_Summary.xlsx',
    model: 'Zenith-Engineer-70B-FP8',
    tool: 'Document Generator',
    status: 'CONFIRMED',
    checksumSha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'aud-05',
    timestamp: '12:10:04 UTC',
    user: 'Unauthorized Client Probe',
    action: 'AUTHENTICATION_ATTEMPT',
    resource: '/api/v1/enclave/keys',
    model: '—',
    tool: 'mTLS Enclave Gateway',
    status: 'FLAGGED',
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    dataOrigin: 'DEV_TEST_DATA',
  },
]

export const DEV_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-ev-01',
    type: 'BLOCKED_REQUEST',
    severity: 'HIGH',
    title: 'Outbound WAN Route Blocked',
    detail: 'Hardware firewall dropped unauthorized connection attempt to external cloud domain 104.18.2.14.',
    timestamp: '14:37:44 UTC',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'sec-ev-02',
    type: 'WARNING',
    severity: 'MEDIUM',
    title: 'Model Memory Allocation Threshold',
    detail: 'GPU Enclave memory reached 78% allocation limit during batch tensor execution.',
    timestamp: '14:32:10 UTC',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'sec-ev-03',
    type: 'AUTH_EVENT',
    severity: 'INFO',
    title: 'Cryptographic Lease Renewed',
    detail: 'Operator session lease successfully re-authenticated via hardware security module token.',
    timestamp: '14:20:00 UTC',
    dataOrigin: 'DEV_TEST_DATA',
  },
  {
    id: 'sec-ev-04',
    type: 'FILE_ACCESS',
    severity: 'LOW',
    title: 'Immutable Ledger Append',
    detail: 'Certified deliverable SHA-256 seal committed to on-premise write-once audit block #140922.',
    timestamp: '14:15:42 UTC',
    dataOrigin: 'DEV_TEST_DATA',
  },
]

// ================= 2. UNAVAILABLE TELEMETRY REPLICAS =================

export const UNAVAILABLE_SOVEREIGNTY_SUMMARY: SovereigntySummary = {
  externalApiCalls: {
    value: null,
    origin: 'UNAVAILABLE',
    note: 'Backend telemetry endpoint GET /api/security/sovereignty is unprovisioned or unreachable.',
  },
  cloudModelCalls: {
    value: null,
    origin: 'UNAVAILABLE',
    note: 'Backend telemetry endpoint GET /api/security/sovereignty is unprovisioned or unreachable.',
  },
  externalDnsRequests: {
    value: null,
    origin: 'UNAVAILABLE',
    note: 'DNS query resolver monitor not reporting live telemetry.',
  },
  networkEgressBytes: {
    bytes: null,
    formatted: '—',
    origin: 'UNAVAILABLE',
    note: 'Egress monitoring daemon offline.',
  },
  localServiceAvailabilityPercent: {
    value: null,
    origin: 'UNAVAILABLE',
    note: 'Service health check endpoint unresponsive.',
  },
}

export const UNAVAILABLE_LOCAL_SERVICES_HEALTH: LocalServiceHealthItem[] = [
  'LLM',
  'Vision Model',
  'OCR',
  'Qdrant',
  'PostgreSQL',
  'File Storage',
  'Code Sandbox',
].map((name, index) => ({
  id: `unavail-${index}`,
  name,
  status: 'UNAVAILABLE',
  latencyMs: null,
  uptime: null,
  memoryVram: null,
  version: null,
  dataOrigin: 'UNAVAILABLE',
}))
