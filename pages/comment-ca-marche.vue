<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Comment ça marche — Avis+',
  meta: [
    {
      name: 'description',
      content:
        'Découvrez en 4 étapes comment Avis+ collecte vos avis clients par SMS et booste votre e-réputation sur Google.',
    },
  ],
})

interface Step {
  number: string
  emoji: string
  title: string
  description: string
  highlight?: string
}

const steps: Step[] = [
  {
    number: '01',
    emoji: '👤',
    title: 'Ajoutez votre client',
    description:
      "Après la visite, ajoutez le prénom et le numéro de téléphone de votre client depuis le tableau de bord. Un clic suffit — pas de formulaire interminable, pas de tableur à remplir.",
    highlight: 'Moins de 10 secondes par client.',
  },
  {
    number: '02',
    emoji: '📲',
    title: 'Le SMS part automatiquement',
    description:
      "Deux heures après l'ajout, votre client reçoit un SMS personnalisé avec un lien unique vers sa page d'avis. Aucune action de votre part : Avis+ s'occupe de tout, y compris du meilleur moment pour envoyer.",
    highlight: 'Expédié depuis la France, conforme RGPD.',
  },
  {
    number: '03',
    emoji: '⭐',
    title: 'Le client donne son avis',
    description:
      "Une page simple, optimisée mobile. Votre client clique sur les étoiles, laisse un commentaire optionnel, et valide en moins de 30 secondes. Aucune appli, aucun compte à créer.",
    highlight: 'Expérience pensée pour le téléphone.',
  },
  {
    number: '04',
    emoji: '🎯',
    title: 'Le routage intelligent',
    description:
      "4 ou 5 étoiles ? Votre client est redirigé vers Google pour publier son avis publiquement. 1 à 3 étoiles ? L'avis reste privé et vous recevez une alerte par email pour réagir avant qu'il ne devienne public ailleurs.",
    highlight: 'Protégez votre e-réputation, automatiquement.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
    <header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <NuxtLink to="/" class="text-2xl font-bold text-brand-700">
        Avis<span class="text-brand-500">+</span>
      </NuxtLink>
      <nav class="flex items-center gap-3">
        <NuxtLink to="/login" class="btn-secondary">Connexion</NuxtLink>
        <NuxtLink to="/register" class="btn-primary">Essai gratuit</NuxtLink>
      </nav>
    </header>

    <section class="mx-auto max-w-4xl px-6 pb-12 pt-10 text-center sm:pt-16">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-600">
        Comment ça marche
      </p>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        De la visite du client
        <span class="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
          à l'avis Google publié.
        </span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
        Quatre étapes automatisées pour transformer chaque client satisfait en
        ambassadeur sur Google — et pour désamorcer les clients mécontents avant
        qu'ils ne s'expriment publiquement.
      </p>
    </section>

    <section class="mx-auto max-w-5xl px-6 pb-16">
      <ol class="grid gap-6 md:grid-cols-2">
        <li
          v-for="(step, index) in steps"
          :key="step.number"
          class="card relative flex flex-col gap-4 p-8"
        >
          <div class="flex items-start gap-4">
            <span
              aria-hidden="true"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-3xl ring-1 ring-brand-100"
            >
              {{ step.emoji }}
            </span>
            <span
              class="text-5xl font-bold leading-none text-brand-600/20 tabular-nums"
              aria-label="Étape {{ index + 1 }}"
            >
              {{ step.number }}
            </span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-900">
              {{ step.title }}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">
              {{ step.description }}
            </p>
            <p
              v-if="step.highlight"
              class="mt-3 text-sm font-medium text-brand-700"
            >
              {{ step.highlight }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mx-auto max-w-5xl px-6 pb-20">
      <div
        class="card flex flex-col items-center gap-6 bg-gradient-to-br from-brand-600 to-brand-500 p-10 text-center text-white ring-0 sm:p-14"
      >
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          Prêt à collecter vos premiers avis&nbsp;?
        </h2>
        <p class="max-w-2xl text-base leading-relaxed text-brand-50">
          Essai gratuit, sans carte bancaire. Configurez votre compte en deux
          minutes et envoyez votre premier SMS aujourd'hui.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/register"
            class="btn bg-white px-6 py-3 text-base font-semibold text-brand-700 hover:bg-brand-50 focus:ring-white"
          >
            Démarrer gratuitement
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="btn border border-white/60 bg-transparent px-6 py-3 text-base font-semibold text-white hover:bg-white/10 focus:ring-white"
          >
            J'ai déjà un compte
          </NuxtLink>
        </div>
      </div>
    </section>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-slate-500">
        © {{ new Date().getFullYear() }} Avis+ · Fait en France
      </div>
    </footer>
  </div>
</template>
