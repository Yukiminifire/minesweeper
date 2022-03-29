import { ref } from 'vue'

import { useToggle } from '@vueuse/core'

export const isDev = ref(false)

export const toggleDev = useToggle(isDev)
