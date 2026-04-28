import { reactive, readonly } from 'vue'

export interface ConfirmOptions {
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
}

interface ConfirmState extends Required<ConfirmOptions> {
  open: boolean
  resolver: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  tone: 'default',
  resolver: null,
})

export const useConfirm = () => {
  const confirm = (options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      state.title = options.title ?? 'Êtes-vous sûr ?'
      state.message = options.message ?? ''
      state.confirmLabel = options.confirmLabel ?? 'Confirmer'
      state.cancelLabel = options.cancelLabel ?? 'Annuler'
      state.tone = options.tone ?? 'default'
      state.resolver = resolve
      state.open = true
    })
  }

  const respond = (value: boolean) => {
    state.open = false
    state.resolver?.(value)
    state.resolver = null
  }

  return { confirm, respond, state: readonly(state) }
}
