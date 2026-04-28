<script setup lang="ts">
type Size = 'xs' | 'sm' | 'md' | 'lg'
type Tone = 'current' | 'brand' | 'white' | 'slate'

const props = withDefaults(
  defineProps<{
    size?: Size
    tone?: Tone
    label?: string
  }>(),
  { size: 'sm', tone: 'current', label: 'Chargement' },
)

const sizeClass: Record<Size, string> = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

const toneClass: Record<Tone, string> = {
  current: 'border-current/25 border-t-current',
  brand:   'border-brand-200 border-t-brand-600',
  white:   'border-white/30 border-t-white',
  slate:   'border-slate-200 border-t-slate-500',
}
</script>

<template>
  <span
    class="inline-block animate-spin rounded-full align-[-2px]"
    :class="[sizeClass[props.size], toneClass[props.tone]]"
    role="status"
    :aria-label="props.label"
  />
</template>
