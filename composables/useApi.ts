import type { FetchOptions, FetchResponse } from 'ofetch'
import { useAuthStore } from '~/stores/auth'

/**
 * Thin wrapper around `$fetch` that automatically injects the API base URL,
 * the JWT bearer token, and the active business ID header.
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit | undefined)
      headers.set('Accept', 'application/json')
      if (auth.token) headers.set('Authorization', `Bearer ${auth.token}`)
      if (auth.activeBusinessId) headers.set('X-Business-ID', String(auth.activeBusinessId))
      options.headers = headers
    },
    onResponseError({ response }: { response: FetchResponse<unknown> }) {
      if (response.status === 401) {
        auth.clear()
        if (import.meta.client && !['/login', '/register', '/'].includes(useRoute().path)) {
          navigateTo('/login')
        }
      }
    },
  })

  return {
    get:    <T = unknown>(url: string, opts?: FetchOptions<'json'>) =>
      apiFetch<T>(url, { ...opts, method: 'GET' }),
    post:   <T = unknown>(url: string, body?: unknown, opts?: FetchOptions<'json'>) =>
      apiFetch<T>(url, { ...opts, method: 'POST', body: body as Record<string, unknown> }),
    patch:  <T = unknown>(url: string, body?: unknown, opts?: FetchOptions<'json'>) =>
      apiFetch<T>(url, { ...opts, method: 'PATCH', body: body as Record<string, unknown> }),
    put:    <T = unknown>(url: string, body?: unknown, opts?: FetchOptions<'json'>) =>
      apiFetch<T>(url, { ...opts, method: 'PUT', body: body as Record<string, unknown> }),
    delete: <T = unknown>(url: string, opts?: FetchOptions<'json'>) =>
      apiFetch<T>(url, { ...opts, method: 'DELETE' }),
    raw: apiFetch,
  }
}
