import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

export function runVue() {
  if (typeof createApp !== 'function') {
    console.error(
      'MyNovelReader: Vue 3 createApp is not available. Check userscript @require for Vue.'
    );
    return;
  }

  const pinia = createPinia();
  const app = createApp(App);
  app.use(pinia);
  app.mount('#mynovelreader-app');
}
