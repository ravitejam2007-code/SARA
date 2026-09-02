import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import type { UserRole } from '@/types'

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  children?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // 1. Show loading state during session restoration / authentication check
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 space-y-4 font-mono">
        <Spinner size="lg" variant="info" />
        <div className="text-xs text-text-secondary uppercase tracking-wider">
          VERIFYING SOVEREIGN ENCLAVE CLEARANCE...
        </div>
      </div>
    )
  }

  // 2. Redirect to Login if unauthenticated, preserving destination
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Check role access boundary if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-6 space-y-5 font-mono">
        <div className="p-4 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-400">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-lg">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="warning" size="sm">
              CLEARANCE RESTRICTED
            </Badge>
            <Badge variant="default" size="sm">
              ACTIVE ROLE: {user.role.toUpperCase()}
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-text-primary uppercase tracking-wide">
            ACCESS OUTSIDE ROLE SCOPE
          </h2>

          <p className="text-xs text-text-secondary leading-relaxed">
            Your current assigned role ({user.role}) does not have view clearance for this module.
            Required roles: {allowedRoles.join(', ')}.
          </p>

          <div className="p-3 rounded bg-surface-sunken border border-border text-[11px] text-text-muted mt-2">
            NOTICE: This frontend boundary is a navigational guide. Backend microservices and hardware enclaves remain the authoritative enforcement layer.
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            RETURN TO DASHBOARD
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<LogIn className="w-4 h-4" />}
            onClick={() => navigate('/login')}
          >
            SWITCH ROLE
          </Button>
        </div>
      </div>
    )
  }

  // 4. Render protected content or outlet
  return <>{children}</>
}

export default ProtectedRoute
