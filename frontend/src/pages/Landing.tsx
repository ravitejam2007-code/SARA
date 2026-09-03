import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  Terminal,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Layers,
  Download,
  FileText,
} from 'lucide-react'

export const Landing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-[#171717] selection:text-white relative">
      {/* Top Hairline Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md border-b border-[#ebebeb] px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base tracking-tight font-mono">SARA</span>
            <span className="text-[11px] font-mono text-[#8f8f8f] tracking-widest uppercase">
              // SOVEREIGN WORKBENCH
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[#4d4d4d]">
          <a href="#features" className="hover:text-[#171717] transition-colors">
            Architecture
          </a>
          <a href="#workflows" className="hover:text-[#171717] transition-colors">
            Workflows
          </a>
          <a href="#evidence" className="hover:text-[#171717] transition-colors">
            Evidence Chain
          </a>
          <a href="#sovereignty" className="hover:text-[#171717] transition-colors">
            Air-Gap Telemetry
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-[#4d4d4d] hover:text-[#171717] px-3 py-1.5 rounded-[6px] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-medium bg-[#171717] text-white hover:bg-black px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02]"
          >
            Launch Workbench
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section with Vercel Mesh Gradient */}
      <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Subtle Mesh Gradient Bloom */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00dfd8]/20 via-[#7928ca]/15 to-[#ff0080]/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ebebeb] bg-white text-xs font-mono text-[#4d4d4d] shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#50e3c2] animate-pulse" />
          <span className="font-semibold text-[#171717]">SIH26117 PROTOTYPE</span>
          <span className="text-[#8f8f8f]">|</span>
          <span>AIR-GAPPED SOVEREIGN AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.04em] text-[#171717] leading-[1.08] max-w-4xl mx-auto mb-6">
          Air-Gapped Industrial AI. <br />
          <span className="text-[#8f8f8f]">Zero Cloud Egress.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#4d4d4d] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Run multiple open-weight models on-premise without heavy GPUs. Route tasks by capability,
          execute controlled local tools, and compile certified engineering deliverables with verified human signoff.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#171717] text-white font-medium text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Enter Workbench Console
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-[#171717] border border-[#ebebeb] font-medium text-sm hover:bg-[#f2f2f2] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            Explore Live Dashboard
          </button>
        </div>

        {/* Live Sovereignty Verification Strip */}
        <div className="mt-14 pt-6 border-t border-[#ebebeb] grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-white rounded-[6px] border border-[#ebebeb]">
            <span className="text-[10px] font-mono uppercase text-[#8f8f8f] block">External Connectivity</span>
            <span className="text-xs font-mono font-bold text-[#171717] flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              BLOCKED (AIR-GAP)
            </span>
          </div>
          <div className="p-3 bg-white rounded-[6px] border border-[#ebebeb]">
            <span className="text-[10px] font-mono uppercase text-[#8f8f8f] block">External AI Requests</span>
            <span className="text-xs font-mono font-bold text-[#171717] mt-0.5 block">0 (Zero Egress)</span>
          </div>
          <div className="p-3 bg-white rounded-[6px] border border-[#ebebeb]">
            <span className="text-[10px] font-mono uppercase text-[#8f8f8f] block">Model Provider</span>
            <span className="text-xs font-mono font-bold text-[#171717] mt-0.5 block">Open-Weight (Zero-GPU Req.)</span>
          </div>
          <div className="p-3 bg-white rounded-[6px] border border-[#ebebeb]">
            <span className="text-[10px] font-mono uppercase text-[#8f8f8f] block">Compliance Standard</span>
            <span className="text-xs font-mono font-bold text-[#171717] mt-0.5 block">ISO 10816 / FIPS 140-3</span>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section (Hairline Cards) */}
      <section id="features" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-[#ebebeb]">
        <div className="mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8f8f8f] block mb-2">
            01 // ARCHITECTURAL PILLARS
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
            Built specifically for on-premise industrial confidentiality.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-[12px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="w-9 h-9 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[#171717]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">
              Intelligent Capability-Based Model Router
            </h3>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              No single model handles everything. SARA classifies prompts into capabilities (reasoning,
              coding, vision, document, tabular) and selects the best local open-weight model (3B, 2B, 1B)
              optimized for CPU/lightweight execution without expensive GPU clusters.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[#4d4d4d]">
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">SARA-Reasoning-3B</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">SARA-Coding-Engine</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">SARA-Vision-Light</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-[12px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="w-9 h-9 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[#171717]">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">
              Deterministic Agent State Machine
            </h3>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              Eliminates uncontrolled autonomous loops. Every task flows deterministically through 8 audited
              states: REQUESTED → PLANNING → ROUTING → EXECUTING → OBSERVING → VERIFYING → APPROVAL_REQUIRED → COMPLETED.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[#4d4d4d]">
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">Audited Timeline</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">Subprocess Isolation</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">Zero Drift</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-[12px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="w-9 h-9 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[#171717]">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">
              Evidence-First Response Design
            </h3>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              Zero hallucinated claims. Every technical finding links directly to an immutable evidence chain:
              Claim → Verified Sensor Telemetry → Standard SOP Clause → Mathematical Formula → Human Approval.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[#4d4d4d]">
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">ISO 10816-4 Citation</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">Delta Derivation</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">Boroscopy VLM</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-[12px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="w-9 h-9 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center text-[#171717]">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">
              Real Enterprise Deliverables & Code Sandbox
            </h3>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              SARA produces real binaries: certified DOCX approval notes, populated XLSX calculation sheets,
              vector PDFs, and verified Python code executed in an air-gapped test sandbox with network disabled.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[#4d4d4d]">
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">.DOCX Generator</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">.XLSX Spreadsheet</span>
              <span className="px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] rounded">Air-Gapped Pytest</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Demonstration Preview Section */}
      <section id="workflows" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-[#ebebeb]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8f8f8f] block mb-2">
              02 // FLAGSHIP WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
              Inspection Report → Analysis → Calculation → Approval Note
            </h2>
          </div>
          <button
            onClick={() => navigate('/approvals')}
            className="mt-4 sm:mt-0 text-xs font-semibold text-[#171717] hover:text-[#0070f3] flex items-center gap-1.5 transition-colors"
          >
            Inspect Approval Gate <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Spec Sheet Preview */}
        <div className="p-6 rounded-[12px] bg-white border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-mono text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebebeb]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#171717] text-white rounded-[4px] font-bold">TASK-1042</span>
              <span className="font-semibold text-[#171717]">Gas Turbine Unit #4B Comprehensive Assessment</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
              HUMAN APPROVAL REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#fafafa] rounded border border-[#ebebeb] space-y-1">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-bold">Finding #1</span>
              <p className="font-semibold text-[#171717]">Bearing 2 Vibration: 5.80 mm/s RMS</p>
              <p className="text-[11px] text-[#4d4d4d]">ISO 10816-4 limit 4.50 mm/s (+28.89% excess)</p>
            </div>
            <div className="p-3 bg-[#fafafa] rounded border border-[#ebebeb] space-y-1">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-bold">Finding #2</span>
              <p className="font-semibold text-[#171717]">Exhaust Spread: 34.2 °C</p>
              <p className="text-[11px] text-[#4d4d4d]">Safety Manual Sec 5.2.1 limit 28.0 °C (+6.2 °C)</p>
            </div>
            <div className="p-3 bg-[#fafafa] rounded border border-[#ebebeb] space-y-1">
              <span className="text-[10px] text-[#8f8f8f] uppercase font-bold">Finding #3</span>
              <p className="font-semibold text-[#171717]">Visual Defect: 4.2mm Crack</p>
              <p className="text-[11px] text-[#4d4d4d]">Stage 1 HP blade root fillet (VLM confirmed)</p>
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] rounded border border-[#ebebeb] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#171717]" />
              <div>
                <span className="font-bold text-[#171717] block">Inspection_Approval_Note.docx</span>
                <span className="text-[10px] text-[#8f8f8f]">Certified binary document ready for lead engineer countersignature</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/approvals')}
              className="px-3 py-1.5 rounded-[6px] bg-[#171717] text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Open Approval Gate
            </button>
          </div>
        </div>
      </section>

      {/* Air-Gap Sovereignty Architecture Comparison */}
      <section id="sovereignty" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-[#ebebeb]">
        <div className="mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8f8f8f] block mb-2">
            03 // DATA PRIVACY GUARANTEE
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#171717]">
            Why sovereign air-gapped AI beats cloud SaaS.
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse bg-white rounded-[12px] border border-[#ebebeb] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <thead>
              <tr className="border-b border-[#ebebeb] text-left text-[#8f8f8f] bg-[#fafafa]">
                <th className="p-3.5 font-bold uppercase">Workload Dimension</th>
                <th className="p-3.5 font-bold uppercase text-[#171717]">SARA Sovereign AI Workbench</th>
                <th className="p-3.5 font-bold uppercase text-[#8f8f8f]">Commercial Cloud AI (OpenAI / Claude)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb] text-[#4d4d4d]">
              <tr>
                <td className="p-3.5 font-semibold text-[#171717]">Data Transmission</td>
                <td className="p-3.5 text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Local Loopback (Zero Egress)
                </td>
                <td className="p-3.5 text-red-500">Public cloud transmission required</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#171717]">Hardware Requirement</td>
                <td className="p-3.5 text-[#171717]">Runs on standard CPU/workstation (Zero GPU required)</td>
                <td className="p-3.5">API reliance / SaaS subscription</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#171717]">Code Execution</td>
                <td className="p-3.5 text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Air-gapped sandbox with network disabled
                </td>
                <td className="p-3.5 text-red-500">Cloud-hosted container or uncontrolled</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#171717]">Human Review Gate</td>
                <td className="p-3.5 text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Section 18 Cryptographic Approval Gate
                </td>
                <td className="p-3.5">Auto-generated responses without signoff</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#171717]">Auditability</td>
                <td className="p-3.5 text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Immutable cryptographic event ledger
                </td>
                <td className="p-3.5">Opaque proprietary server logs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-[#ebebeb] text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#171717] mb-4">
          Ready to experience true organizational sovereignty?
        </h2>
        <p className="text-sm text-[#4d4d4d] max-w-xl mx-auto mb-8 font-normal">
          Log in with pre-configured role presets (Engineer, Manager, Admin) to explore all live features.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 rounded-full bg-[#171717] text-white font-medium text-sm hover:bg-black transition-all inline-flex items-center gap-2 shadow-sm"
        >
          Launch SARA Workbench
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Vercel Minimalist Footer */}
      <footer className="border-t border-[#ebebeb] py-10 px-6 lg:px-12 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#8f8f8f] font-mono gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[3px] bg-[#171717]" />
          <span>SARA Sovereign AI Workbench // SIH26117</span>
        </div>
        <div>
          <span>Designed under Vercel Geist System Guidelines. Private & Air-Gapped by Architecture.</span>
        </div>
      </footer>
    </div>
  )
}
