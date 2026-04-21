import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const auth = useAuthStore()
  auth.hydrate()

  if (!auth.token) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (!auth.user) {
    const { refreshMe } = useAuth()
    const user = await refreshMe()
    if (!user) {
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
})
