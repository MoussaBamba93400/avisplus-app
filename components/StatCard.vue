<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
  trend?: 'up' | 'down' | 'neutral'
}>()
</script>

<template>
  <div class="card flex flex-col gap-1">
    <div class="text-sm font-medium text-slate-500">{{ label }}</div>
    <div class="flex items-baseline gap-2">
      <div class="text-3xl font-semibold tracking-tight text-slate-900">{{ value }}</div>
      <span
        v-if="trend"
        class="text-xs font-medium"
        :class="{
          'text-emerald-600': trend === 'up',
          'text-rose-600': trend === 'down',
          'text-slate-500': trend === 'neutral',
        }"
      >
        {{ trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•' }}
      </span>
    </div>
    <div v-if="hint" class="text-xs text-slate-500">{{ hint }}</div>
  </div>
</template>
