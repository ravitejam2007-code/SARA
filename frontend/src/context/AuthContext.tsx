import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '@/services/authApi'
import type { UserProfile, UserRole, AuthCredentials } from '@/types'

export interface AuthContextType {
  user: UserProfile | null
  role: UserRole | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isSessionExpired: boolean
  login: (credentials: AuthCredentials, rememberMe?: boolean) => Promise<void>
  logout: () => void
  dismissSessionExpired: () => void
  simulateSessionExpired: () => void
}

// Pre-configured sovereign demo accounts for all 4 roles
export const DEMO_USERS: Record<UserRole, UserProfile & { defaultPassword: string }> = {
  Engineer: {
    id: 'usr-zn-eng-101',
    username: 'engineer',
    name: 'Dr. Kai Chen',
    email: 'k.chen@zenith-industrial.sec',
    callsign: 'ENG-KAI-CHEN',
    role: 'Engineer',
    clearanceLevel: 'LEVEL-2 (TECHNICAL SPECIALIST)',
    terminalId: 'NODE-WS-02',
    defaultPassword: 'password123',
  },
  Manager: {
    id: 'usr-zn-mgr-204',
    username: 'manager',
    name: 'Sarah Connor',
    email: 's.connor@zenith-industrial.sec',
    callsign: 'MGR-SARAH-CONNOR',
    role: 'Manager',
    clearanceLevel: 'LEVEL-3 (OPERATIONS LEAD)',
    terminalId: 'NODE-MGR-01',
    defaultPassword: 'password123',
  },
  Admin: {
    id: 'usr-zn-adm-901',
    username: 'admin',
    name: 'Elena Vance',
    email: 'e.vance@zenith-industrial.sec',
    callsign: 'COMMANDER-VANCE',
    role: 'Admin',
    clearanceLevel: 'LEVEL-4 (TOP SECRET / RESTRICTED)',
    terminalId: 'NODE-ENCLAVE-01',
    defaultPassword: 'password123',
  },
  Auditor: {
    id: 'usr-zn-aud-007',
    username: 'auditor',
    name: 'Marcus Holt',
    email: 'm.holt@zenith-industrial.sec',
    callsign: 'AUDIT-INSPECTOR-HOLT',
    role: 'Auditor',
    clearanceLevel: 'LEVEL-3 (INDEPENDENT VERIFICATION)',
    terminalId: 'NODE-AUDIT-03',
    defaultPassword: 'password123',
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'zenith_auth_token'
const USER_KEY = 'zenith_auth_user'
const REMEMBER_KEY = 'zenith_auth_remember'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false)

  // Initialize session from storage
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem(REMEMBER_KEY) === 'true'
      const storage = isRemembered ? localStorage : sessionStorage

      const savedToken = storage.getItem(TOKEN_KEY)
      const savedUser = storage.getItem(USER_KEY)

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } else {
        // Default to Admin for immediate initial exploration if no session is set
        const defaultAdmin = DEMO_USERS.Admin
        const defaultToken = 'sov_tok_' + Date.now()
        localStorage.setItem(TOKEN_KEY, defaultToken)
        localStorage.setItem(USER_KEY, JSON.stringify(defaultAdmin))
        localStorage.setItem(REMEMBER_KEY, 'true')
        setToken(defaultToken)
        setUser(defaultAdmin)
      }
    } catch (e) {
      console.error('[Zenith Auth] Failed to restore session from storage:', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Listen for unauthorized events emitted by API client or session timer
  useEffect(() => {
    const handleUnauthorized = () => {
      console.warn('[Zenith Auth] Received unauthorized/expired event. Triggering session expiry.')
      setIsSessionExpired(true)
      // Clear tokens
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
      setToken(null)
      setUser(null)
    }

    window.addEventListener('zenith:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('zenith:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = useCallback(
    async (credentials: AuthCredentials, rememberMe = true): Promise<void> => {
      setIsLoading(true)
      setIsSessionExpired(false)

      try {
        const authResponse = await authApi.login(credentials)

        const input = credentials.username.trim().toLowerCase()

        // Match against predefined demo roles or fallback
        let matchedUser: UserProfile = DEMO_USERS.Admin

        if (input.includes('engineer') || input.includes('kai')) {
          matchedUser = DEMO_USERS.Engineer
        } else if (input.includes('manager') || input.includes('sarah')) {
          matchedUser = DEMO_USERS.Manager
        } else if (input.includes('auditor') || input.includes('marcus') || input.includes('holt')) {
          matchedUser = DEMO_USERS.Auditor
        } else if (input.includes('admin') || input.includes('vance')) {
          matchedUser = DEMO_USERS.Admin
        } else {
          // Dynamic user with Admin role fallback
          matchedUser = {
            id: authResponse.user?.id || `usr-zn-${Date.now().toString(36)}`,
            username: credentials.username,
            name: authResponse.user?.name || credentials.username,
            email: authResponse.user?.email || `${credentials.username}@zenith-industrial.sec`,
            callsign: credentials.username.toUpperCase(),
            role: authResponse.user?.role || 'Admin',
            clearanceLevel: 'LEVEL-4 (TOP SECRET / RESTRICTED)',
            terminalId: 'NODE-FASTAPI-01',
          }
        }

        const generatedToken = authResponse.token || `sov_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        // Choose storage target based on Remember Me option
        const targetStorage = rememberMe ? localStorage : sessionStorage
        const alternateStorage = rememberMe ? sessionStorage : localStorage

        alternateStorage.removeItem(TOKEN_KEY)
        alternateStorage.removeItem(USER_KEY)
        localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false')

        targetStorage.setItem(TOKEN_KEY, generatedToken)
        targetStorage.setItem(USER_KEY, JSON.stringify(matchedUser))

        setToken(generatedToken)
        setUser(matchedUser)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setIsSessionExpired(false)
  }, [])

  const dismissSessionExpired = useCallback(() => {
    setIsSessionExpired(false)
  }, [])

  const simulateSessionExpired = useCallback(() => {
    window.dispatchEvent(new CustomEvent('zenith:unauthorized'))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isSessionExpired,
        login,
        logout,
        dismissSessionExpired,
        simulateSessionExpired,
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
