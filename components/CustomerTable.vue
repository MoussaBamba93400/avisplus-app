<script setup lang="ts">
interface Customer {
  id: number
  name: string | null
  phone: string
  email: string | null
  last_visit_at: string | null
  last_sms_sent_at: string | null
}

const props = defineProps<{ customers: Customer[]; loading?: boolean }>()
const emit = defineEmits<{
  sendSms: [customer: Customer]
  delete: [customer: Customer]
}>()

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Nom</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Téléphone</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Email</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Dernière visite</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">SMS envoyé</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white">
        <tr v-if="loading">
          <td colspan="6" class="px-4 py-10 text-center text-sm text-slate-500">Chargement…</td>
        </tr>
        <tr v-else-if="customers.length === 0">
          <td colspan="6" class="px-4 py-10 text-center text-sm text-slate-500">
            Aucun client pour le moment.
          </td>
        </tr>
        <tr v-for="c in customers" v-else :key="c.id" class="hover:bg-slate-50">
          <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">{{ c.name || '—' }}</td>
          <td class="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{{ c.phone }}</td>
          <td class="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{{ c.email || '—' }}</td>
          <td class="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{{ formatDate(c.last_visit_at) }}</td>
          <td class="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{{ formatDate(c.last_sms_sent_at) }}</td>
          <td class="whitespace-nowrap px-4 py-3 text-right text-sm">
            <button
              class="text-brand-600 hover:text-brand-800"
              @click="emit('sendSms', c)"
            >
              Envoyer SMS
            </button>
            <button
              class="ml-4 text-rose-600 hover:text-rose-800"
              @click="emit('delete', c)"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
