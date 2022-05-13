import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

export const useInfo = ref({
  name: '',
  token: '',
})

useLocalStorage('userInfo', useInfo)
