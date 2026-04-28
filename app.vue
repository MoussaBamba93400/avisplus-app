<script setup lang="ts">
// Root component — delegates to Nuxt pages.
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#1c73f5" />
    <NuxtPage />
    <ClientOnly>
      <SonnerToaster
        position="top-right"
        :duration="4000"
        :visible-toasts="4"
        rich-colors
        close-button
        :toast-options="{
          classes: {
            toast: 'rounded-xl border border-slate-200 bg-white shadow-md ring-1 ring-slate-200/60 text-slate-800',
            title: 'text-sm font-semibold',
            description: 'text-sm text-slate-600',
            actionButton: 'btn-primary',
            cancelButton: 'btn-secondary',
            success: 'text-emerald-700',
            error: 'text-red-700',
            warning: 'text-amber-700',
            info: 'text-brand-700',
          },
        }"
      />
      <ConfirmDialog />
    </ClientOnly>
  </div>
</template>
