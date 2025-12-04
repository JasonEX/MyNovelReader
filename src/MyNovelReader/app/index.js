import { createApp } from 'vue'
import App from './App.vue'

export function runVue() {
  const app = createApp(App)
  app.mount('#mynovelreader-app')
}