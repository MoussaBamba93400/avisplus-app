<script setup lang="ts">
// Public review page — no auth required.
definePageMeta({ layout: false })

interface ReviewRequestData {
  token: string
  business: {
    id: number
    name: string
    slug: string
    logo_url: string | null
    google_review_url: string | null
    minimum_rating_for_google: number
  }
}
interface SubmitResponse {
  rating: number
  is_positive: boolean
  redirect_to: string | null
  message: string
}

const route = useRoute()
const api = useApi()

const token = route.params.token as string
const data = ref<ReviewRequestData | null>(null)
const loadError = ref<string | null>(null)

const rating = ref(0)
const comment = ref('')
const contactEmail = ref('')
const submitting = ref(false)
const submitted = ref<SubmitResponse | null>(null)

useHead({ title: 'Notez votre expérience' })

const showCommentForm = computed(() =>
  rating.value > 0 && data.value
    ? rating.value < data.value.business.minimum_rating_for_google
    : false,
)

onMounted(async () => {
  try {
    data.value = await api.get<ReviewRequestData>(`/public/reviews/${token}`)
  } catch (e) {
    const err = e as { response?: { status?: number }; data?: { message?: string; error?: string } }
    loadError.value = err.data?.message || "Ce lien n'est pas valide."
  }
})

// On rating pick: if positive, submit immediately; otherwise show the comment textarea.
watch(rating, async (newRating) => {
  if (!newRating || !data.value) return
  if (newRating >= data.value.business.minimum_rating_for_google) {
    await submit()
  }
})

const submit = async () => {
  if (!data.value || submitting.value) return
  submitting.value = true
  try {
    const res = await api.post<SubmitResponse>(`/public/reviews/${token}`, {
      rating: rating.value,
      comment: comment.value || null,
      contact_email: contactEmail.value || null,
    })
    submitted.value = res
    if (res.is_positive && res.redirect_to) {
      setTimeout(() => (window.location.href = res.redirect_to as string), 1500)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-50 px-4 py-10">
    <div class="w-full max-w-lg">
      <div v-if="loadError" class="card text-center">
        <p class="text-lg font-medium text-slate-800">{{ loadError }}</p>
        <p class="mt-1 text-sm text-slate-500">Si vous pensez qu'il s'agit d'une erreur, contactez l'établissement.</p>
      </div>

      <div v-else-if="!data" class="card text-center text-sm text-slate-500">Chargement…</div>

      <!-- Positive review submitted — redirect screen -->
      <div v-else-if="submitted?.is_positive" class="card text-center">
        <div class="mb-4 text-5xl">🙏</div>
        <h1 class="text-2xl font-semibold text-slate-900">Merci pour votre retour!</h1>
        <p class="mt-2 text-sm text-slate-600">
          Vous allez être redirigé vers Google dans un instant pour finaliser votre avis.
        </p>
        <a v-if="submitted.redirect_to" :href="submitted.redirect_to" class="btn-primary mt-6">
          Continuer vers Google
        </a>
      </div>

      <!-- Negative review submitted — thank-you -->
      <div v-else-if="submitted" class="card text-center">
        <div class="mb-4 text-5xl">💬</div>
        <h1 class="text-2xl font-semibold text-slate-900">Merci pour votre retour</h1>
        <p class="mt-2 text-sm text-slate-600">
          Votre message a été transmis à l'équipe de
          <span class="font-medium">{{ data.business.name }}</span>.
          Ils reviendront vers vous si nécessaire.
        </p>
      </div>

      <!-- Rating form -->
      <div v-else class="card text-center">
        <img
          v-if="data.business.logo_url"
          :src="data.business.logo_url"
          :alt="data.business.name"
          class="mx-auto mb-4 h-16 w-16 rounded-full object-cover ring-1 ring-slate-200"
        />

        <h1 class="text-2xl font-semibold text-slate-900">{{ data.business.name }}</h1>
        <p class="mt-2 text-sm text-slate-600">Comment s'est passée votre visite?</p>

        <div class="mt-6 flex justify-center">
          <StarRating v-model="rating" size="xl" />
        </div>

        <p v-if="rating > 0 && !showCommentForm && !submitting" class="mt-4 text-sm text-emerald-700">
          Merci! Redirection en cours…
        </p>

        <!-- Comment form for low ratings -->
        <form v-if="showCommentForm" class="mt-6 space-y-4 text-left" @submit.prevent="submit">
          <div>
            <label class="label">Qu'est-ce qui n'a pas été? (facultatif)</label>
            <textarea
              v-model="comment"
              rows="4"
              maxlength="2000"
              class="input"
              placeholder="Votre retour restera privé — il ne sera pas publié sur Google."
            />
          </div>
          <div>
            <label class="label">Email de contact (facultatif)</label>
            <input v-model="contactEmail" type="email" class="input" placeholder="Pour que l'équipe puisse vous répondre" />
          </div>
          <button type="submit" :disabled="submitting" class="btn-primary w-full">
            {{ submitting ? 'Envoi…' : 'Envoyer mon retour' }}
          </button>
        </form>

        <p class="mt-6 text-xs text-slate-400">
          Propulsé par <span class="font-medium text-brand-700">Avis+</span>
        </p>
      </div>
    </div>
  </div>
</template>
