import Vue from 'vue'
import App from './App.vue'

export function runVue() {
  new Vue({
    el: '#mynovelreader-app',
    render: h => h(App)
  })
}