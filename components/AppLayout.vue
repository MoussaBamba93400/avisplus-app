<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const { user, businesses, activeBusinessId } = storeToRefs(auth)
const { logout } = useAuth()
const { switchTo } = useBusiness()
const route = useRoute()

const nav = [
  { to: '/dashboard',        label: 'Tableau de bord', icon: '📊' },
  { to: '/customers',        label: 'Clients',         icon: '👥' },
  { to: '/reviews',          label: 'Avis',            icon: '⭐' },
  { to: '/settings',         label: 'Paramètres',      icon: '⚙️' },
]

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

const onSwitch = (e: Event) => {
  const id = Number((e.target as HTMLSelectElement).value)
  if (!Number.isNaN(id)) switchTo(id)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <aside class="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div class="px-6 py-5">
        <NuxtLink to="/dashboard" class="text-xl font-bold tracking-tight text-brand-700">
          Avis<span class="text-brand-500">+</span>
        </NuxtLink>
      </div>

      <div class="px-4 pb-3">
        <label class="label">Entreprise</label>
        <select
          v-if="businesses.length > 0"
          class="input"
          :value="activeBusinessId ?? ''"
          @change="onSwitch"
        >
          <option v-for="b in businesses" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
        <p v-else class="text-xs text-slate-500">Aucune entreprise configurée.</p>
      </div>

      <nav class="flex flex-1 flex-col gap-1 px-3 py-2">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-700 hover:bg-slate-100'"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="border-t border-slate-200 px-4 py-4">
        <div class="mb-2 text-xs text-slate-500">Connecté en tant que</div>
        <div class="truncate text-sm font-medium text-slate-800">{{ user?.name }}</div>
        <div class="truncate text-xs text-slate-500">{{ user?.email }}</div>
        <button
          class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          @click="logout"
        >
          Se déconnecter
        </button>
      </div>
    </aside>

    <main class="md:pl-60">
      <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
