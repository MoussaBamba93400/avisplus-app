import { useAuthStore, type Business, type User } from '~/stores/auth'

interface LoginPayload { email: string; password: string }
interface RegisterPayload { name: string; email: string; password: string; password_confirmation: string }

interface AuthResponse {
  user: User
  token: string
  token_type: 'bearer'
  expires_in: number
}

interface MeResponse { user: User; businesses: Business[] }

export const useAuth = () => {
  const auth = useAuthStore()
  const api = useApi()

  const login = async (payload: LoginPayload) => {
    const { user, token } = await api.post<AuthResponse>('/auth/login', payload)
    auth.setSession({ user, token })
    await refreshMe()
    return user
  }

  const register = async (payload: RegisterPayload) => {
    const { user, token } = await api.post<AuthResponse>('/auth/register', payload)
    auth.setSession({ user, token })
    await refreshMe()
    if (!auth.businesses.length) {
      await navigateTo('/onboarding')
    }
    return user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch { /* ignore — we clear locally regardless */ }
    auth.clear()
    await navigateTo('/login')
  }

  const refreshMe = async () => {
    if (!auth.token) return null
    try {
      const { user, businesses } = await api.get<MeResponse>('/auth/me')
      auth.setSession({ user, token: auth.token })
      auth.setBusinesses(businesses)
      return user
    } catch {
      auth.clear()
      return null
    }
  }

  /**
   * Échange le JWT courant contre un nouveau (sans demander les credentials).
   * À appeler avant l'expiration ou à la suite d'un 401 si on veut tenter
   * une récupération avant de rediriger vers /login.
   */
  const refreshToken = async () => {
    if (!auth.token) return null
    try {
      const { user, token } = await api.post<AuthResponse>('/auth/refresh')
      auth.setSession({ user, token })
      return token
    } catch {
      auth.clear()
      return null
    }
  }

  return { login, register, logout, refreshMe, refreshToken }
}
