<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Avis+ — Collectez des avis clients par SMS' })

const features = [
  { emoji: '📲', title: 'SMS automatiques',       text: 'Un SMS est envoyé à vos clients après leur visite, sans que vous leviez le petit doigt.' },
  { emoji: '🎯', title: 'Tri intelligent',        text: 'Les avis 4-5★ partent sur Google, les avis 1-3★ vous arrivent en privé.' },
  { emoji: '🇫🇷', title: 'Opérateur français',     text: 'Envois depuis la France via OVH, conforme RGPD, support francophone.' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
    <header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div class="text-2xl font-bold text-brand-700">Avis<span class="text-brand-500">+</span></div>
      <nav class="flex items-center gap-3">
        <NuxtLink to="/login" class="btn-secondary">Connexion</NuxtLink>
        <NuxtLink to="/register" class="btn-primary">Essai gratuit</NuxtLink>
      </nav>
    </header>

    <section class="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        Transformez chaque client
        <span class="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
          en ambassadeur Google.
        </span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
        Avis+ envoie un SMS à vos clients après leur visite et dirige automatiquement
        les retours positifs vers votre page Google. Les avis négatifs restent privés —
        vous les recevez par email pour pouvoir réagir.
      </p>
      <div class="mt-10 flex justify-center gap-3">
        <NuxtLink to="/register" class="btn-primary px-6 py-3 text-base">Démarrer gratuitement</NuxtLink>
        <a href="#how" class="btn-secondary px-6 py-3 text-base">Comment ça marche</a>
      </div>
    </section>

    <section id="how" class="mx-auto max-w-5xl px-6 py-16">
      <div class="grid gap-6 md:grid-cols-3">
        <div v-for="f in features" :key="f.title" class="card">
          <div class="text-3xl">{{ f.emoji }}</div>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ f.title }}</h3>
          <p class="mt-1 text-sm text-slate-600">{{ f.text }}</p>
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
