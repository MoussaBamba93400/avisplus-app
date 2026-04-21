/**
 * On client boot, rehydrate any persisted auth token and fetch the user.
 */
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  auth.hydrate()

  if (auth.token && !auth.user) {
    const { refreshMe } = useAuth()
    await refreshMe()
  }
})
