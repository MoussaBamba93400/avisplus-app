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
const toast = useToast()
const { confirm } = useConfirm()

const customers = ref<Customer[]>([])
const pagination = ref({ page: 1, total: 0, lastPage: 1 })
const loading = ref(true)

const fetchCustomers = async (page = 1) => {
  loading.value = true
  try {
    const { data, current_page, last_page, total } = await api.get<Paginated<Customer>>(
      `/customers?page=${page}`,
    )
    customers.value = data
    pagination.value = { page: current_page, lastPage: last_page, total }
  } catch (e) {
    toast.error(e)
  } finally {
    loading.value = false
  }
}

const onSendSms = async (c: Customer) => {
  await toast.promise(api.post(`/customers/${c.id}/sms`), {
    loading: 'Envoi du SMS…',
    success: `SMS programmé pour ${c.name || c.phone}.`,
    error: (err) => {
      const e = err as { data?: { message?: string }; message?: string }
      return e?.data?.message ?? e?.message ?? 'Échec de l\'envoi du SMS.'
    },
  })
}

const onDelete = async (c: Customer) => {
  const label = c.name || c.phone
  const ok = await confirm({
    title: `Supprimer ${label} ?`,
    message: 'Le client et son historique de SMS seront supprimés. Cette action est irréversible.',
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
    tone: 'danger',
  })
  if (!ok) return
  try {
    await api.delete(`/customers/${c.id}`)
    toast.success(`${label} supprimé.`)
    await fetchCustomers(pagination.value.page)
  } catch (e) {
    toast.error(e)
  }
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
