<script setup>
import { RouterLink } from 'vue-router'

import { useProfile } from '@/composables/useProfile'

const {
  currentUser,
  activeTab,
  isUploadFormVisible,
  draftItem,
  modelItems,
  datasetItems,
  stats,
  subscriptions,
  addInventoryItem
} = useProfile()
</script>

<template>
  <section class="container py-5">
    <div class="row">
      <aside class="col-lg-4 mb-4">
        <article class="card border-0 shadow-sm text-center p-4">
          <div class="position-relative d-inline-block mx-auto mb-3">
            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=F4A261&color=fff&size=128`"
              class="rounded-circle"
              style="border: 5px solid var(--page-bg);"
              alt="Аватар пользователя"
            >
          </div>
          <h1 class="h4 fw-bold">{{ currentUser.name }}</h1>
          <p class="text-muted small">Выращиваю нейросети с 2024 года • {{ currentUser.city }}</p>

          <ul class="list-unstyled d-flex justify-content-around mt-4 py-3 bg-light rounded-4 mb-0">
            <li v-for="item in stats" :key="item.label">
              <strong class="d-block">{{ item.value }}</strong>
              <small class="text-muted">{{ item.label }}</small>
            </li>
          </ul>

          <button type="button" class="btn btn-outline-primary btn-sm w-100 mt-4">
            Редактировать профиль
          </button>
        </article>
      </aside>

      <main id="main-content" class="col-lg-8" tabindex="-1">
        <div class="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm" id="profileTabs">
          <button
            type="button"
            class="nav-link rounded-3"
            :class="{ active: activeTab === 'uploads' }"
            @click="activeTab = 'uploads'"
          >
            Мои саженцы
          </button>
          <button
            type="button"
            class="nav-link rounded-3"
            :class="{ active: activeTab === 'subs' }"
            @click="activeTab = 'subs'"
          >
            Подписки
          </button>
        </div>

        <section v-if="activeTab === 'uploads'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h4 fw-bold mb-0">Мой инвентарь</h2>
            <button type="button" class="btn btn-accent shadow-sm" @click="isUploadFormVisible = !isUploadFormVisible">
              {{ isUploadFormVisible ? 'Скрыть форму' : 'Добавить в сад' }}
            </button>
          </div>

          <div v-if="isUploadFormVisible" class="card border-0 shadow-sm p-4 mb-4">
            <h3 class="h5 fw-bold mb-3">Новое пополнение</h3>
            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase" for="modelType">Что вы сажаете?</label>
              <select id="modelType" v-model="draftItem.type" class="form-select bg-light border-0 py-2">
                <option value="model">Нейронную модель</option>
                <option value="dataset">Набор данных</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="form-label small fw-bold text-uppercase" for="modelName">Название</label>
              <input id="modelName" v-model="draftItem.name" class="form-control" type="text" placeholder="Введите имя...">
            </div>
            <button type="button" class="btn btn-primary w-100" @click="addInventoryItem">Запустить рост</button>
          </div>

          <h3 class="text-uppercase small fw-bold text-muted mb-3" style="letter-spacing: 1px;">Модели</h3>
          <article
            v-for="model in modelItems"
            :key="model.id"
            class="card border-0 shadow-sm mb-3 card-hover"
          >
            <div class="card-body d-flex justify-content-between align-items-center p-4">
              <div class="d-flex align-items-center">
                <div class="bg-soft-blue p-3 rounded-4 me-3" aria-hidden="true">🌳</div>
                <div>
                  <h4 class="h6 mb-1 fw-bold">
                    <RouterLink :to="{ name: 'details', params: { slug: model.slug } }" class="text-decoration-none text-reset">
                      {{ model.name }}
                    </RouterLink>
                  </h4>
                  <span class="badge badge-model mb-1">Model</span>
                  <br><small class="text-muted">{{ model.framework }} • {{ model.size }}</small>
                </div>
              </div>
              <RouterLink :to="{ name: 'details', params: { slug: model.slug } }" class="btn btn-sm btn-outline-primary">
                Открыть
              </RouterLink>
            </div>
          </article>

          <h3 class="text-uppercase small fw-bold text-muted mb-3 mt-4" style="letter-spacing: 1px;">Наборы данных</h3>
          <article
            v-for="dataset in datasetItems"
            :key="dataset.id"
            class="card border-0 shadow-sm mb-3 card-hover"
          >
            <div class="card-body d-flex justify-content-between align-items-center p-4">
              <div class="d-flex align-items-center">
                <div class="bg-soft-green p-3 rounded-4 me-3" aria-hidden="true">🌱</div>
                <div>
                  <h4 class="h6 mb-1 fw-bold">{{ dataset.name }}</h4>
                  <span class="badge badge-dataset mb-1">Dataset</span>
                  <br><small class="text-muted">{{ dataset.license }} • {{ dataset.size }}</small>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary">Изучить</button>
            </div>
          </article>
        </section>

        <section v-else>
          <h2 class="h4 fw-bold mb-4">Сады, за которыми вы следите</h2>
          <article
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="card border-0 shadow-sm mb-3 card-hover"
          >
            <div class="card-body d-flex justify-content-between align-items-center p-3">
              <div class="d-flex align-items-center">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(subscription.name)}&background=A2C2E1`"
                  class="rounded-circle me-3"
                  width="50"
                  height="50"
                  alt="Аватар пользователя"
                >
                <div>
                  <h3 class="h6 mb-0 fw-bold">{{ subscription.name }}</h3>
                  <small class="text-muted">{{ subscription.models }} моделей • {{ subscription.label }}</small>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary">В гости</button>
            </div>
          </article>
        </section>
      </main>
    </div>
  </section>
</template>
