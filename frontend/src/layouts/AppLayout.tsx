import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { EnclaveBanner } from '@/components/EnclaveBanner'
import { useToast } from '@/components/ui/Toast'

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleClearanceDenied = (e: Event) => {
      const custom = e as CustomEvent<{ message: string; endpoint: string }>
      toast.error('Clearance Denied', custom.detail?.message || 'Access restricted by sovereign policy.')
    }

    const handleNetworkOffline = (e: Event) => {
      const custom = e as CustomEvent<{ endpoint: string }>
      toast.warning('FastAPI Offline', `Endpoint ${custom.detail?.endpoint || ''} unreachable. Operating in SIH demo mode.`)
    }

    const handleTimeout = () => {
      toast.error('Enclave Timeout', 'Hardware enclave response exceeded 15,000ms threshold.')
    }

    window.addEventListener('zenith:clearance_denied', handleClearanceDenied)
    window.addEventListener('zenith:network_offline', handleNetworkOffline)
    window.addEventListener('zenith:timeout', handleTimeout)

    return () => {
      window.removeEventListener('zenith:clearance_denied', handleClearanceDenied)
      window.removeEventListener('zenith:network_offline', handleNetworkOffline)
      window.removeEventListener('zenith:timeout', handleTimeout)
    }
  }, [toast])

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev)
  }

  const handleToggleMobile = () => {
    setMobileOpen((prev) => !prev)
  }

  const handleCloseMobile = () => {
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Sovereign Enclave Security Posture Banner */}
      <EnclaveBanner />

      <div className="flex-1 flex w-full relative">
        {/* Reusable Industrial Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobile}
        />

        {/* Main Content Area Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Reusable Industrial Header */}
          <Header onToggleMobile={handleToggleMobile} />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/30 via-[#080b12] to-[#080b12]">
            <div className="max-w-7xl mx-auto w-full space-y-6">
              <Outlet />
            </div>
          </main>

          {/* Industrial Terminal Footer */}
          <footer className="py-2.5 px-6 border-t border-slate-800/80 bg-[#090d16] text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold">ZENITH INDUSTRIAL AI OS</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">ISOLATION: SECURE SGX2</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">NETWORK: AIR-GAPPED AIR-01</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>ACTIVE ENCLAVE: ENCLAVE-TITAN-X8</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-medium">CRYPTOGRAPHIC AUDIT: 100% VERIFIED</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
