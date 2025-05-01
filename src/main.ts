import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import Clarity from '@microsoft/clarity';

const app = createApp(App)
app.use(router)
app.mount('#app')

// Clarity.init("qokqhyom2b");