import './style.css'
// import 'virtual:windi-devtools'
import 'virtual:windi.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { App } from './App'
import { router } from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(router)
app.mount('#app')
