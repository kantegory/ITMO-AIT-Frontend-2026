<template>
  <div>
    <div class="menu-btn-container position-absolute top-0 start-0 p-3">
        <button class="btn btn-outline-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#mySidebar">
            ☰ Меню
        </button>
    </div>

    <div class="offcanvas offcanvas-start" tabindex="-1" id="mySidebar" aria-labelledby="offcanvasTitle">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasTitle">MyFinance</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
        </div>
        <div class="offcanvas-body">
            <nav class="nav flex-column">
                <a class="nav-link" href="#" @click.prevent="goTo('/')">Личный кабинет</a>
                <a class="nav-link" href="#" @click.prevent="goTo('/transactions')">Транзакции</a>
                <a class="nav-link" href="#" @click.prevent="goTo('/integrations')">Интеграции</a>
                <a class="nav-link" href="#" @click.prevent="goTo('/reports')">Отчёт</a>
                
                <hr class="border-secondary">

                <button id="themeToggle" @click="toggleTheme" class="nav-link border-0 bg-transparent text-start d-flex align-items-center">
                    <svg class="icon-svg me-2" style="width:20px; height:20px;">
                        <use :href="isLight ? '/sprite.svg#icon-moon' : '/sprite.svg#icon-sun'"></use>
                    </svg> 
                    <span>{{ isLight ? 'Тёмная тема' : 'Светлая тема' }}</span>
                </button>
                
                <a class="nav-link text-danger fw-bold mt-2 d-flex align-items-center" href="#" @click.prevent="logout">
                    <svg class="icon-svg me-2" style="width:20px; height:20px;"><use href="/sprite.svg#icon-logout"></use></svg>
                    Выход
                </a>
            </nav>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

const { isLight, toggleTheme, initTheme } = useTheme()
const router = useRouter()

const goTo = (path) => {
  const offcanvasElement = document.getElementById('mySidebar')
  const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement)
  
  if (bsOffcanvas) {
    bsOffcanvas.hide()
    offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
      router.push(path)
    }, { once: true })
  } else {
    router.push(path)
  }
}

const logout = () => {
  localStorage.removeItem('userName')
  goTo('/login')
}

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.nav-link {
    cursor: pointer;
    padding: 10px 15px;
    border-radius: 5px;
    transition: 0.2s;
}
.nav-link:hover {
    background: var(--bg-hover);
}
</style>