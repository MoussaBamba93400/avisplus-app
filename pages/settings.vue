<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore, type Business } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Paramètres — Avis+' })

const api = useApi()
const auth = useAuthStore()
const { activeBusiness } = storeToRefs(auth)
const { list, create, update, destroy } = useBusiness()
const toast = useToast()
const { confirm } = useConfirm()

const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const logoUploading = ref(false)

const onLogoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
}

const uploadLogo = async () => {
  if (!logoFile.value || !activeBusiness.value) return
  logoUploading.value = true
  try {
    const fd = new FormData()
    fd.append('logo', logoFile.value)
    await api.post(`/businesses/${activeBusiness.value.id}/logo`, fd)
    toast.success('Logo mis à jour.')
    logoFile.value = null
    await list()
  } catch (e) {
    toast.error(e)
  } finally {
    logoUploading.value = false
  }
}

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

const emptyForm = (): Partial<BusinessDetails> => ({
  name: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  google_review_url: '',
  sms_sender: '',
  review_sms_template: '',
  review_request_delay_hours: 24,
  minimum_rating_for_google: 4,
  auto_send_enabled: false,
})

const form = reactive<Partial<BusinessDetails>>(emptyForm())
const loading = ref(false)
const deleting = ref(false)
const initialLoading = ref(false)
const mode = ref<'edit' | 'new'>('edit')

const resetForm = (target: Partial<BusinessDetails> = emptyForm()) => {
  Object.keys(form).forEach((k) => delete (form as Record<string, unknown>)[k])
  Object.assign(form, target)
}

const loadCurrent = async () => {
  if (!activeBusiness.value) {
    mode.value = 'new'
    resetForm()
    return
  }
  mode.value = 'edit'
  initialLoading.value = true
  try {
    const details = await api.get<BusinessDetails>(`/businesses/${activeBusiness.value.id}`)
    resetForm(details)
  } catch (e) {
    toast.error(e)
  } finally {
    initialLoading.value = false
  }
}

const startNew = () => {
  mode.value = 'new'
  resetForm()
}

const save = async () => {
  loading.value = true
  try {
    if (mode.value === 'new') {
      await create(form as never)
      mode.value = 'edit'
      toast.success('Entreprise créée.')
    } else if (activeBusiness.value) {
      await update(activeBusiness.value.id, form as never)
      toast.success('Modifications enregistrées.')
    }
    await list()
    await loadCurrent()
  } catch (e) {
    toast.error(e)
  } finally {
    loading.value = false
  }
}

const remove = async () => {
  if (!activeBusiness.value) return
  const name = activeBusiness.value.name
  const ok = await confirm({
    title: `Supprimer « ${name} » ?`,
    message:
      'Cette action est irréversible. Les clients, demandes d\'avis et avis associés seront également supprimés.',
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
    tone: 'danger',
  })
  if (!ok) return

  deleting.value = true
  try {
    await destroy(activeBusiness.value.id)
    toast.success(`« ${name} » a bien été supprimée.`)
    await loadCurrent()
  } catch (e) {
    toast.error(e)
  } finally {
    deleting.value = false
  }
}

watch(activeBusiness, () => loadCurrent())
onMounted(loadCurrent)
</script>

<template>
  <AppLayout>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Paramètres</h1>
        <p class="text-sm text-slate-500">
          {{ mode === 'new' ? 'Créez une nouvelle entreprise' : 'Gérer l\'entreprise active' }}
        </p>
      </div>
      <button
        v-if="mode === 'edit'"
        type="button"
        class="btn-secondary"
        @click="startNew"
      >
        + Nouvelle entreprise
      </button>
    </div>

    <div v-if="initialLoading" class="card max-w-2xl space-y-4" aria-busy="true">
      <div class="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="h-10 animate-pulse rounded-lg bg-slate-100" />
        <div class="h-10 animate-pulse rounded-lg bg-slate-100" />
        <div class="h-10 animate-pulse rounded-lg bg-slate-100 sm:col-span-2" />
        <div class="h-10 animate-pulse rounded-lg bg-slate-100" />
        <div class="h-10 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div class="h-24 animate-pulse rounded-lg bg-slate-100" />
    </div>

    <form v-else class="card max-w-2xl space-y-5" @submit.prevent="save">
      <h2 class="text-lg font-semibold text-slate-900">Informations</h2>

      <div v-if="mode === 'edit' && activeBusiness">
        <label class="label">Logo</label>
        <div class="flex items-center gap-4">
          <img
            v-if="logoPreview || activeBusiness.logo_url"
            :src="logoPreview || activeBusiness.logo_url"
            alt="Logo"
            class="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200"
          />
          <div v-else class="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
            Aucun
          </div>
          <div class="flex flex-col gap-2">
            <input
              id="logo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              class="hidden"
              @change="onLogoChange"
            />
            <label for="logo-input" class="btn-secondary cursor-pointer text-sm">
              Choisir un fichier
            </label>
            <button
              v-if="logoFile"
              type="button"
              :disabled="logoUploading"
              class="btn-primary inline-flex items-center gap-2 text-sm"
              @click="uploadLogo"
            >
              <Spinner v-if="logoUploading" size="xs" tone="white" />
              {{ logoUploading ? 'Envoi…' : 'Envoyer' }}
            </button>
          </div>
        </div>
        <p class="mt-1 text-xs text-slate-500">JPEG, PNG, WebP ou SVG — max 2 Mo</p>
      </div>

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

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <div>
          <button
            v-if="mode === 'edit' && activeBusiness"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="deleting || loading"
            @click="remove"
          >
            <Spinner v-if="deleting" size="xs" tone="current" />
            {{ deleting ? 'Suppression…' : 'Supprimer cette entreprise' }}
          </button>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="loading || deleting"
            class="btn-primary inline-flex items-center gap-2"
          >
            <Spinner v-if="loading" size="xs" tone="white" />
            {{ loading ? 'Enregistrement…' : mode === 'new' ? 'Créer' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </form>
  </AppLayout>
</template>
