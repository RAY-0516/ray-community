import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/global.css'
import './styles/reset.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'default' })

app.mount('#app')
