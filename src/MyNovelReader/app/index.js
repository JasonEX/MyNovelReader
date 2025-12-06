import { createApp } from 'vue';
import App from './App.vue';

export function runVue() {
  if (typeof createApp !== 'function') {
    console.error(
      'MyNovelReader: Vue 3 createApp is not available. Check userscript @require for Vue.'
    );
    return;
  }

  const app = createApp(App);
  app.mount('#mynovelreader-app');
}
