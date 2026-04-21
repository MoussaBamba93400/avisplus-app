<script setup lang="ts">
interface Review {
  id: number
  rating: number
  comment: string | null
  is_public: boolean
  forwarded_to_google: boolean
  contact_email: string | null
  submitted_at: string
  customer?: { id: number; name: string | null; phone: string } | null
}

defineProps<{ review: Review }>()

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
</script>

<template>
  <article class="card">
    <header class="flex items-start justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <StarRating :model-value="review.rating" readonly size="sm" />
          <span class="text-sm font-semibold text-slate-700">{{ review.rating }}/5</span>
        </div>
        <p class="mt-1 text-xs text-slate-500">
          {{ review.customer?.name || 'Anonyme' }}
          <span v-if="review.customer?.phone">· {{ review.customer.phone }}</span>
          · {{ formatDate(review.submitted_at) }}
        </p>
      </div>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="review.rating >= 4
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
          : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200'"
      >
        {{ review.rating >= 4 ? 'Public (Google)' : 'Privé' }}
      </span>
    </header>

    <p v-if="review.comment" class="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
      {{ review.comment }}
    </p>

    <p v-if="review.contact_email" class="mt-3 text-xs text-slate-500">
      Contact laissé: <a class="text-brand-600 hover:underline" :href="`mailto:${review.contact_email}`">{{ review.contact_email }}</a>
    </p>
  </article>
</template>
