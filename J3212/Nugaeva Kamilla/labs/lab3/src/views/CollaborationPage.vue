<template>
  <template v-if="!currentUser">
    <section class="panel">
      <span class="page-kicker">Совместное планирование</span>

      <h1 class="page-title">
        Нужно войти в аккаунт
      </h1>

      <p class="page-subtitle mb-4">
        Чтобы делиться маршрутами и оставлять заметки для друзей, сначала выполните вход.
      </p>

      <RouterLink class="btn btn-primary" to="/login">
        Перейти ко входу
      </RouterLink>
    </section>
  </template>

  <template v-else>
    <section class="page-intro mb-4">
      <div>
        <span class="page-kicker">Совместное планирование</span>

        <h1 class="page-title">
          Поделиться маршрутом
        </h1>

        <p class="page-subtitle mb-0">
          Демо-страница для обмена идеями и короткими заметками о поездке.
        </p>
      </div>

      <div class="intro-badge-wrap d-flex gap-3 align-items-center">
        <span class="soft-counter" aria-live="polite">
          {{ sharedItems.length }}
        </span>

        <button
          class="btn subtle-action-btn"
          type="button"
          :disabled="sharedItems.length === 0 || loading"
          @click="handleClear"
        >
          Очистить
        </button>
      </div>
    </section>

    <div class="row g-4 align-items-stretch">
      <aside class="col-12 col-lg-4">
        <section class="panel collaboration-form-panel h-100">
          <h2 class="section-heading mb-1 icon-label">
            <span>Новая запись</span>
          </h2>

          <p class="section-caption">
            Укажите, кому вы хотите отправить маршрут, и добавьте заметку.
          </p>

          <div v-if="formError" class="alert alert-danger" role="alert">
            {{ formError }}
          </div>

          <div v-if="formMessage" class="alert alert-success" role="alert">
            {{ formMessage }}
          </div>

          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <label for="shareTo" class="form-label">
                Кому
              </label>

              <input
                id="shareTo"
                v-model.trim="form.to"
                type="text"
                class="form-control"
                placeholder="Например, Маша"
                required
              />
            </div>

            <div class="mb-3">
              <label for="shareTitle" class="form-label">
                Маршрут
              </label>

              <input
                id="shareTitle"
                v-model.trim="form.title"
                type="text"
                class="form-control"
                placeholder="Например, Прага на 4 дня"
                required
              />
            </div>

            <div class="mb-3">
              <label for="shareType" class="form-label">
                Тип
              </label>

              <select
                id="shareType"
                v-model="form.type"
                class="form-select"
              >
                <option value="city">Город</option>
                <option value="nature">Природа</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="shareNote" class="form-label">
                Заметка
              </label>

              <textarea
                id="shareNote"
                v-model.trim="form.note"
                class="form-control"
                rows="5"
                placeholder="Напишите, что важно учесть..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Отправляем...' : 'Отправить' }}
            </button>
          </form>

          <p class="text-muted small mt-3 mb-0">
            Заметки сохраняются через mock API JSON Server.
          </p>
        </section>
      </aside>

      <section class="col-12 col-lg-8">
        <section class="panel collaboration-feed-panel h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="section-heading mb-1 icon-label">
                <span>Лента</span>
              </h2>

              <p class="section-caption mb-0">
                Последние отправленные маршруты и заметки.
              </p>
            </div>
          </div>

          <div v-if="loading" class="text-muted">
            Загружаем записи...
          </div>

          <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>

          <div v-else-if="sharedItems.length === 0" class="empty-state">
            Пока нет отправленных маршрутов. Создайте первую запись в форме слева.
          </div>

          <div v-else class="shared-feed-list" aria-live="polite">
            <SharedItemCard
              v-for="item in sharedItems"
              :key="item.id"
              :item="item"
              @delete="handleDelete"
            />
          </div>
        </section>
      </section>
    </div>
  </template>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import SharedItemCard from '../components/SharedItemCard.vue'
import { useAuth } from '../composables/useAuth'
import { useSharedItems } from '../composables/useSharedItems'

const { currentUser } = useAuth()

const {
  sharedItems,
  loading,
  error,
  loadSharedItems,
  createSharedItem,
  deleteSharedItem,
  clearSharedItems,
} = useSharedItems()

const isSubmitting = ref(false)
const formError = ref('')
const formMessage = ref('')

const form = reactive({
  to: '',
  title: '',
  type: 'city',
  note: '',
})

function resetForm() {
  form.to = ''
  form.title = ''
  form.type = 'city'
  form.note = ''
}

function validateForm() {
  if (!form.to) {
    throw new Error('Укажите, кому отправляется маршрут.')
  }

  if (!form.title) {
    throw new Error('Введите название маршрута.')
  }
}

async function handleCreate() {
  formError.value = ''
  formMessage.value = ''

  try {
    validateForm()

    isSubmitting.value = true

    await createSharedItem({
      userId: currentUser.value.id,
      authorName: currentUser.value.name,
      to: form.to,
      title: form.title,
      type: form.type,
      note: form.note,
    })

    resetForm()
    formMessage.value = 'Маршрут добавлен в общую ленту.'
  } catch (error) {
    formError.value = error.message || 'Не удалось создать запись.'
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(itemId) {
  await deleteSharedItem(itemId)
}

async function handleClear() {
  await clearSharedItems()
}

onMounted(() => {
  if (!currentUser.value) {
    return
  }

  loadSharedItems()
})
</script>