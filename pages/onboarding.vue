<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Bienvenue — Avis+' })

const api = useApi()
const auth = useAuthStore()
const toast = useToast()
const { list } = useBusiness()

const form = reactive({
  name: '',
  phone: '',
  address: '',
  city: '',
  google_review_url: '',
  sms_sender: '',
  review_request_delay_hours: 24,
  minimum_rating_for_google: 4,
  auto_send_enabled: false,
})

const loading = ref(false)

const submit = async () => {
  loading.value = true
  try {
    await api.post('/businesses', form)
    await list()
    await navigateTo('/dashboard')
  } catch (e) {
    toast.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-lg space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-slate-900">Bienvenue sur Avis+</h1>
        <p class="mt-2 text-slate-500">Créez votre première entreprise pour commencer à collecter des avis.</p>
      </div>

      <form class="card space-y-5" @submit.prevent="submit">
        <div>
          <label class="label">Nom de l'entreprise *</label>
          <input v-model="form.name" required class="input" placeholder="Ex: Garage Martin" />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Téléphone</label>
            <input v-model="form.phone" class="input" placeholder="+33 6 00 00 00 00" />
          </div>
          <div>
            <label class="label">Ville</label>
            <input v-model="form.city" class="input" placeholder="Paris" />
          </div>
        </div>

        <div>
          <label class="label">Adresse</label>
          <input v-model="form.address" class="input" placeholder="12 rue de la Paix, Paris" />
        </div>

        <div>
          <label class="label">URL de votre page d'avis Google</label>
          <input v-model="form.google_review_url" type="url" class="input" placeholder="https://g.page/r/..." />
          <p class="mt-1 text-xs text-slate-500">Les clients satisfaits seront automatiquement redirigés ici.</p>
        </div>

        <hr class="border-slate-200">

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Expéditeur SMS (11 car. max)</label>
            <input v-model="form.sms_sender" maxlength="11" class="input" placeholder="AvisPlus" />
          </div>
          <div>
            <label class="label">Délai après visite (heures)</label>
            <input v-model.number="form.review_request_delay_hours" type="number" min="0" max="720" class="input" />
          </div>
        </div>

        <div>
          <label class="label">Seuil de note positif</label>
          <select v-model.number="form.minimum_rating_for_google" class="input">
            <option :value="4">4 étoiles et plus</option>
            <option :value="5">5 étoiles uniquement</option>
          </select>
        </div>

        <label class="inline-flex items-center gap-2 text-sm">
          <input v-model="form.auto_send_enabled" type="checkbox" class="rounded" />
          Envoyer automatiquement les SMS après chaque visite
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full inline-flex justify-center items-center gap-2"
        >
          <Spinner v-if="loading" size="xs" tone="white" />
          {{ loading ? 'Création…' : 'Créer mon entreprise →' }}
        </button>
      </form>
    </div>
  </div>
</template>
