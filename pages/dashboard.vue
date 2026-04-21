<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Tableau de bord — Avis+' })

interface Stats {
  window_days: number
  total_reviews: number
  average_rating: number
  positive: number
  negative: number
  distribution: Record<number, number>
  forwarded_to_google: number
  sms: {
    sent: number
    delivered: number
    clicked: number
    submitted: number
    click_through_rate: number
    conversion_rate: number
  }
}

const api = useApi()
const stats = ref<Stats | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await api.get<Stats>('/reviews/stats?days=30')
  } finally {
    loading.value = false
  }
})

const pct = (n: number) => `${Math.round(n * 100)}%`
</script>

<template>
  <AppLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-slate-900">Tableau de bord</h1>
      <p class="text-sm text-slate-500">Aperçu des 30 derniers jours</p>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">Chargement…</div>
    <div v-else-if="!stats" class="card text-sm text-slate-500">Aucune donnée disponible.</div>

    <div v-else class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avis reçus"       :value="stats.total_reviews" />
        <StatCard label="Note moyenne"     :value="stats.average_rating.toFixed(1) + ' / 5'" />
        <StatCard label="Avis positifs"    :value="stats.positive"      hint="4-5★ redirigés vers Google" trend="up" />
        <StatCard label="Avis négatifs"    :value="stats.negative"      hint="1-3★ reçus en privé"       trend="down" />
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="card">
          <h2 class="mb-4 text-base font-semibold text-slate-900">Distribution des notes</h2>
          <div class="space-y-2">
            <div v-for="n in [5, 4, 3, 2, 1]" :key="n" class="flex items-center gap-3">
              <span class="w-8 text-sm font-medium text-slate-600">{{ n }}★</span>
              <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full"
                  :class="n >= 4 ? 'bg-emerald-500' : n === 3 ? 'bg-amber-500' : 'bg-rose-500'"
                  :style="{
                    width: stats.total_reviews > 0
                      ? `${(stats.distribution[n] / stats.total_reviews) * 100}%`
                      : '0%'
                  }"
                />
              </div>
              <span class="w-8 text-right text-sm text-slate-500">{{ stats.distribution[n] }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="mb-4 text-base font-semibold text-slate-900">Campagnes SMS</h2>
          <dl class="grid grid-cols-2 gap-y-3 text-sm">
            <dt class="text-slate-500">Envoyés</dt><dd class="text-right font-medium">{{ stats.sms.sent }}</dd>
            <dt class="text-slate-500">Délivrés</dt><dd class="text-right font-medium">{{ stats.sms.delivered }}</dd>
            <dt class="text-slate-500">Cliqués</dt><dd class="text-right font-medium">{{ stats.sms.clicked }}</dd>
            <dt class="text-slate-500">Avis soumis</dt><dd class="text-right font-medium">{{ stats.sms.submitted }}</dd>
            <dt class="text-slate-500 pt-2 border-t border-slate-200 col-span-2"></dt>
            <dt class="text-slate-500">Taux de clic</dt><dd class="text-right font-semibold text-brand-700">{{ pct(stats.sms.click_through_rate) }}</dd>
            <dt class="text-slate-500">Taux de conversion</dt><dd class="text-right font-semibold text-brand-700">{{ pct(stats.sms.conversion_rate) }}</dd>
          </dl>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
