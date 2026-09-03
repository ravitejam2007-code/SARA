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
    <div className="min-h-screen bg-[#fafafa] text-[#171717] flex flex-col font-sans selection:bg-[#171717] selection:text-white">
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#fafafa]">
            <div className="max-w-7xl mx-auto w-full space-y-6">
              <Outlet />
            </div>
          </main>

          {/* Vercel Geist Minimalist Footer */}
          <footer className="py-2.5 px-6 border-t border-[#ebebeb] bg-white text-[11px] font-mono text-[#8f8f8f] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[#171717] font-semibold">SARA SOVEREIGN WORKBENCH</span>
              <span className="text-[#d4d4d4]">|</span>
              <span>ISOLATION: AIR-GAPPED HARDWARE</span>
              <span className="text-[#d4d4d4]">|</span>
              <span className="text-emerald-700 font-medium">NETWORK: 0 EGRESS (BLOCKED)</span>
            </div>
            <div className="flex items-center gap-4 text-[#8f8f8f]">
              <span>ACTIVE ENCLAVE: ENCLAVE-SEC-01</span>
              <span className="text-[#d4d4d4]">|</span>
              <span className="text-[#171717] font-medium">FIPS 140-3 VERIFIED</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
