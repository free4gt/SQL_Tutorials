import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vKatex } from './directives/katex.js'

const app = createApp(App)
app.use(createPinia())
app.directive('katex', vKatex)
app.mount('#app')