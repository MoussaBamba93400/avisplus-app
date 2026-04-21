<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore, type Business } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Paramètres — Avis+' })

const api = useApi()
const auth = useAuthStore()
const { businesses, activeBusiness } = storeToRefs(auth)
const { list, create, update } = useBusiness()

type BusinessDetails = Business & {
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  google_place_id: string | null
  sms_sender: string | null
  review_sms_template: string | null
  review_request_delay_hours: number
  minimum_rating_for_google: number
  auto_send_enabled: boolean
}

const form = reactive<Partial<BusinessDetails>>({})
const loading = ref(false)
const saved = ref(false)
const mode = ref<'edit' | 'new'>('edit')

const loadCurrent = async () => {
  if (!activeBusiness.value) {
    mode.value = 'new'
    return
  }
  const details = await api.get<BusinessDetails>(`/businesses/${activeBusiness.value.id}`)
  Object.assign(form, details)
}

const save = async () => {
  loading.value = true
  saved.value = false
  try {
    if (mode.value === 'new') {
      await create(form as never)
    } else if (activeBusiness.value) {
      await update(activeBusiness.value.id, form as never)
    }
    await list()
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } finally {
    loading.value = false
  }
}

watch(activeBusiness, () => loadCurrent(), { immediate: false })
onMounted(loadCurrent)
</script>

<template>
  <AppLayout>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Paramètres</h1>
        <p class="text-sm text-slate-500">
          {{ mode === 'new' ? 'Créez votre première entreprise' : 'Gérer l\'entreprise active' }}
        </p>
      </div>
      <button
        v-if="mode === 'edit'"
        class="btn-secondary"
        @click="() => { mode = 'new'; Object.keys(form).forEach(k => delete (form as any)[k]) }"
      >
        + Nouvelle entreprise
      </button>
    </div>

    <form class="card max-w-2xl space-y-5" @submit.prevent="save">
      <h2 class="text-lg font-semibold text-slate-900">Informations</h2>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label">Nom *</label>
          <input v-model="form.name" required class="input" />
        </div>
        <div>
          <label class="label">Téléphone</label>
          <input v-model="form.phone" class="input" />
        </div>
        <div class="sm:col-span-2">
          <label class="label">Adresse</label>
          <input v-model="form.address" class="input" />
        </div>
        <div>
          <label class="label">Ville</label>
          <input v-model="form.city" class="input" />
        </div>
        <div>
          <label class="label">Code postal</label>
          <input v-model="form.postal_code" class="input" />
        </div>
      </div>

      <hr class="border-slate-200">

      <h2 class="text-lg font-semibold text-slate-900">Google Reviews</h2>
      <div>
        <label class="label">URL complète de votre page d'avis Google</label>
        <input v-model="form.google_review_url" type="url" class="input" placeholder="https://g.page/r/..." />
        <p class="mt-1 text-xs text-slate-500">Les clients 4-5★ seront automatiquement redirigés ici.</p>
      </div>
      <div>
        <label class="label">Seuil de note positif</label>
        <select v-model.number="form.minimum_rating_for_google" class="input">
          <option :value="4">4 étoiles et plus</option>
          <option :value="5">5 étoiles uniquement</option>
        </select>
      </div>

      <hr class="border-slate-200">

      <h2 class="text-lg font-semibold text-slate-900">SMS</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label">Expéditeur (11 caractères max)</label>
          <input v-model="form.sms_sender" maxlength="11" class="input" placeholder="AvisPlus" />
        </div>
        <div>
          <label class="label">Délai après visite (heures)</label>
          <input v-model.number="form.review_request_delay_hours" type="number" min="0" max="720" class="input" />
        </div>
      </div>
      <div>
        <label class="label">Modèle de SMS</label>
        <textarea v-model="form.review_sms_template" rows="3" class="input" />
        <p class="mt-1 text-xs text-slate-500">
          Variables disponibles: <code>{name}</code>, <code>{business}</code>, <code>{link}</code>
        </p>
      </div>
      <label class="inline-flex items-center gap-2 text-sm">
        <input v-model="form.auto_send_enabled" type="checkbox" class="rounded" />
        Envoyer automatiquement les SMS après la visite
      </label>

      <div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <span v-if="saved" class="text-sm text-emerald-600">✓ Enregistré</span>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Enregistrement…' : mode === 'new' ? 'Créer' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </AppLayout>
</template>
