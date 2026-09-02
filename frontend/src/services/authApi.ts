import { apiClient } from './api'
import { isDemoModeActive } from '@/utils/demoMode'
import type { AuthCredentials, User, UserRole } from '@/types'

/**
 * Zenith AI — Authentication API Module
 * Connects with FastAPI /auth endpoints with demo fallback when enabled.
 */

export interface LoginResponse {
  token: string
  user: User
}

const DEMO_USERS: Record<string, { user: User; role: UserRole }> = {
  engineer: {
    user: {
      id: 'u-eng-01',
      username: 'engineer',
      name: 'Ravi (Chief Eng)',
      email: 'ravi@zenith-ai.local',
      callsign: 'ENG-RAVI',
      role: 'Engineer',
      clearanceLevel: 'LEVEL-2 (TECHNICAL SPECIALIST)',
      terminalId: 'NODE-WS-02',
    },
    role: 'Engineer',
  },
  manager: {
    user: {
      id: 'u-mgr-01',
      username: 'manager',
      name: 'Sarah Connor',
      email: 'sarah.connor@zenith-ai.local',
      callsign: 'MGR-SARAH-CONNOR',
      role: 'Manager',
      clearanceLevel: 'LEVEL-3 (OPERATIONS LEAD)',
      terminalId: 'NODE-MGR-01',
    },
    role: 'Manager',
  },
  admin: {
    user: {
      id: 'u-adm-01',
      username: 'admin',
      name: 'Admin Vance',
      email: 'admin.vance@zenith-ai.local',
      callsign: 'ADM-VANCE',
      role: 'Admin',
      clearanceLevel: 'LEVEL-4 (TOP SECRET / RESTRICTED)',
      terminalId: 'NODE-ADMIN-01',
    },
    role: 'Admin',
  },
  auditor: {
    user: {
      id: 'u-aud-01',
      username: 'auditor',
      name: 'Marcus Holt',
      email: 'marcus.holt@zenith-ai.local',
      callsign: 'AUD-MARCUS-HOLT',
      role: 'Auditor',
      clearanceLevel: 'LEVEL-3 (REGULATORY COMPLIANCE)',
      terminalId: 'NODE-AUDIT-01',
    },
    role: 'Auditor',
  },
}

export const authApi = {
  /**
   * Authenticate against FastAPI backend with username and password
   */
  async login(credentials: AuthCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username: credentials.username,
        password: credentials.password,
      })
      return response.data
    } catch (err) {
      if (!isDemoModeActive()) {
        // Strict production mode: propagate real error
        throw err
      }

      // SIH Demo Mode fallback
      await new Promise((r) => setTimeout(r, 300))
      const lowerUser = credentials.username.toLowerCase()
      const roleKey = Object.keys(DEMO_USERS).find((k) => lowerUser.includes(k)) || 'engineer'
      const match = DEMO_USERS[roleKey]

      return {
        token: `demo-jwt-${Date.now()}-${match.role.toLowerCase()}`,
        user: match.user,
      }
    }
  },

  /**
   * Terminate active session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Best-effort logout notification
    }
  },

  /**
   * Validate token and fetch current operator profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
}
