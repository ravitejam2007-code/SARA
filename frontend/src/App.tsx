import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { EnclaveProvider } from '@/context/EnclaveContext'
import { AppLayout } from '@/layouts/AppLayout'

// Page Components
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Assistant } from '@/pages/Assistant'
import { Documents } from '@/pages/Documents'
import { KnowledgeBase } from '@/pages/KnowledgeBase'
import { Workflows } from '@/pages/Workflows'
import { Deliverables } from '@/pages/Deliverables'
import { Security } from '@/pages/Security'
import { AuditLogs } from '@/pages/AuditLogs'
import { NotFound } from '@/pages/NotFound'

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <EnclaveProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Sovereign Authentication Route */}
            <Route path="/login" element={<Login />} />

            {/* Industrial Workbench Layout Wrapped Routes */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/deliverables" element={<Deliverables />} />
              <Route path="/security" element={<Security />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EnclaveProvider>
    </AuthProvider>
  )
}

export default App
