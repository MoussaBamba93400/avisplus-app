<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Ajouter un client — Avis+' })

const api = useApi()

const mode = ref<'single' | 'csv'>('single')

const form = reactive({
  name: '',
  phone: '',
  email: '',
  last_visit_at: '',
  notes: '',
})
const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

const file = ref<File | null>(null)
const importResult = ref<{ imported: number; skipped: number } | null>(null)

const submitSingle = async () => {
  loading.value = true
  errors.value = {}
  try {
    await api.post('/customers', form)
    await navigateTo('/customers')
  } catch (e) {
    errors.value = (e as { data?: { errors?: Record<string, string[]> } })?.data?.errors || {}
  } finally {
    loading.value = false
  }
}

const onFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]
  file.value = f ?? null
}

const submitCsv = async () => {
  if (!file.value) return
  loading.value = true
  importResult.value = null
  try {
    const fd = new FormData()
    fd.append('file', file.value)
    importResult.value = await api.post('/customers/import', fd)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-slate-900">Ajouter des clients</h1>
      <p class="text-sm text-slate-500">Un par un, ou via un import CSV.</p>
    </div>

    <div class="mb-6 flex gap-2">
      <button
        class="btn"
        :class="mode === 'single' ? 'bg-brand-600 text-white' : 'bg-white ring-1 ring-slate-300 text-slate-700'"
        @click="mode = 'single'"
      >
        Ajout unitaire
      </button>
      <button
        class="btn"
        :class="mode === 'csv' ? 'bg-brand-600 text-white' : 'bg-white ring-1 ring-slate-300 text-slate-700'"
        @click="mode = 'csv'"
      >
        Import CSV
      </button>
    </div>

    <form v-if="mode === 'single'" class="card max-w-xl space-y-4" @submit.prevent="submitSingle">
      <div>
        <label class="label">Nom</label>
        <input v-model="form.name" class="input" />
      </div>
      <div>
        <label class="label">Téléphone *</label>
        <input v-model="form.phone" required class="input" placeholder="+33 6 12 34 56 78" />
        <p v-if="errors.phone" class="mt-1 text-xs text-rose-600">{{ errors.phone[0] }}</p>
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="form.email" type="email" class="input" />
      </div>
      <div>
        <label class="label">Dernière visite</label>
        <input v-model="form.last_visit_at" type="datetime-local" class="input" />
      </div>
      <div>
        <label class="label">Notes internes</label>
        <textarea v-model="form.notes" rows="3" class="input" />
      </div>
      <button type="submit" :disabled="loading" class="btn-primary w-full">
        {{ loading ? 'Enregistrement…' : 'Ajouter' }}
      </button>
    </form>

    <form v-else class="card max-w-xl space-y-4" @submit.prevent="submitCsv">
      <div>
        <label class="label">Fichier CSV</label>
        <input type="file" accept=".csv" class="block w-full text-sm" @change="onFile" />
        <p class="mt-2 text-xs text-slate-500">
          Colonnes attendues: <code>name, phone, email, last_visit_at</code>.
          Première ligne ignorée si c'est un en-tête.
        </p>
      </div>
      <button type="submit" :disabled="!file || loading" class="btn-primary w-full">
        {{ loading ? 'Import…' : 'Importer' }}
      </button>

      <div v-if="importResult" class="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
        {{ importResult.imported }} client(s) importé(s), {{ importResult.skipped }} ligne(s) ignorée(s).
      </div>
    </form>
  </AppLayout>
</template>
