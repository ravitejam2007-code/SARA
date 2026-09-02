import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (callsign: string) => void
  logout: () => void
}

const defaultUser: UserProfile = {
  id: 'usr-zn-9041',
  callsign: 'COMMANDER-VANCE',
  name: 'Elena Vance',
  email: 'e.vance@zenith-industrial.sec',
  role: 'SOVEREIGN_ADMIN',
  clearanceLevel: 'LEVEL-4 (TOP SECRET / RESTRICTED)',
  terminalId: 'NODE-ENCLAVE-01',
  sessionExpiresAt: '08:00:00 UTC',
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('zenith_auth_profile')
    return stored ? JSON.parse(stored) : defaultUser
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('zenith_auth_profile', JSON.stringify(user))
    } else {
      localStorage.removeItem('zenith_auth_profile')
      localStorage.removeItem('zenith_auth_token')
    }
  }, [user])

  const login = (callsign: string) => {
    const newUser: UserProfile = {
      ...defaultUser,
      callsign: callsign.toUpperCase(),
    }
    setUser(newUser)
    localStorage.setItem('zenith_auth_token', 'sov_token_' + Date.now())
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
