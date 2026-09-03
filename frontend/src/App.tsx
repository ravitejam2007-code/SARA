import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { EnclaveProvider } from '@/context/EnclaveContext'
import { ToastProvider } from '@/components/ui/Toast'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Page Components
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Assistant } from '@/pages/Assistant'
import { Documents } from '@/pages/Documents'
import { KnowledgeBase } from '@/pages/KnowledgeBase'
import { Workflows } from '@/pages/Workflows'
import { Deliverables } from '@/pages/Deliverables'
import { Approvals } from '@/pages/Approvals'
import { Security } from '@/pages/Security'
import { AuditLogs } from '@/pages/AuditLogs'
import { ComponentShowcase } from '@/pages/ComponentShowcase'
import { NotFound } from '@/pages/NotFound'

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <EnclaveProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Sovereign Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* Standalone Sovereign Authentication Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Workbench Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* All Roles */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Engineer, Manager, Admin */}
                <Route
                  path="/assistant"
                  element={
                    <ProtectedRoute allowedRoles={['Engineer', 'Manager', 'Admin']}>
                      <Assistant />
                    </ProtectedRoute>
                  }
                />

                {/* All Roles (Read-only views for Auditor) */}
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute allowedRoles={['Engineer', 'Manager', 'Admin', 'Auditor']}>
                      <Documents />
                    </ProtectedRoute>
                  }
                />

                {/* Engineer, Manager, Admin */}
                <Route
                  path="/knowledge-base"
                  element={
                    <ProtectedRoute allowedRoles={['Engineer', 'Manager', 'Admin']}>
                      <KnowledgeBase />
                    </ProtectedRoute>
                  }
                />

                {/* Manager, Admin */}
                <Route
                  path="/workflows"
                  element={
                    <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                      <Workflows />
                    </ProtectedRoute>
                  }
                />

                {/* Engineer, Manager, Admin, Auditor */}
                <Route
                  path="/deliverables"
                  element={
                    <ProtectedRoute allowedRoles={['Engineer', 'Manager', 'Admin', 'Auditor']}>
                      <Deliverables />
                    </ProtectedRoute>
                  }
                />

                {/* Human Approval Gate (Engineer, Manager, Admin) */}
                <Route
                  path="/approvals"
                  element={
                    <ProtectedRoute allowedRoles={['Engineer', 'Manager', 'Admin']}>
                      <Approvals />
                    </ProtectedRoute>
                  }
                />

                {/* Admin, Auditor */}
                <Route
                  path="/security"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Auditor']}>
                      <Security />
                    </ProtectedRoute>
                  }
                />

                {/* Admin, Auditor */}
                <Route
                  path="/audit-logs"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Auditor']}>
                      <AuditLogs />
                    </ProtectedRoute>
                  }
                />

                {/* UI Design System Showcase (All Authenticated Users) */}
                <Route path="/design-system" element={<ComponentShowcase />} />

                {/* Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </EnclaveProvider>
    </AuthProvider>
  )
}

export default App
