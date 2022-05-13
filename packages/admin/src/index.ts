import './style.css'
// import 'virtual:windi-devtools'
import 'virtual:windi.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { App } from './App'
import { router } from './router'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(router)
app.mount('#app')
