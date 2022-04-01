import cloudbase from '@cloudbase/js-sdk'
import { ref } from 'vue'

async function init(app: cloudbase.app.App) {
  try {
    const auth = app.auth({ persistence: 'local' })
    await auth.anonymousAuthProvider().signIn()
    return true
  } catch (error) {
    return false
  }
}

export function useCloudbase() {
  const status = ref<'pending' | 'ready' | 'fail'>('pending')
  const app = cloudbase.init({
    env: 'minesweeper-cloudbase-7a2ff16b6d',
  })

  init(app).then((pass) => {
    if (pass) {
      status.value = 'ready'
    } else {
      status.value = 'fail'
    }
  })

  return {
    status,
    app,
  }
}
