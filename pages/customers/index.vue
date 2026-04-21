<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Clients — Avis+' })

interface Customer {
  id: number
  name: string | null
  phone: string
  email: string | null
  last_visit_at: string | null
  last_sms_sent_at: string | null
}
interface Paginated<T> { data: T[]; current_page: number; last_page: number; total: number }

const api = useApi()
const customers = ref<Customer[]>([])
const pagination = ref({ page: 1, total: 0, lastPage: 1 })
const loading = ref(true)
const toast = ref<string | null>(null)

const fetchCustomers = async (page = 1) => {
  loading.value = true
  try {
    const { data, current_page, last_page, total } = await api.get<Paginated<Customer>>(
      `/customers?page=${page}`,
    )
    customers.value = data
    pagination.value = { page: current_page, lastPage: last_page, total }
  } finally {
    loading.value = false
  }
}

const onSendSms = async (c: Customer) => {
  try {
    await api.post(`/customers/${c.id}/sms`)
    toast.value = `SMS programmé pour ${c.name || c.phone}.`
    setTimeout(() => (toast.value = null), 3000)
  } catch (e) {
    toast.value = `Erreur: ${(e as Error).message}`
  }
}

const onDelete = async (c: Customer) => {
  if (!confirm(`Supprimer ${c.name || c.phone} ?`)) return
  await api.delete(`/customers/${c.id}`)
  await fetchCustomers(pagination.value.page)
}

onMounted(() => fetchCustomers())
</script>

<template>
  <AppLayout>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Clients</h1>
        <p class="text-sm text-slate-500">{{ pagination.total }} contact(s)</p>
      </div>
      <NuxtLink to="/customers/add" class="btn-primary">+ Ajouter</NuxtLink>
    </div>

    <div
      v-if="toast"
      class="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-200"
    >
      {{ toast }}
    </div>

    <CustomerTable
      :customers="customers"
      :loading="loading"
      @send-sms="onSendSms"
      @delete="onDelete"
    />

    <div v-if="pagination.lastPage > 1" class="mt-4 flex items-center justify-between">
      <button
        class="btn-secondary"
        :disabled="pagination.page <= 1"
        @click="fetchCustomers(pagination.page - 1)"
      >
        ← Précédent
      </button>
      <span class="text-sm text-slate-500">Page {{ pagination.page }} / {{ pagination.lastPage }}</span>
      <button
        class="btn-secondary"
        :disabled="pagination.page >= pagination.lastPage"
        @click="fetchCustomers(pagination.page + 1)"
      >
        Suivant →
      </button>
    </div>
  </AppLayout>
</template>
