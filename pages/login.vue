<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Connexion — Avis+' })

const { login } = useAuth()
const route = useRoute()
const toast = useToast()

const form = reactive({ email: '', password: '' })
const loading = ref(false)

const submit = async () => {
  loading.value = true
  try {
    await login({ email: form.email, password: form.password })
    toast.success('Connexion réussie. Bienvenue !')
    const redirect = (route.query.redirect as string) || '/dashboard'
    await navigateTo(redirect)
  } catch (e) {
    toast.error(e, { description: 'Vérifiez votre email et votre mot de passe.' })
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

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary inline-flex w-full items-center justify-center gap-2"
        >
          <Spinner v-if="loading" size="xs" tone="white" />
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
