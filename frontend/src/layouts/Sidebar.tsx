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
  ClipboardCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useEnclave } from '@/hooks/useEnclave'
import type { UserRole } from '@/types'
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
  allowedRoles: UserRole[]
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'System telemetry & cluster state',
    allowedRoles: ['Engineer', 'Manager', 'Admin', 'Auditor'],
  },
  {
    name: 'AI Assistant',
    path: '/assistant',
    icon: Cpu,
    badge: 'ONLINE',
    badgeVariant: 'cyan',
    description: 'Sovereign industrial LLM models',
    allowedRoles: ['Engineer', 'Manager', 'Admin'],
  },
  {
    name: 'Documents',
    path: '/documents',
    icon: FileText,
    badge: '142',
    description: 'Technical specs & CAD manuals',
    allowedRoles: ['Engineer', 'Manager', 'Admin', 'Auditor'],
  },
  {
    name: 'Knowledge Base',
    path: '/knowledge-base',
    icon: Database,
    description: 'Proprietary industrial ontologies',
    allowedRoles: ['Engineer', 'Manager', 'Admin'],
  },
  {
    name: 'Workflows',
    path: '/workflows',
    icon: GitBranch,
    badge: '3 ACTIVE',
    badgeVariant: 'amber',
    description: 'Automated engineering pipelines',
    allowedRoles: ['Manager', 'Admin'],
  },
  {
    name: 'Deliverables',
    path: '/deliverables',
    icon: Package,
    description: 'Exported reports & compliance specs',
    allowedRoles: ['Engineer', 'Manager', 'Admin', 'Auditor'],
  },
  {
    name: 'Approvals',
    path: '/approvals',
    icon: ClipboardCheck,
    badge: 'GATE',
    badgeVariant: 'amber',
    description: 'Human review & countersignature',
    allowedRoles: ['Engineer', 'Manager', 'Admin'],
  },
  {
    name: 'Security & Enclave',
    path: '/security',
    icon: ShieldCheck,
    badge: 'HSM',
    badgeVariant: 'emerald',
    description: 'Hardware isolation & zero-trust',
    allowedRoles: ['Admin', 'Auditor'],
  },
  {
    name: 'Audit Logs',
    path: '/audit-logs',
    icon: ScrollText,
    description: 'Immutable cryptographic trail',
    allowedRoles: ['Admin', 'Auditor'],
  },
  {
    name: 'UI Design System',
    path: '/design-system',
    icon: Layers,
    badge: 'UI KIT',
    badgeVariant: 'cyan',
    description: 'Reusable atomic components',
    allowedRoles: ['Engineer', 'Manager', 'Admin', 'Auditor'],
  },
]

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user } = useAuth()
  const { status } = useEnclave()

  // Filter navigation items based on current active user role
  const filteredNavItems = navItems.filter((item) =>
    user ? item.allowedRoles.includes(user.role) : false
  )

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
          'fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col bg-white border-r border-[#ebebeb] transition-all duration-300 select-none shrink-0',
          collapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#ebebeb] bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Layers className="w-4 h-4" />
            </div>

            {!collapsed && (
              <div className="flex flex-col leading-none truncate">
                <span className="font-mono font-bold text-sm tracking-wider text-[#171717] flex items-center gap-1.5">
                  SARA<span className="text-[#0070f3]">.AI</span>
                </span>
                <span className="text-[10px] font-mono text-[#8f8f8f] tracking-widest uppercase mt-0.5 truncate">
                  SOVEREIGN WORKBENCH
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-[6px] text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Enclave Quick Status Indicator & Active Role Badge */}
        <div className="px-3 py-2.5 border-b border-[#ebebeb] bg-[#fafafa]">
          {!collapsed ? (
            <div className="p-2.5 rounded-[6px] bg-white border border-[#ebebeb] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-semibold text-[#171717]">
                    AIR-GAP ACTIVE
                  </span>
                  <span className="text-[9px] font-mono text-[#8f8f8f]">
                    {status.enclaveId}
                  </span>
                </div>
              </div>
              {user && (
                <span className="px-2 py-0.5 rounded-[4px] bg-[#f5f5f5] border border-[#ebebeb] text-[10px] font-mono font-bold text-[#171717]">
                  {user.role.toUpperCase()}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-center" title={`Enclave: Secure | Role: ${user?.role || 'Guest'}`}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Navigation Items List (Role-Filtered) */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          <div className="px-2 mb-2">
            {!collapsed && (
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8f8f8f] font-semibold">
                <span>MODULES</span>
                {user && <span className="text-[#171717] font-bold">{user.role} VIEW</span>}
              </div>
            )}
          </div>

          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-mono transition-all group relative',
                    isActive
                      ? 'bg-[#171717] text-white font-medium shadow-sm'
                      : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-[#f5f5f5]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-white" : "text-[#8f8f8f]")} />

                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className={cn("text-[9px] font-bold py-0.5 px-1.5 rounded-[4px]", isActive ? "bg-white/20 text-white" : "bg-[#f5f5f5] text-[#171717] border border-[#ebebeb]")}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tooltip on collapsed hover */}
                    {collapsed && (
                      <div className="hidden group-hover:block absolute left-full ml-2 px-2.5 py-1 bg-white text-[#171717] text-xs font-mono rounded-[6px] shadow-lg border border-[#ebebeb] whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer / System Hardware Status */}
        <div className="p-3 border-t border-[#ebebeb] bg-[#fafafa]">
          {!collapsed ? (
            <div className="space-y-2 text-[11px] font-mono text-[#4d4d4d]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#8f8f8f]">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  CLEARANCE
                </span>
                <span className="font-bold text-[#171717]">FIPS 140-3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8f8f8f]">INFERENCE</span>
                <span className="text-emerald-700 font-bold">100% LOCAL</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-[#8f8f8f]">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
