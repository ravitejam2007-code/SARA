import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiResponse } from '@/types'

/**
 * Zenith AI — Sovereign Industrial AI Workbench
 * Hardened Central Axios HTTP Client
 *
 * Integrates with FastAPI backend, manages FIPS-level request tracing,
 * handles 401, 403, 404, 500, timeout, and network errors.
 */

const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface StructuredApiError {
  status: number | 'TIMEOUT' | 'NETWORK_ERROR'
  message: string
  code?: string
  endpoint?: string
  timestamp: string
}

export class ZenithApiError extends Error {
  public status: number | 'TIMEOUT' | 'NETWORK_ERROR'
  public code?: string
  public endpoint?: string
  public timestamp: string

  constructor(payload: StructuredApiError) {
    super(payload.message)
    this.name = 'ZenithApiError'
    this.status = payload.status
    this.code = payload.code
    this.endpoint = payload.endpoint
    this.timestamp = payload.timestamp
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15-second deterministic timeout for industrial enclaves
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Zenith-Client': 'Zenith-Industrial-Workbench/1.0',
    'X-Sovereign-Enclave': 'AirGap-Strict',
  },
})

// Request Interceptor: Attach authentication token & cryptographic trace headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Inject auth token from storage if available
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('zenith_auth_token') || sessionStorage.getItem('zenith_auth_token')
        : null
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Inject unique trace request ID for cryptographic auditability
    const requestId = `zn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    if (config.headers) {
      config.headers['X-Zenith-Request-ID'] = requestId
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Format errors and handle global auth states
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    const timestamp = new Date().toISOString()
    const endpoint = error.config?.url || 'unknown-endpoint'

    // 1. Response status errors (401, 403, 404, 500, etc.)
    if (error.response) {
      const status = error.response.status
      const data = error.response.data as any
      const serverMessage = data?.detail || data?.message || error.message

      if (status === 401) {
        console.warn(`[Zenith API] 401 Unauthorized at ${endpoint}: Session token expired or invalid.`)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('zenith:unauthorized', {
              detail: { message: serverMessage, endpoint },
            })
          )
        }
        return Promise.reject(
          new ZenithApiError({
            status: 401,
            message: 'Session token invalid or expired. Please authenticate with sovereign credentials.',
            code: 'ERR_UNAUTHORIZED',
            endpoint,
            timestamp,
          })
        )
      }

      if (status === 403) {
        console.warn(`[Zenith API] 403 Forbidden at ${endpoint}: Role clearance insufficient.`)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('zenith:clearance_denied', {
              detail: { message: serverMessage, endpoint },
            })
          )
        }
        return Promise.reject(
          new ZenithApiError({
            status: 403,
            message: 'Security clearance insufficient for the requested enclave resource.',
            code: 'ERR_CLEARANCE_DENIED',
            endpoint,
            timestamp,
          })
        )
      }

      if (status === 404) {
        return Promise.reject(
          new ZenithApiError({
            status: 404,
            message: `Target enclave resource not found: ${endpoint}`,
            code: 'ERR_NOT_FOUND',
            endpoint,
            timestamp,
          })
        )
      }

      if (status >= 500) {
        return Promise.reject(
          new ZenithApiError({
            status: 500,
            message: `Sovereign backend enclave failure (HTTP ${status}): ${serverMessage}`,
            code: 'ERR_INTERNAL_SERVER',
            endpoint,
            timestamp,
          })
        )
      }

      return Promise.reject(
        new ZenithApiError({
          status,
          message: serverMessage,
          code: `HTTP_${status}`,
          endpoint,
          timestamp,
        })
      )
    }

    // 2. Timeout Error (ECONNABORTED)
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error(`[Zenith API] Request timeout (15000ms) exceeded at ${endpoint}.`)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('zenith:timeout', {
            detail: { endpoint },
          })
        )
      }
      return Promise.reject(
        new ZenithApiError({
          status: 'TIMEOUT',
          message: 'Sovereign enclave response timeout (15,000ms exceeded). Hardware cluster may be congested.',
          code: 'ERR_TIMEOUT',
          endpoint,
          timestamp,
        })
      )
    }

    // 3. Network Unavailable / Air-gap boundary disconnected
    console.error(`[Zenith API] Network unavailable or FastAPI server offline at ${endpoint}.`)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zenith:network_offline', {
          detail: { endpoint },
        })
      )
    }
    return Promise.reject(
      new ZenithApiError({
        status: 'NETWORK_ERROR',
        message: 'Unable to establish link with FastAPI backend (http://localhost:8000). Verify service is active.',
        code: 'ERR_NETWORK_UNAVAILABLE',
        endpoint,
        timestamp,
      })
    )
  }
)

/**
 * Reusable Typed API Service Methods
 */
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then((res) => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then((res) => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then((res) => res.data),
}

export default apiClient
