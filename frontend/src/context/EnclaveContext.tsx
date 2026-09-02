import React, { createContext, useContext, useState } from 'react'
import type { SovereignEnclaveStatus } from '@/types'

interface EnclaveContextType {
  status: SovereignEnclaveStatus
  toggleAirGap: () => void
  refreshAttestation: () => void
}

const initialEnclaveStatus: SovereignEnclaveStatus = {
  enclaveId: 'ENCLAVE-TITAN-X8',
  airGapVerified: true,
  securityState: 'SECURE',
  hsmAttestation: 'FIPS-140-3-VALIDATED',
  cryptographicIntegrity: 100.0,
  activeNodes: 8,
  fipsLevel: 'LEVEL-3',
  lastHeartbeat: '0.4s ago',
}

const EnclaveContext = createContext<EnclaveContextType | undefined>(undefined)

export const EnclaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SovereignEnclaveStatus>(initialEnclaveStatus)

  const toggleAirGap = () => {
    setStatus((prev) => ({
      ...prev,
      airGapVerified: !prev.airGapVerified,
      securityState: !prev.airGapVerified ? 'SECURE' : 'DEGRADED',
    }))
  }

  const refreshAttestation = () => {
    setStatus((prev) => ({
      ...prev,
      lastHeartbeat: 'JUST NOW',
      cryptographicIntegrity: 100.0,
    }))
  }

  return (
    <EnclaveContext.Provider
      value={{
        status,
        toggleAirGap,
        refreshAttestation,
      }}
    >
      {children}
    </EnclaveContext.Provider>
  )
}

export const useEnclave = (): EnclaveContextType => {
  const context = useContext(EnclaveContext)
  if (!context) {
    throw new Error('useEnclave must be used within an EnclaveProvider')
  }
  return context
}
