<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from '@headlessui/vue'

const { state, respond } = useConfirm()
</script>

<template>
  <TransitionRoot appear :show="state.open" as="template">
    <Dialog class="relative z-50" @close="respond(false)">
      <TransitionChild
        as="template"
        enter="duration-150 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-100 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-150 ease-out"
            enter-from="opacity-0 translate-y-2 scale-95"
            enter-to="opacity-100 translate-y-0 scale-100"
            leave="duration-100 ease-in"
            leave-from="opacity-100 translate-y-0 scale-100"
            leave-to="opacity-0 translate-y-2 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform rounded-xl bg-white p-6 text-left shadow-xl ring-1 ring-slate-200 transition-all"
            >
              <div class="flex gap-4">
                <div
                  v-if="state.tone === 'danger'"
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
                  aria-hidden="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008Zm-9.53.42 8.69-15.05a1.99 1.99 0 0 1 3.46 0l8.69 15.05A2 2 0 0 1 21.62 20H2.38a2 2 0 0 1-1.91-1.83Z" />
                  </svg>
                </div>
                <div
                  v-else
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"
                  aria-hidden="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                </div>

                <div class="flex-1">
                  <DialogTitle class="text-base font-semibold text-slate-900">
                    {{ state.title }}
                  </DialogTitle>
                  <DialogDescription
                    v-if="state.message"
                    class="mt-2 whitespace-pre-line text-sm text-slate-600"
                  >
                    {{ state.message }}
                  </DialogDescription>
                </div>
              </div>

              <div class="mt-6 flex justify-end gap-2">
                <button type="button" class="btn-secondary" @click="respond(false)">
                  {{ state.cancelLabel }}
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="state.tone === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500'"
                  @click="respond(true)"
                >
                  {{ state.confirmLabel }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
