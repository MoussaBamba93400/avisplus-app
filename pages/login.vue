<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Connexion — Avis+' })

const { login } = useAuth()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

const submit = async () => {
  loading.value = true
  error.value = null
  try {
    await login({ email: form.email, password: form.password })
    const redirect = (route.query.redirect as string) || '/dashboard'
    await navigateTo(redirect)
  } catch (e) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg || 'Identifiants invalides.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <div class="mb-6 text-center">
        <NuxtLink to="/" class="text-2xl font-bold text-brand-700">
          Avis<span class="text-brand-500">+</span>
        </NuxtLink>
      </div>

      <form class="card space-y-4" @submit.prevent="submit">
        <h1 class="text-2xl font-semibold text-slate-900">Connexion</h1>
        <p class="text-sm text-slate-500">Accédez à votre tableau de bord.</p>

        <div>
          <label class="label">Email</label>
          <input v-model="form.email" required type="email" autocomplete="email" class="input" />
        </div>
        <div>
          <label class="label">Mot de passe</label>
          <input v-model="form.password" required type="password" autocomplete="current-password" class="input" />
        </div>

        <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>

        <p class="text-center text-sm text-slate-500">
          Pas encore inscrit?
          <NuxtLink to="/register" class="font-medium text-brand-600 hover:text-brand-700">
            Créer un compte
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
