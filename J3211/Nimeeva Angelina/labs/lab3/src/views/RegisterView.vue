<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login, cabinetRoute } = useAuth()

const form = ref({
  role: 'tenant',
  accessRole: 'Основной подписант',
  company: '',
  inn: '',
  room: '',
  leaseType: 'Офис',
  contact: '',
  phone: '',
  email: '',
  password: '',
  passwordRepeat: '',
  comment: '',
  agreement: false,
})
const showPassword = ref(false)
const showPassword2 = ref(false)
const showSuccess = ref(false)

const handleRegister = () => {
  login(form.value.role, { name: form.value.company, role: form.value.role, room: form.value.room })
  showSuccess.value = true
}

const goCabinet = () => {
  showSuccess.value = false
  router.push(cabinetRoute())
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <div class="row g-4 align-items-stretch">
      <div class="col-xl-8">
        <section class="page-card h-100">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Регистрация</span>
          <h1 class="section-title">Создать кабинет</h1>
          <p class="section-text">Форма одна, а после регистрации пользователь попадает в кабинет своей роли.</p>
          <form class="row g-3 mt-1" @submit.prevent="handleRegister">
            <div class="col-md-6">
              <label class="form-label" for="accountRole">Роль</label>
              <select v-model="form.role" class="form-select" id="accountRole" required>
                <option value="tenant">Арендатор</option>
                <option value="admin">Администрация</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="accessRole">Доступ</label>
              <select v-model="form.accessRole" class="form-select" id="accessRole">
                <option>Основной подписант</option>
                <option>Менеджер</option>
                <option>Оператор</option>
              </select>
            </div>
            <div class="col-md-7">
              <label class="form-label" for="companyName">Компания</label>
              <input v-model="form.company" class="form-control" id="companyName" type="text" placeholder="ООО «Северная линия»" required />
            </div>
            <div class="col-md-5">
              <label class="form-label" for="companyInn">ИНН / код</label>
              <input v-model="form.inn" class="form-control" id="companyInn" type="text" placeholder="7801234567" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="companyRoom">Помещение / отдел</label>
              <input v-model="form.room" class="form-control" id="companyRoom" type="text" placeholder="3.18" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="leaseType">Формат</label>
              <select v-model="form.leaseType" class="form-select" id="leaseType">
                <option>Офис</option><option>Шоурум</option><option>Склад</option><option>Администрация</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="contactName">Контактное лицо</label>
              <input v-model="form.contact" class="form-control" id="contactName" type="text" placeholder="Анна Петрова" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="contactPhone">Телефон</label>
              <input v-model="form.phone" class="form-control" id="contactPhone" type="tel" placeholder="+7 (999) 000-00-00" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="contactEmail">Почта</label>
              <input v-model="form.email" class="form-control" id="contactEmail" type="email" placeholder="office@company.ru" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="registerPassword">Пароль</label>
              <div class="input-group">
                <input v-model="form.password" class="form-control" id="registerPassword" :type="showPassword ? 'text' : 'password'" placeholder="Минимум 8 символов" required />
                <button class="btn btn-outline-brand" type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Скрыть' : 'Показать' }}</button>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="registerPasswordRepeat">Повтор пароля</label>
              <div class="input-group">
                <input v-model="form.passwordRepeat" class="form-control" id="registerPasswordRepeat" :type="showPassword2 ? 'text' : 'password'" placeholder="Повторите пароль" required />
                <button class="btn btn-outline-brand" type="button" @click="showPassword2 = !showPassword2">{{ showPassword2 ? 'Скрыть' : 'Показать' }}</button>
              </div>
            </div>
            <div class="col-12">
              <div class="form-check">
                <input v-model="form.agreement" class="form-check-input" id="registerAgreement" type="checkbox" required />
                <label class="form-check-label" for="registerAgreement">Подтверждаю корректность данных.</label>
              </div>
            </div>
            <div class="col-12 d-flex flex-wrap gap-3 pt-2">
              <button class="btn btn-brand" type="submit">Создать кабинет</button>
              <RouterLink class="btn btn-outline-brand" to="/">Вернуться ко входу</RouterLink>
            </div>
          </form>
        </section>
      </div>

      <div class="col-xl-4">
        <section class="hero-card h-100">
          <span class="eyebrow">Как это работает</span>
          <h2>После регистрации открывается только нужный кабинет</h2>
          <ul class="info-list mt-4">
            <li>Выбрали роль.</li>
            <li>Заполнили данные компании.</li>
            <li>Получили доступ в кабинет арендатора или администрации.</li>
          </ul>
          <div class="stat-grid mt-4">
            <div class="stat-card"><strong>2 маршрута</strong><span>арендатор и администрация</span></div>
            <div class="stat-card"><strong>1 форма</strong><span>без лишних шагов</span></div>
          </div>
        </section>
      </div>
    </div>
  </main>

  <template v-if="showSuccess">
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" @click.self="showSuccess = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-4">Кабинет создан</h2>
            <button class="btn-close" type="button" @click="showSuccess = false" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2 fw-semibold">Роль: {{ form.role === 'admin' ? 'Администрация' : 'Арендатор' }}</p>
            <p class="mb-0">Заявка отправлена. После подтверждения можно будет войти под выбранной ролью.</p>
          </div>
          <div class="modal-footer">
            <RouterLink class="btn btn-outline-brand" to="/" @click="showSuccess = false">Ко входу</RouterLink>
            <button class="btn btn-brand" type="button" @click="goCabinet">Открыть демо-кабинет</button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

