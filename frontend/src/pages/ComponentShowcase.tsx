import React, { useState } from 'react'
import {
  Layers,
  Terminal,
  Play,
  Download,
  Key,
  Shield,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database,
} from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  Modal,
  ModalBody,
  ModalFooter,
  Dialog,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Dropdown,
  Tooltip,
  ProgressBar,
  Spinner,
  Skeleton,
  DataTable,
  EmptyState,
  ErrorState,
  useToast,
  FileUploadArea,
} from '@/components/ui'

interface SampleTelemetryRecord {
  nodeId: string
  cluster: string
  loadPercentage: number
  temperatureC: number
  securityMode: string
}

const sampleTableData: SampleTelemetryRecord[] = [
  { nodeId: 'NODE-01', cluster: 'Alpha (SGX)', loadPercentage: 68, temperatureC: 42, securityMode: 'Air-Gapped' },
  { nodeId: 'NODE-02', cluster: 'Alpha (SGX)', loadPercentage: 82, temperatureC: 48, securityMode: 'Air-Gapped' },
  { nodeId: 'NODE-03', cluster: 'Beta (HSM)', loadPercentage: 45, temperatureC: 38, securityMode: 'FIPS-140-3' },
  { nodeId: 'NODE-04', cluster: 'Gamma (H100)', loadPercentage: 91, temperatureC: 56, securityMode: 'Isolated' },
  { nodeId: 'NODE-05', cluster: 'Gamma (H100)', loadPercentage: 74, temperatureC: 51, securityMode: 'Isolated' },
  { nodeId: 'NODE-06', cluster: 'Delta (Storage)', loadPercentage: 33, temperatureC: 36, securityMode: 'Encrypted' },
]

