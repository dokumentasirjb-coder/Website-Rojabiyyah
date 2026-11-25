import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ConfirmVariant = 'danger' | 'warning' | 'info'

export const useUiStore = defineStore('ui', () => {
  const toast = ref<{
    show: boolean
    message: string
    type: ToastType
  }>({
    show: false,
    message: '',
    type: 'info',
  })

  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function notify(message: string, type: ToastType = 'warning') {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { show: true, message, type }
    toastTimer = setTimeout(() => {
      toast.value.show = false
    }, 3800)
  }

  function closeToast() {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value.show = false
  }

  const confirmModal = ref<{
    show: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    variant: ConfirmVariant
  }>({
    show: false,
    title: 'Konfirmasi',
    message: '',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'danger',
  })

  let confirmResolver: ((value: boolean) => void) | null = null

  function askConfirm(
    message: string,
    options?: {
      title?: string
      confirmText?: string
      cancelText?: string
      variant?: ConfirmVariant
    }
  ): Promise<boolean> {
    if (confirmResolver) {
      confirmResolver(false)
      confirmResolver = null
    }

    confirmModal.value = {
      show: true,
      title: options?.title || 'Konfirmasi Tindakan',
      message,
      confirmText: options?.confirmText || 'Ya, Hapus',
      cancelText: options?.cancelText || 'Batal',
      variant: options?.variant || 'danger',
    }

    return new Promise<boolean>((resolve) => {
      confirmResolver = resolve
    })
  }

  function resolveConfirm(accepted: boolean) {
    confirmModal.value.show = false
    if (confirmResolver) {
      const fn = confirmResolver
      confirmResolver = null
      fn(accepted)
    }
  }

  return {
    toast,
    notify,
    closeToast,
    confirmModal,
    askConfirm,
    resolveConfirm,
  }
})
