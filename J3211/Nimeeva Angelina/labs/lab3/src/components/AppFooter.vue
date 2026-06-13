<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { useTheme } from '../composables/useTheme.js'

const { role, cabinetRoute } = useAuth()
const { theme, toggleTheme } = useTheme()

const footerLinks = computed(() => {
  if (role.value) {
    return [
      { to: cabinetRoute(), label: 'Кабинет' },
      { to: '/archive', label: 'Архив' },
      { to: '/search', label: 'Помещения' },
    ]
  }
  return [
    { to: '/', label: 'Вход' },
    { to: '/register', label: 'Регистрация' },
    { to: '/search', label: 'Помещения' },
  ]
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container py-4">
      <div class="footer-grid">
        <div>
          <div class="brand-lockup">
            <img class="brand-mark" src="/img/logo_header.svg" alt="Логотип Красной нити" />
            <span class="brand-text">
              <span class="brand-title">Красная нить</span>
              <span class="brand-caption" style="color: rgba(255,255,255,0.5)">портал арендаторов</span>
            </span>
          </div>
        </div>
        <div>
          <div class="footer-title">Контакты</div>
          <p class="mb-1">Санкт-Петербург, Гельсингфорссская, 3</p>
          <p class="mb-1"><a href="tel:+78126128734">+7 (812) 612-87-34</a></p>
          <p class="mb-0"><a href="mailto:arenda@krnit.ru">arenda@krnit.ru</a></p>
        </div>
        <div>
          <div class="footer-title">Разделы</div>
          <ul class="footer-links">
            <li v-for="link in footerLinks" :key="link.to">
              <RouterLink :to="link.to">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-note">
        <span class="footer-note-text">© {{ year }} Красная нить</span>
        <button class="theme-toggle" type="button" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'">
          {{ theme === 'dark' ? 'Тема: тёмная' : 'Тема: светлая' }}
        </button>
      </div>
    </div>
  </footer>
</template>
