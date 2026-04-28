<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Créer un compte — Avis+' })

const { register } = useAuth()
const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

const submit = async () => {
  loading.value = true
  errors.value = {}
  try {
    await register({ ...form })
    toast.success('Bienvenue !', { description: 'Votre compte a été créé.' })
    await navigateTo('/settings')
  } catch (e) {
    const fieldErrors = (e as { data?: { errors?: Record<string, string[]> } })?.data?.errors
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      errors.value = fieldErrors
      toast.error('Veuillez corriger les champs en rouge.')
    } else {
      toast.error(e)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <div class="w-full max-w-md">
      <div class="mb-6 text-center">
        <NuxtLink to="/" class="text-2xl font-bold text-brand-700">
          Avis<span class="text-brand-500">+</span>
        </NuxtLink>
      </div>

      <form class="card space-y-4" @submit.prevent="submit">
        <h1 class="text-2xl font-semibold text-slate-900">Créer un compte</h1>
        <p class="text-sm text-slate-500">Commencez gratuitement en 30 secondes.</p>

        <div>
          <label class="label">Nom complet</label>
          <input v-model="form.name" required class="input" autocomplete="name" />
          <p v-if="errors.name" class="mt-1 text-xs text-rose-600">{{ errors.name[0] }}</p>
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" required type="email" class="input" autocomplete="email" />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email[0] }}</p>
        </div>
        <div>
          <label class="label">Mot de passe</label>
          <input v-model="form.password" required type="password" class="input" autocomplete="new-password" />
          <p v-if="errors.password" class="mt-1 text-xs text-rose-600">{{ errors.password[0] }}</p>
        </div>
        <div>
          <label class="label">Confirmation</label>
          <input v-model="form.password_confirmation" required type="password" class="input" autocomplete="new-password" />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary inline-flex w-full items-center justify-center gap-2"
        >
          <Spinner v-if="loading" size="xs" tone="white" />
          {{ loading ? 'Création…' : 'Créer mon compte' }}
        </button>

        <p class="text-center text-sm text-slate-500">
          Déjà inscrit?
          <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-700">
            Se connecter
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
