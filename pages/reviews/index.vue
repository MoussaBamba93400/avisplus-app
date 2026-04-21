<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Avis — Avis+' })

interface Review {
  id: number
  rating: number
  comment: string | null
  is_public: boolean
  forwarded_to_google: boolean
  contact_email: string | null
  submitted_at: string
  customer: { id: number; name: string | null; phone: string } | null
}
interface Paginated<T> { data: T[]; current_page: number; last_page: number; total: number }

const api = useApi()
const reviews = ref<Review[]>([])
const pagination = ref({ page: 1, total: 0, lastPage: 1 })
const filter = ref<'all' | 'negative' | 'positive'>('all')
const loading = ref(true)

const fetchReviews = async (page = 1) => {
  loading.value = true
  const qs = new URLSearchParams({ page: String(page) })
  if (filter.value === 'negative') qs.set('negative_only', '1')
  if (filter.value === 'positive') qs.set('rating', '5')
  try {
    const res = await api.get<Paginated<Review>>(`/reviews?${qs}`)
    reviews.value = res.data
    pagination.value = { page: res.current_page, total: res.total, lastPage: res.last_page }
  } finally {
    loading.value = false
  }
}

watch(filter, () => fetchReviews(1))
onMounted(() => fetchReviews())
</script>

<template>
  <AppLayout>
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Avis</h1>
        <p class="text-sm text-slate-500">{{ pagination.total }} avis collecté(s)</p>
      </div>
      <div class="flex gap-2">
        <button
          v-for="(label, key) in { all: 'Tous', positive: '★★★★★', negative: 'Négatifs' }"
          :key="key"
          class="btn"
          :class="filter === key
            ? 'bg-brand-600 text-white'
            : 'bg-white ring-1 ring-slate-300 text-slate-700'"
          @click="filter = key as typeof filter"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">Chargement…</div>
    <div v-else-if="reviews.length === 0" class="card text-center text-sm text-slate-500">
      Aucun avis ne correspond à ce filtre.
    </div>

    <div v-else class="space-y-4">
      <ReviewCard v-for="r in reviews" :key="r.id" :review="r" />
    </div>

    <div v-if="pagination.lastPage > 1" class="mt-6 flex items-center justify-between">
      <button
        class="btn-secondary"
        :disabled="pagination.page <= 1"
        @click="fetchReviews(pagination.page - 1)"
      >
        ← Précédent
      </button>
      <span class="text-sm text-slate-500">Page {{ pagination.page }} / {{ pagination.lastPage }}</span>
      <button
        class="btn-secondary"
        :disabled="pagination.page >= pagination.lastPage"
        @click="fetchReviews(pagination.page + 1)"
      >
        Suivant →
      </button>
    </div>
  </AppLayout>
</template>
