<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: number
  max?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  modelValue: 0,
  max: 5,
  readonly: false,
  size: 'md',
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const hovered = ref<number>(0)

const active = computed(() => hovered.value || props.modelValue)

const sizeClass = computed(() => ({
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
}[props.size]))

const select = (n: number) => {
  if (props.readonly) return
  emit('update:modelValue', n)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="n in max"
      :key="n"
      type="button"
      :disabled="readonly"
      class="transition-transform focus:outline-none"
      :class="[readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110']"
      :aria-label="`${n} étoile${n > 1 ? 's' : ''}`"
      @mouseenter="!readonly && (hovered = n)"
      @mouseleave="!readonly && (hovered = 0)"
      @click="select(n)"
    >
      <svg
        :class="[sizeClass, n <= active ? 'text-amber-400' : 'text-slate-300']"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
      </svg>
    </button>
  </div>
</template>
