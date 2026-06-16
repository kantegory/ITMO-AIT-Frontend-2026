<script setup>
import { onMounted, reactive, ref } from 'vue'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import ProfileList from '@/components/ProfileList.vue'
import ProfileStats from '@/components/ProfileStats.vue'
import { useProfile } from '@/composables/useProfile'

const { profile, loading, error, publicationError, loadProfile, createPublication } = useProfile()
const showPublicationForm = ref(false)
const publicationForm = reactive({
  title: '',
  type: 'Подборка',
  status: 'draft',
  resourceType: 'model',
})

onMounted(() => {
  loadProfile()
})

async function submitPublication() {
  await createPublication({ ...publicationForm })
  publicationForm.title = ''
  publicationForm.type = 'Подборка'
  publicationForm.resourceType = 'model'
  showPublicationForm.value = false
}
</script>

<template>
  <main class="container py-4 d-flex flex-column gap-4">
    <BaseLoader v-if="loading && !profile" />
    <BaseAlert v-else-if="error" type="danger">{{ error }}</BaseAlert>

    <template v-else-if="profile">
      <section class="hub-card">
        <div class="row g-4 align-items-start">
          <div class="col-lg-8">
            <span class="hero-badge mb-3">Личный кабинет</span>
            <h1 class="fw-bold mt-3 mb-1">{{ profile.user.name }}</h1>
            <p class="muted mb-0">@{{ profile.user.username }} · {{ profile.user.bio }}</p>
          </div>
          <div class="col-lg-4">
            <ProfileStats :stats="profile.stats" />
          </div>
        </div>
      </section>

      <section class="row g-4">
        <div class="col-lg-8 d-flex flex-column gap-4">
          <ProfileList title="Мои публикации" empty-text="Публикаций пока нет." :items="profile.publications">
            <template #header>
              <div class="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
                <h2 class="fw-bold fs-4 mb-0">Мои публикации</h2>
                <button class="btn btn-light" type="button" @click="showPublicationForm = !showPublicationForm">
                  Добавить
                </button>
              </div>

              <form v-if="showPublicationForm" class="inner-box mb-3" @submit.prevent="submitPublication">
                <label class="form-label fw-semibold" for="pubTitle">Название</label>
                <input id="pubTitle" v-model="publicationForm.title" class="form-control mb-3" required />

                <label class="form-label fw-semibold" for="pubType">Тип</label>
                <select id="pubType" v-model="publicationForm.type" class="form-select mb-3">
                  <option>Подборка</option>
                  <option>Заметка</option>
                </select>

                <label class="form-label fw-semibold" for="resourceType">Ресурс</label>
                <select id="resourceType" v-model="publicationForm.resourceType" class="form-select mb-3">
                  <option value="model">Модель</option>
                  <option value="dataset">Датасет</option>
                </select>

                <div v-if="publicationError" class="alert alert-danger">{{ publicationError }}</div>

                <div class="d-flex gap-2">
                  <button class="btn btn-primary" type="submit">Сохранить</button>
                  <button class="btn btn-light" type="button" @click="showPublicationForm = false">Отмена</button>
                </div>
              </form>
            </template>

            <template #default="{ items }">
              <div v-for="item in items" :key="item.id" class="list-item d-flex justify-content-between gap-3 align-items-start">
                <div>
                  <div class="fw-semibold">{{ item.title }}</div>
                  <div class="muted small">{{ item.type }} · {{ item.status }}</div>
                </div>
                <span class="chip">{{ item.resourceType }}</span>
              </div>
            </template>
          </ProfileList>

          <ProfileList title="Активность" empty-text="Активности пока нет." :items="profile.activity">
            <template #default="{ items }">
              <div v-for="item in items" :key="item.id" class="list-item">
                <div>{{ item.text }}</div>
                <div class="muted small mt-2">{{ new Date(item.createdAt).toLocaleString('ru-RU') }}</div>
              </div>
            </template>
          </ProfileList>
        </div>

        <aside class="col-lg-4 d-flex flex-column gap-4">
          <ProfileList title="Избранное" empty-text="Избранное пусто." :items="profile.favorites">
            <template #default="{ items }">
              <div v-for="item in items" :key="item.id" class="list-item">
                <div class="fw-semibold">{{ item.title }}</div>
                <div class="muted small">{{ item.author || '—' }} · {{ item.subtitle || '—' }}</div>
              </div>
            </template>
          </ProfileList>

          <ProfileList title="Подписки" empty-text="Подписок нет." :items="profile.subscriptions">
            <template #default="{ items }">
              <div v-for="item in items" :key="item.id" class="list-item">
                <div class="fw-semibold">{{ item.name }}</div>
                <div class="muted small">{{ item.updates }}</div>
              </div>
            </template>
          </ProfileList>
        </aside>
      </section>
    </template>
  </main>
</template>
