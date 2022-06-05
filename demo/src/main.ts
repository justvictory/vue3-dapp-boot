import { createApp } from 'vue'
import App from './App.vue'
import 'windi.css'
import './style.css'
import { VueDapp } from 'vue3-dapp-boot'

const app = createApp(App)

app.use(VueDapp)

app.mount('#app')
