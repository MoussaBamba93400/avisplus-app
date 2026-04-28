import { toast as sonner } from 'vue-sonner'

interface ToastOptions {
  description?: string
  duration?: number
}

interface PromiseMessages<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((err: unknown) => string)
}

const extractMessage = (err: unknown, fallback: string): string => {
  const e = err as {
    data?: { message?: string; errors?: Record<string, string[]> }
    message?: string
  }
  if (e?.data?.errors) {
    return Object.values(e.data.errors).flat().join(' • ')
  }
  return e?.data?.message ?? e?.message ?? fallback
}

export const useToast = () => {
  const success = (message: string, opts?: ToastOptions) =>
    sonner.success(message, opts)

  const error = (message: string | unknown, opts?: ToastOptions) => {
    const text = typeof message === 'string'
      ? message
      : extractMessage(message, 'Une erreur est survenue.')
    return sonner.error(text, opts)
  }

  const info = (message: string, opts?: ToastOptions) =>
    sonner(message, opts)

  const warning = (message: string, opts?: ToastOptions) =>
    sonner.warning(message, opts)

  const loading = (message: string) => sonner.loading(message)

  const dismiss = (id?: string | number) => sonner.dismiss(id)

  const promise = <T>(p: Promise<T>, msgs: PromiseMessages<T>) =>
    sonner.promise<T>(p, msgs)

  return { success, error, info, warning, loading, dismiss, promise }
}