export const ComponentShowcase: React.FC = () => {
  const { toast } = useToast()

  // Interactive States
  const [activeTab, setActiveTab] = useState('controls')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogVariant, setDialogVariant] = useState<'info' | 'warning' | 'destructive'>('warning')
  const [progressVal, setProgressVal] = useState(65)
  const [inputValue, setInputValue] = useState('AIR-GAP-ACTIVE')
  const [textareaVal, setTextareaVal] = useState('SELECT * FROM telemetry_stream WHERE anomaly_score > 0.85;')
  const [selectVal, setSelectVal] = useState('fp8')

  return (
    <div className="space-y-8 font-mono pb-12">
      {/* Header */}
      <div className="border-b border-border pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-text-primary uppercase flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              ZENITH UI DESIGN SYSTEM & REUSABLE COMPONENTS
            </h1>
            <Badge variant="info" size="sm" dot>
              ATOMIC UI v1.0
            </Badge>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Standardized enterprise industrial UI component library built with Tailwind CSS, Lucide React, and TypeScript.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="operational" />
          <Badge variant="default" size="sm">
            20 COMPONENTS
          </Badge>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <TabList className="w-full justify-start">
          <TabTrigger value="controls" icon={<Play className="w-3.5 h-3.5" />}>
            Actions & Controls
          </TabTrigger>
          <TabTrigger value="forms" icon={<Terminal className="w-3.5 h-3.5" />}>
            Form Elements
          </TabTrigger>
          <TabTrigger value="feedback" icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Feedback & Loaders
          </TabTrigger>
          <TabTrigger value="data" icon={<Database className="w-3.5 h-3.5" />}>
            Data Display & Tables
          </TabTrigger>
          <TabTrigger value="overlays" icon={<Shield className="w-3.5 h-3.5" />}>
            Surfaces & Modals
          </TabTrigger>
          <TabTrigger value="tokens" icon={<Layers className="w-3.5 h-3.5" />}>
            Design Tokens
          </TabTrigger>
        </TabList>

        {/* ================= TAB 1: ACTIONS & CONTROLS ================= */}
        <TabContent value="controls" className="space-y-6">
          {/* Button Component Showcase */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Button Variants & Sizes</CardTitle>
                <CardDescription>Industrial action buttons with accessible states</CardDescription>
              </div>
              <Badge variant="info">6 VARIANTS</Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Variants */}
              <div className="space-y-2">
                <span className="text-[11px] text-text-muted uppercase font-semibold">Variant Styles</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <span className="text-[11px] text-text-muted uppercase font-semibold">Sizes</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Size XS</Button>
                  <Button size="sm">Size SM</Button>
                  <Button size="md">Size MD</Button>
                  <Button size="lg">Size LG</Button>
                </div>
              </div>

              {/* States & Icons */}
              <div className="space-y-2">
                <span className="text-[11px] text-text-muted uppercase font-semibold">States & Icon Slots</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button leftIcon={<Download className="w-4 h-4" />}>Export Telemetry</Button>
                  <Button variant="outline" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Proceed
                  </Button>
                  <Button isLoading>Processing Pipeline</Button>
                  <Button disabled>Disabled Action</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dropdown & Tooltip Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Dropdown Menu</CardTitle>
                  <CardDescription>Contextual action menu with outside click dismissal</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Dropdown
                  trigger={<Button variant="outline" rightIcon={<ChevronRight className="w-3.5 h-3.5 rotate-90" />}>Enclave Operations</Button>}
                  items={[
                    { label: 'Attest Hardware TPM', icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />, onClick: () => toast.info('Attestation requested') },
                    { label: 'Download SHA-256 Manifest', icon: <Download className="w-3.5 h-3.5 text-emerald-400" />, onClick: () => toast.success('Manifest ready') },
                    { separator: true, label: 'sep1' },
                    { label: 'Purge Enclave Memory', icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />, destructive: true, onClick: () => toast.error('Memory purge restricted') },
                  ]}
                />

                <Dropdown
                  align="left"
                  trigger={<Button variant="secondary" size="sm">Left Aligned</Button>}
                  items={[
                    { label: 'View Audit Logs', icon: <ExternalLink className="w-3.5 h-3.5" /> },
                    { label: 'Cluster Diagnostics' },
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Tooltip Positions</CardTitle>
                  <CardDescription>Hover and focus directional tooltips</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Tooltip content="Tooltip displayed on Top" position="top">
                  <Button variant="outline" size="sm">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip displayed on Bottom" position="bottom">
                  <Button variant="outline" size="sm">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip displayed on Left" position="left">
                  <Button variant="outline" size="sm">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip displayed on Right" position="right">
                  <Button variant="outline" size="sm">Right</Button>
                </Tooltip>
              </CardContent>
            </Card>
          </div>
        </TabContent>

        {/* ================= TAB 2: FORMS ================= */}
        <TabContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Input, Textarea & Select Controls</CardTitle>
                <CardDescription>Hardened monospace inputs with error states and helper texts</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <Input
                label="Node Callsign (Clearable)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                clearable
                onClear={() => setInputValue('')}
                leftIcon={<Terminal className="w-4 h-4" />}
                helperText="Unique sovereign enclave identifier registered with TPM"
              />

              <Input
                label="Security Key (Error State)"
                defaultValue="INVALID_CIPHER_SUITE"
                leftIcon={<Key className="w-4 h-4" />}
                error="Cipher suite mismatch: FIPS 140-3 requires AES-GCM-256 or ChaCha20-Poly1305"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Inference Precision"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { value: 'fp8', label: 'FP8 Tensor Cores (Fastest)' },
                    { value: 'fp16', label: 'FP16 Half Precision' },
                    { value: 'bf16', label: 'BF16 Brain Float' },
                    { value: 'int8', label: 'INT8 Quantized' },
                  ]}
                  helperText="Select hardware tensor execution format"
                />

                <Input
                  label="Context Window Limit"
                  defaultValue="131,072 TOKENS"
                  disabled
                  helperText="Hardware constrained upper bound"
                />
              </div>

              <Textarea
                label="Industrial Analysis Prompt"
                value={textareaVal}
                onChange={(e) => setTextareaVal(e.target.value)}
                characterCount
                maxCharacters={200}
                rows={3}
                helperText="Deterministic prompt dispatched to air-gapped models"
              />
            </CardContent>
          </Card>

          {/* FileUploadArea Showcase */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>FileUploadArea Component</CardTitle>
                <CardDescription>Drag and drop industrial asset staging zone</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                acceptedExtensions={['.step', '.cad', '.pdf', '.xml', '.json']}
                maxFileSizeMB={50}
                onFilesSelected={(files) => {
                  toast.success(`Staged ${files.length} files for sovereign ingestion`)
                }}
              />
            </CardContent>
          </Card>
        </TabContent>

        {/* ================= TAB 3: FEEDBACK & LOADERS ================= */}
        <TabContent value="feedback" className="space-y-6">
          {/* Toast Notification Triggers */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Toast Notification System</CardTitle>
                <CardDescription>Auto-dismissing stacked notifications with useToast hook</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() => toast.success('Attestation Verified', 'TPM 2.0 enclave integrity verified successfully at 100%.')}
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="destructive"
                onClick={() => toast.error('Air-Gap Breach Prevented', 'Outbound egress on interface eth0 was intercepted and blocked.')}
              >
                Trigger Error Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.warning('Telemetry Drift Detected', 'Node-04 operating temperature reached 56°C threshold.')}
              >
                Trigger Warning Toast
              </Button>
              <Button
                variant="info"
                onClick={() => toast.info('Pipeline Dispatched', 'Thermal fatigue simulation queued on Cluster-Alpha.')}
              >
                Trigger Info Toast
              </Button>
            </CardContent>
          </Card>

          {/* Progress Bars */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Progress Bars</CardTitle>
                <CardDescription>Determinate and indeterminate progress indicators</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-48 accent-cyan-500"
                />
                <span className="text-xs font-mono text-cyan-400 font-bold">{progressVal}%</span>
              </div>

              <ProgressBar value={progressVal} label="Inference Buffer" showValue variant="info" size="md" />
              <ProgressBar value={88} label="Sovereign Memory Footprint" showValue variant="success" size="sm" />
              <ProgressBar value={72} label="Thermal Sensor Boundary" showValue variant="warning" size="md" />
              <ProgressBar value={94} label="Cluster Memory Capacity" showValue variant="error" size="sm" />
              <ProgressBar indeterminate label="Cryptographic Ledger Syncing" variant="info" size="md" />
            </CardContent>
          </Card>

          {/* Spinners & Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spinner Component</CardTitle>
                <CardDescription>Technical rotating SVG status loaders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Spinner size="xs" variant="info" />
                  <Spinner size="sm" variant="success" />
                  <Spinner size="md" variant="warning" />
                  <Spinner size="lg" variant="error" />
                  <Spinner size="xl" variant="default" />
                </div>
                <Spinner size="sm" variant="info" label="SYNCHRONIZING WEIGHTS..." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skeleton Component</CardTitle>
                <CardDescription>Shimmer placeholders for asynchronous content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={40} />
              </CardContent>
            </Card>
          </div>
        </TabContent>

        {/* ================= TAB 4: DATA DISPLAY ================= */}
        <TabContent value="data" className="space-y-6">
          {/* Badges & StatusBadges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges & Status Indicators</CardTitle>
              <CardDescription>Status pills and operational telemetry indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] text-text-muted uppercase font-semibold">Semantic Badges</span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="info" dot>Info Badge</Badge>
                  <Badge variant="success" dot>Success Badge</Badge>
                  <Badge variant="warning" dot>Warning Badge</Badge>
                  <Badge variant="error" dot>Error Badge</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-text-muted uppercase font-semibold">Operational StatusBadges</span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusBadge status="operational" />
                  <StatusBadge status="online" />
                  <StatusBadge status="air-gapped" />
                  <StatusBadge status="standby" />
                  <StatusBadge status="warning" />
                  <StatusBadge status="critical" />
                  <StatusBadge status="offline" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DataTable Showcase */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>DataTable Component</CardTitle>
                <CardDescription>Interactive table with search, sorting, pagination, and empty states</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={sampleTableData}
                keyExtractor={(row) => row.nodeId}
                pageSize={4}
                searchPlaceholder="Filter by node ID, cluster..."
                columns={[
                  {
                    key: 'nodeId',
                    header: 'Node Identifier',
                    sortable: true,
                    render: (row) => <span className="font-bold text-cyan-300">{row.nodeId}</span>,
                  },
                  {
                    key: 'cluster',
                    header: 'Enclave Cluster',
                    sortable: true,
                  },
                  {
                    key: 'loadPercentage',
                    header: 'Compute Load',
                    sortable: true,
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <ProgressBar value={row.loadPercentage} size="sm" variant={row.loadPercentage > 85 ? 'warning' : 'info'} className="w-20" />
                        <span>{row.loadPercentage}%</span>
                      </div>
                    ),
                  },
                  {
                    key: 'temperatureC',
                    header: 'Temp (°C)',
                    sortable: true,
                    render: (row) => <span>{row.temperatureC}°C</span>,
                  },
                  {
                    key: 'securityMode',
                    header: 'Posture',
                    render: (row) => <Badge variant="success" size="sm">{row.securityMode}</Badge>,
                  },
                ]}
                onRowClick={(row) => toast.info(`Selected Node: ${row.nodeId}`)}
              />
            </CardContent>
          </Card>

          {/* EmptyState & ErrorState */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              title="No Ingested Schematics Found"
              description="Upload STEP, CAD, or PDF documentation to begin local vector indexing."
              action={<Button size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Upload Specification</Button>}
            />

            <ErrorState
              title="HSM Cryptographic Attestation Failed"
              code="ERR_TPM_NONCE_MISMATCH_409"
              description="Hardware security module returned an invalid endorsement signature."
              details={`TRACE_ID: zn-9041-aa89\nNONCE: 0x4f81c900e2b1\nEXPECTED: 0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nRECEIVED: 0x7f92a104bcde83210984daffe90219411904af80173298a0029b4e0984daffe\nSTATUS: ISOLATION_LOCKED`}
              onRetry={() => toast.info('Retrying hardware attestation...')}
            />
          </div>
        </TabContent>

        {/* ================= TAB 5: OVERLAYS & MODALS ================= */}
        <TabContent value="overlays" className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Modal & Confirmation Dialog</CardTitle>
                <CardDescription>Accessible dialog surfaces with backdrop blur and escape key handling</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
              >
                Open Sovereign Configuration Modal
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setDialogVariant('warning')
                  setIsDialogOpen(true)
                }}
              >
                Open Warning Dialog
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  setDialogVariant('destructive')
                  setIsDialogOpen(true)
                }}
              >
                Open Destructive Action Dialog
              </Button>
            </CardContent>
          </Card>

          {/* Card Variants Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-text-secondary">Standard surface background with subtle border and industrial shadow.</p>
              </CardContent>
              <CardFooter>
                <span>Footer Slot</span>
                <Badge variant="default">DEFAULT</Badge>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-text-secondary">Elevated surface with higher contrast border and deeper shadow.</p>
              </CardContent>
              <CardFooter>
                <span>Footer Slot</span>
                <Badge variant="info">ELEVATED</Badge>
              </CardFooter>
            </Card>

            <Card variant="sunken">
              <CardHeader>
                <CardTitle>Sunken Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-text-secondary">Deep sunken backdrop ideal for embedded viewports and telemetry logs.</p>
              </CardContent>
              <CardFooter>
                <span>Footer Slot</span>
                <Badge variant="outline">SUNKEN</Badge>
              </CardFooter>
            </Card>
          </div>
        </TabContent>

        {/* ================= TAB 6: DESIGN TOKENS ================= */}
        <TabContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Semantic Design Tokens</CardTitle>
                <CardDescription>Tailwind palette and accessible contrast mapping</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-xs">
              {/* Surfaces */}
              <div className="space-y-2">
                <span className="font-semibold text-text-secondary uppercase">Surfaces & Backgrounds</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded bg-bg border border-border">
                    <div className="font-bold text-text-primary">bg (Default)</div>
                    <div className="text-[10px] text-text-muted">#080b12</div>
                  </div>
                  <div className="p-4 rounded bg-surface border border-border">
                    <div className="font-bold text-text-primary">surface</div>
                    <div className="text-[10px] text-text-muted">#0d1322</div>
                  </div>
                  <div className="p-4 rounded bg-surface-elevated border border-border-strong">
                    <div className="font-bold text-text-primary">surface-elevated</div>
                    <div className="text-[10px] text-text-muted">#131b2e</div>
                  </div>
                  <div className="p-4 rounded bg-surface-sunken border border-border-subtle">
                    <div className="font-bold text-text-primary">surface-sunken</div>
                    <div className="text-[10px] text-text-muted">#06090f</div>
                  </div>
                </div>
              </div>

              {/* Status Colors */}
              <div className="space-y-2">
                <span className="font-semibold text-text-secondary uppercase">Semantic Status Tokens</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded bg-industrial-success-subtle border border-industrial-success-border">
                    <div className="font-bold text-emerald-300">success</div>
                    <div className="text-[10px] text-emerald-500">#10b981 (Verified)</div>
                  </div>
                  <div className="p-4 rounded bg-industrial-warning-subtle border border-industrial-warning-border">
                    <div className="font-bold text-amber-300">warning</div>
                    <div className="text-[10px] text-amber-500">#f59e0b (Caution)</div>
                  </div>
                  <div className="p-4 rounded bg-industrial-error-subtle border border-industrial-error-border">
                    <div className="font-bold text-rose-300">error</div>
                    <div className="text-[10px] text-rose-500">#ef4444 (Fault)</div>
                  </div>
                  <div className="p-4 rounded bg-industrial-info-subtle border border-industrial-info-border">
                    <div className="font-bold text-cyan-300">info</div>
                    <div className="text-[10px] text-cyan-500">#06b6d4 (Sovereign)</div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-2">
                <span className="font-semibold text-text-secondary uppercase">Typography Hierarchy</span>
                <div className="p-4 rounded bg-surface-sunken border border-border space-y-2">
                  <div className="text-xl font-bold font-mono text-text-primary">H1 / Heading Monospace (20px)</div>
                  <div className="text-base font-semibold font-mono text-text-primary">H2 / Subheading Monospace (16px)</div>
                  <div className="text-sm text-text-primary font-mono">Body Primary Monospace (14px) - High Contrast</div>
                  <div className="text-xs text-text-secondary font-mono">Body Secondary Monospace (12px) - Technical Labels</div>
                  <div className="text-[11px] text-text-muted font-mono">Caption / Helper Text (11px) - Timestamps & Hashes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>

      {/* Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sovereign Enclave Node Configuration"
        description="Modify hardware isolation parameters and cryptographic key sealing"
        size="md"
      >
        <ModalBody className="space-y-4">
          <Input label="Enclave Node ID" defaultValue="NODE-ENCLAVE-01" disabled />
          <Select
            label="Hardware Root of Trust"
            options={[
              { value: 'sgx2', label: 'Intel Xeon SGX2 Confidential VM' },
              { value: 'sev', label: 'AMD SEV-SNP Dedicated Node' },
              { value: 'h100', label: 'NVIDIA H100 Sovereign Enclave' },
            ]}
          />
          <ProgressBar value={100} label="Hardware Attestation" showValue variant="success" />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
            Dismiss
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setIsModalOpen(false)
              toast.success('Configuration Saved', 'Enclave parameters re-sealed with hardware master key.')
            }}
          >
            Save Parameters
          </Button>
        </ModalFooter>
      </Modal>

      {/* Dialog Demo */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          setIsDialogOpen(false)
          toast.warning('Action Confirmed', 'Operation dispatched to sovereign controller.')
        }}
        variant={dialogVariant}
        title={dialogVariant === 'destructive' ? 'Purge Ingested Weights?' : 'Re-attest Hardware Boundary?'}
        description={
          dialogVariant === 'destructive'
            ? 'This action will wipe all unsealed weights from volatile enclave memory. This operation cannot be reversed.'
            : 'Initiates a physical cryptographic handshake with TPM 2.0 hardware. Session latency may temporarily increase by ~2ms.'
        }
        confirmText={dialogVariant === 'destructive' ? 'Confirm Purge' : 'Re-attest Now'}
      />
    </div>
  )
}

export default ComponentShowcase
