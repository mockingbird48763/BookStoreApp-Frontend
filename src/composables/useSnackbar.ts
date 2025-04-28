import { ref } from 'vue'

const isVisible = ref(false)
const text = ref('')
const color = ref<'success' | 'error' | 'warning' | 'info'>('success')
const timeout = ref(1000)
const location = ref<'top right' | 'top center'>('top right')

export function useSnackbar() {
  const show = (
    message: string,
    messageColor: typeof color.value = 'success',
    timeoutMs: number = 1000,
    showLocation: typeof location.value = 'top right',
  ) => {
    text.value = message
    color.value = messageColor
    isVisible.value = true
    timeout.value = timeoutMs
    location.value = showLocation
  }

  const hide = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    text,
    color,
    show,
    hide,
    timeout,
    location,
  }
}
