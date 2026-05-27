<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { login, cabinetRoute } = useAuth()
const { showToast } = useToast()

const email = ref('')
const password = ref('')
const selectedRole = ref('tenant')
const showPassword = ref(false)
const showRecovery = ref(false)

const DEMO_USERS = [
  { email: 'tenant@company.ru', password: 'tenant123', role: 'tenant', name: 'ООО «Северная линия»', room: '3.18' },
  { email: 'admin@company.ru',  password: 'admin123',  role: 'admin',  name: 'Администрация' },
]

const handleLogin = () => {
  const found = DEMO_USERS.find(u => u.email === email.value && u.password === password.value)
  const user = found || { role: selectedRole.value, name: selectedRole.value === 'admin' ? 'Администрация' : 'Арендатор' }
  login(user.role, user)
  router.push(cabinetRoute())
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-7">
        <section class="hero-card h-100">
          <span class="eyebrow">Вход в систему</span>
          <h1>Один вход для арендатора и администрации</h1>
          <p class="section-text">Здесь только базовые сценарии: войти, зарегистрироваться и посмотреть свободные помещения.</p>
          <div class="stat-grid mt-4">
            <div class="stat-card"><strong>2 роли</strong><span>арендатор и администрация</span></div>
            <div class="stat-card"><strong>1 архив</strong><span>договоры, акты и счета</span></div>
            <div class="stat-card"><strong>24/7</strong><span>доступ к документам</span></div>
          </div>
          <ul class="info-list mt-4">
            <li>После входа пользователь сразу попадает в свой кабинет.</li>
            <li>Каталог помещений доступен без авторизации.</li>
            <li>Демо: tenant@company.ru / tenant123 или admin@company.ru / admin123.</li>
          </ul>
          <div class="d-flex flex-wrap gap-3 mt-4">
            <RouterLink class="btn btn-brand" to="/search">Смотреть помещения</RouterLink>
            <RouterLink class="btn btn-outline-brand" to="/register">Создать кабинет</RouterLink>
          </div>
        </section>
      </div>

      <div class="col-lg-5">
        <section class="page-card h-100">
          <span class="eyebrow text-dark" style="color: var(--eyebrow-accent) !important">Авторизация</span>
          <h2 class="section-title">Войти</h2>
          <p class="section-text">Выберите роль и перейдите в нужный кабинет.</p>
          <form class="row g-3 mt-1" @submit.prevent="handleLogin">
            <div class="col-12">
              <label class="form-label" for="loginEmail">Почта</label>
              <input v-model="email" class="form-control" id="loginEmail" type="email" placeholder="tenant@company.ru" required />
            </div>
            <div class="col-12">
              <label class="form-label" for="loginPassword">Пароль</label>
              <div class="input-group">
                <input v-model="password" class="form-control" id="loginPassword" :type="showPassword ? 'text' : 'password'" placeholder="Введите пароль" required />
                <button class="btn btn-outline-brand" type="button" @click="showPassword = !showPassword">
                  {{ showPassword ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
            </div>
            <div class="col-12">
              <label class="form-label" for="loginRole">Роль</label>
              <select v-model="selectedRole" class="form-select" id="loginRole">
                <option value="tenant">Арендатор</option>
                <option value="admin">Администрация</option>
              </select>
            </div>
            <div class="col-12 pt-2">
              <button class="btn btn-brand w-100" type="submit">Войти</button>
            </div>
          </form>
          <div class="d-flex flex-wrap justify-content-between gap-3 mt-4">
            <button class="btn btn-link p-0 text-decoration-none" type="button" @click="showRecovery = true">
              Забыли пароль?
            </button>
            <RouterLink class="muted-link" to="/register">Нет кабинета? Регистрация</RouterLink>
          </div>
        </section>
      </div>
    </div>
  </main>

  <template v-if="showRecovery">
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" @click.self="showRecovery = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-4">Восстановление доступа</h2>
            <button class="btn-close" type="button" @click="showRecovery = false" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label" for="recoveryEmail">Почта</label>
              <input class="form-control" id="recoveryEmail" type="email" placeholder="office@company.ru" />
            </div>
            <div>
              <label class="form-label" for="recoveryRole">Роль</label>
              <select class="form-select" id="recoveryRole">
                <option>Арендатор</option>
                <option>Администрация</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-brand" type="button" @click="showRecovery = false">Отмена</button>
            <button class="btn btn-brand" type="button" @click="showRecovery = false; showToast('Письмо отправлено.')">Отправить</button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

