import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

if (import.meta.env.PROD) {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}

  const meta = document.createElement('meta')
  meta.name = 'description'
  meta.content =
    'Descubra seu próximo filme favorito com filtros personalizados ou sorteio aleatório!'
  document.head.appendChild(meta)

  const ogTitle = document.createElement('meta')
  ogTitle.setAttribute('property', 'og:title')
  ogTitle.setAttribute('content', 'O Que Ver - Descubra Filmes Incríveis')
  document.head.appendChild(ogTitle)

  const ogDesc = document.createElement('meta')
  ogDesc.setAttribute('property', 'og:description')
  ogDesc.setAttribute(
    'content',
    'Com filtragem personalizada ou pura sorte, encontre seu novo filme favorito!',
  )
  document.head.appendChild(ogDesc)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  console.error('Erro global:', err)
  console.error('Info:', info)
}

app.mount('#app')
