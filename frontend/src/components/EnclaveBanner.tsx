import React from 'react'
import { Cpu, Lock, Terminal } from 'lucide-react'

export const EnclaveBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#171717] text-white px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono gap-3 border-b border-[#2e2e2e]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider text-[11px] uppercase">
            SARA SOVEREIGN ENCLAVE
          </span>
          <span className="text-[#8f8f8f] text-[10px]">// TPM 2.0 ATTESTED</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[#a1a1a1] text-[11px]">
          <span className="text-[#4d4d4d]">|</span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            AIR-GAP: <span className="text-emerald-400 font-medium">0 OUTBOUND EGRESS</span>
          </span>
          <span className="text-[#4d4d4d]">|</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#d4d4d4]" />
            COMPUTE: <span className="text-white">ON-PREMISE CPU (ZERO-GPU REQ.)</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-[#8f8f8f]">
          <Terminal className="w-3 h-3 text-[#8f8f8f]" />
          <span>SHA256:</span>
          <span className="text-white font-mono text-[10px]">8f4a...d91c</span>
        </div>
        <span className="px-2 py-0.5 rounded-[4px] bg-white/10 text-white text-[10px] font-bold border border-white/20">
          FIPS 140-3
        </span>
        <span className="text-[10px] text-[#8f8f8f] hidden xl:inline">
          SIH26117
        </span>
      </div>
    </div>
  )
}
