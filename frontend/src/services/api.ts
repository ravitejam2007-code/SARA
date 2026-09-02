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
 * Reusable Axios HTTP Client
 *
 * Configured with environment-based Base URL, zero-trust cryptographic request tagging,
 * authentication interceptors, and typed response handling.
 */

// Retrieve base URL from environment or default to local sovereign enclave endpoint
const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('zenith_auth_token') : null
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
    if (error.response) {
      const status = error.response.status

      // Handle session expiration / unauthorized access in sovereign environment
      if (status === 401) {
        console.warn('[Zenith API] Session token invalid or expired. Redirecting to sovereign login.')
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          // Allow application state or router to handle redirect
          window.dispatchEvent(new CustomEvent('zenith:unauthorized'))
        }
      }

      if (status === 403) {
        console.error('[Zenith API] Clearance violation: Access denied to requested enclave resource.')
      }
    } else if (error.request) {
      console.error('[Zenith API] Enclave connection timeout or air-gap unreachable.')
    } else {
      console.error('[Zenith API] Network initialization error:', error.message)
    }

    return Promise.reject(error)
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

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then((res) => res.data),
}

export default api
