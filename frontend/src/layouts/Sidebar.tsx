import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Cpu,
  FileText,
  Database,
  GitBranch,
  Package,
  ShieldCheck,
  ScrollText,
  Radio,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useEnclave } from '@/hooks/useEnclave'
import { cn } from '@/utils/cn'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: 'cyan' | 'emerald' | 'amber'
  description: string
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'System telemetry & cluster state',
  },
  {
    name: 'AI Assistant',
    path: '/assistant',
    icon: Cpu,
    badge: 'ONLINE',
    badgeVariant: 'cyan',
    description: 'Sovereign industrial LLM models',
  },
  {
    name: 'Documents',
    path: '/documents',
    icon: FileText,
    badge: '142',
    description: 'Technical specs & CAD manuals',
  },
  {
    name: 'Knowledge Base',
    path: '/knowledge-base',
    icon: Database,
    description: 'Proprietary industrial ontologies',
  },
  {
    name: 'Workflows',
    path: '/workflows',
    icon: GitBranch,
    badge: '3 ACTIVE',
    badgeVariant: 'amber',
    description: 'Automated engineering pipelines',
  },
  {
    name: 'Deliverables',
    path: '/deliverables',
    icon: Package,
    description: 'Exported reports & compliance specs',
  },
  {
    name: 'Security & Enclave',
    path: '/security',
    icon: ShieldCheck,
    badge: 'HSM',
    badgeVariant: 'emerald',
    description: 'Hardware isolation & zero-trust',
  },
  {
    name: 'Audit Logs',
    path: '/audit-logs',
    icon: ScrollText,
    description: 'Immutable cryptographic trail',
  },
  {
    name: 'UI Design System',
    path: '/design-system',
    icon: Layers,
    badge: 'UI KIT',
    badgeVariant: 'cyan',
    description: 'Reusable atomic components',
  },
]

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { status } = useEnclave()

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col bg-[#0b101b] border-r border-slate-800/90 transition-all duration-300 select-none shrink-0',
          collapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/90 bg-[#090d16]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/20">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>

            {!collapsed && (
              <div className="flex flex-col leading-none truncate">
                <span className="font-mono font-bold text-sm tracking-wider text-slate-100 flex items-center gap-1.5">
                  ZENITH<span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mt-0.5 truncate">
                  SOVEREIGN WORKBENCH
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Enclave Quick Status Indicator */}
        <div className="px-3 py-2.5 border-b border-slate-800/60 bg-slate-900/40">
          {!collapsed ? (
            <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-semibold text-slate-200">
                    AIR-GAP ACTIVE
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {status.enclaveId}
                  </span>
                </div>
              </div>
              <Badge variant="emerald" size="sm">
                SECURE
              </Badge>
            </div>
          ) : (
            <div className="flex justify-center" title="Sovereign Enclave: Secure">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          <div className="px-2 mb-2">
            {!collapsed && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                SYSTEM MODULES
              </p>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-mono transition-all group relative',
                    isActive
                      ? 'bg-slate-800/90 text-cyan-300 font-semibold border-l-2 border-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 hover:bg-slate-900/60'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant || 'default'}
                        size="sm"
                        className="text-[10px] py-0 px-1.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Tooltip on collapsed hover */}
                {collapsed && (
                  <div className="hidden group-hover:block absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-slate-100 text-xs font-mono rounded shadow-lg border border-slate-700 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer / System Hardware Status */}
        <div className="p-3 border-t border-slate-800/90 bg-[#090d16]">
          {!collapsed ? (
            <div className="space-y-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  ISOLATION
                </span>
                <span className="text-emerald-400 font-bold">100%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div className="bg-cyan-500 h-1 rounded-full w-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>NODES: 08/08</span>
                <span>HW: INTEL SGX2</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Isolation 100%">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
