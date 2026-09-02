import React from 'react'
import { Cpu, Lock, Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'

export const EnclaveBanner: React.FC = () => {
  return (
    <div className="w-full bg-slate-950/80 border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono gap-3">
      <div className="flex items-center gap-4">
        <StatusIndicator status="secure" label="SOVEREIGN ENCLAVE" sublabel="TPM 2.0 ATTESTED" />
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            AIR-GAP: <span className="text-emerald-400 font-semibold">STRICT / NO EXFILTRATION</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-amber-400" />
            ISOLATED COMPUTE: <span className="text-slate-300">CLUSTER-ALPHA [04/04]</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Terminal className="w-3 h-3 text-cyan-500" />
          <span className="text-slate-500">SHA256:</span>
          <span className="text-slate-300 font-mono text-[11px]">8f4a...d91c</span>
        </div>
        <Badge variant="cyan" size="sm" dot>
          FIPS 140-3 LEVEL 3
        </Badge>
        <span className="text-[11px] text-slate-500 hidden xl:inline">
          BUILD: 2.4.0-SEC-SOV
        </span>
      </div>
    </div>
  )
}
