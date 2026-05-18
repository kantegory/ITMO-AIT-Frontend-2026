import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Tooltip } from 'bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
app.directive('tooltip', {
  mounted(el, binding) {
    new Tooltip(el, {
      title: binding.value,
      placement: el.getAttribute('data-bs-placement') || 'top',
      trigger: 'hover'
    })
  },
  unmounted(el) {
    const tooltip = Tooltip.getInstance(el)
    if (tooltip) tooltip.dispose()
  }
})