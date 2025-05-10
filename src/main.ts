import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { registerSW } from 'virtual:pwa-register'
// import Clarity from '@microsoft/clarity';

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('[PWA] SW Offline Ready')
  }
})


const app = createApp(App)
app.use(router)
app.mount('#app')


// Clarity.init("qokqhyom2b");