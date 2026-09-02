import React, { useState } from 'react'
import {
  Cpu,
  Send,
  Sliders,
  Shield,
  Terminal,
  Paperclip,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const Assistant: React.FC = () => {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-slate-100 uppercase">
              SOVEREIGN INDUSTRIAL ASSISTANT
            </h1>
            <Badge variant="cyan" size="sm" dot>
              AIR-GAP INFERENCE
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Deterministic, air-gapped industrial LLM workbench with zero data exfiltration guarantee.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="emerald" size="md">
            MODEL: ZENITH-ENGINEER-70B-FP8
          </Badge>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setPrompt('')}
          >
            RESET CONTEXT
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left / Center Chat & Prompt Viewport (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="min-h-[460px] flex flex-col justify-between p-0 overflow-hidden">
            {/* Conversation Log Area */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* System Greeting / Enclave Announcement */}
              <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
                    <Terminal className="w-4 h-4" />
                    SOVEREIGN RUNTIME READY // HARDWARE ATTESTATION VALIDATED
                  </div>
                  <Badge variant="cyan" size="sm">
                    FIPS ENCLAVE
                  </Badge>
                </div>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  Zenith Sovereign AI Assistant connected to local air-gapped weights. Ready for industrial
                  schematics analysis, predictive failure modeling, thermodynamics calculations, and PLC logic generation.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center gap-3">
                  <span>CONTEXT LIMIT: 128K</span>
                  <span>|</span>
                  <span>QUANTIZATION: FP8 TENSOR</span>
                  <span>|</span>
                  <span>EXFILTRATION RISK: 0.00%</span>
                </div>
              </div>

              {/* Placeholder conversation message */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="space-y-1 max-w-2xl">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="text-slate-200 font-semibold">ZENITH-ENGINEER</span>
                    <span>14:02 UTC</span>
                  </div>
                  <div className="p-4 rounded-md bg-slate-900 border border-slate-800 text-sm font-sans text-slate-200 leading-relaxed">
                    Sovereign model loaded in secure enclave memory. Awaiting telemetry inputs or engineering queries.
                    Frontend foundation established with secure API interface ready for endpoint integration.
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Input Form */}
            <div className="p-4 bg-[#090d16] border-t border-slate-800">
              <div className="relative flex items-center">
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter industrial engineering prompt, telemetry query, or CAD specification..."
                  className="w-full rounded-md bg-slate-950 border border-slate-800 p-3 pr-28 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                />
                <div className="absolute right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Attach Engineering Spec"
                    className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    RUN
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
                <span>PRESS SHIFT+ENTER FOR NEW LINE</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  SESSION LOCALLY ENCRYPTED
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Settings & Model Parameters Panel (1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                MODEL PARAMETERS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>TEMPERATURE</span>
                  <span className="text-cyan-400">0.15 (DETERMINISTIC)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-1.5 w-[15%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>MAX TOKENS</span>
                  <span className="text-cyan-400">4,096</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-1.5 w-[50%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>TOP-P</span>
                  <span className="text-cyan-400">0.90</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-1.5 w-[90%]" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-slate-400 uppercase text-[10px]">ACTIVE GUARDRAILS</span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>IP / Patent Isolation</span>
                    <span>ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Export Control (ITAR)</span>
                    <span>ENFORCED</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Hardware Safety Bounds</span>
                    <span>LOCKED</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                SOVEREIGN CAPABILITIES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>CAD Schematics & STEP Parser</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>PLC IEC 61131-3 Code Generation</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Failure Mode & Effects Analysis</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Assistant
