import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/vReveal.js'

const app = createApp(App)

// Register global directive
app.directive('reveal', vReveal)

// Use Vue Router
app.use(router)

app.mount('#app')
