<script setup>
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useProjectsStore } from '@/stores/projects'
import { useAnnotationsStore } from '@/stores/annotations'
import useRequest from '@/composables/useRequest'

import BaseLayout from '@/layouts/BaseLayout.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import StatCard from '@/components/profile/StatCard.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import PriceLabel from '@/components/common/PriceLabel.vue'

const auth = useAuthStore()
const profileStore = useProfileStore()
const projectsStore = useProjectsStore()
const annotationsStore = useAnnotationsStore()

const { loading: profileLoading, error: profileError } = useRequest(profileStore.loadProfile, { immediate: true })
const { loading: projectsLoading, error: projectsError } = useRequest(projectsStore.loadProjects, {
  immediate: true,
})
const { loading: annotationsLoading, error: annotationsError } = useRequest(annotationsStore.loadAnnotations, {
  immediate: true,
})

const profile = computed(() => ({
  avatar: '/img/generic_pfp.png',
  bio: '',
  balanceRub: 0,
  spentRub: 0,
  earnedRub: 0,
  validPercent: null,
  ...profileStore.profile,
}))
</script>

<template>
  <base-layout>
    <profile-header
      v-if="!profileLoading"
      :name="auth.user.name || auth.user.email"
      :avatar="profile.avatar"
      :bio="profile.bio"
      :balance-rub="profile.balanceRub"
    />

    <section class="profile-content py-5">
      <div class="container">
        <ul class="nav nav-tabs mb-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="orders-tab"
              data-bs-toggle="tab"
              data-bs-target="#orders"
              type="button"
              role="tab"
              aria-controls="orders"
              aria-selected="true"
            >
              Мои заказы
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="annotations-tab"
              data-bs-toggle="tab"
              data-bs-target="#annotations"
              type="button"
              role="tab"
              aria-controls="annotations"
              aria-selected="false"
            >
              Мои аннотации
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="stats-tab"
              data-bs-toggle="tab"
              data-bs-target="#stats"
              type="button"
              role="tab"
              aria-controls="stats"
              aria-selected="false"
            >
              Статистика
            </button>
          </li>
        </ul>

        <div class="tab-content">
          <div class="tab-pane fade show active" id="orders" role="tabpanel" aria-labelledby="orders-tab">
            <div class="row g-4">
              <div v-if="projectsLoading" class="col-12">
                <p class="text-muted mb-0">Загрузка...</p>
              </div>
              <div v-else-if="projectsError" class="col-12">
                <p class="text-muted mb-0">Не удалось загрузить заказы: сервер недоступен</p>
              </div>
              <div v-else-if="projectsStore.projects.length === 0" class="col-12">
                <p class="text-muted mb-0">У вас пока нет заказов.</p>
              </div>
              <template v-else>
                <div v-for="project in projectsStore.projects" :key="project.id" class="col-md-6 col-lg-4">
                  <order-card :order="project.order">
                    <template #action>
                      <router-link class="btn btn-primary mt-auto" :to="{ name: 'project', params: { id: project.id } }">
                        Просмотреть
                      </router-link>
                    </template>
                  </order-card>
                </div>
              </template>
            </div>
          </div>

          <div class="tab-pane fade" id="annotations" role="tabpanel" aria-labelledby="annotations-tab">
            <div class="row g-4">
              <div v-if="annotationsLoading" class="col-12">
                <p class="text-muted mb-0">Загрузка...</p>
              </div>
              <div v-else-if="annotationsError" class="col-12">
                <p class="text-muted mb-0">Не удалось загрузить аннотации: сервер недоступен</p>
              </div>
              <div v-else-if="annotationsStore.annotations.length === 0" class="col-12">
                <p class="text-muted mb-0">
                  Вы ещё не приняли ни одного заказа.
                  <router-link :to="{ name: 'home' }">Выбрать заказ</router-link>
                </p>
              </div>
              <template v-else>
                <div v-for="annotation in annotationsStore.annotations" :key="annotation.id" class="col-md-6 col-lg-4">
                  <order-card :order="annotation.order">
                    <template #action>
                      <router-link
                        class="btn btn-primary mt-auto"
                        :to="{ name: 'annotation', params: { id: annotation.orderId } }"
                      >
                        Продолжить
                      </router-link>
                    </template>
                  </order-card>
                </div>
              </template>
            </div>
          </div>

          <div class="tab-pane fade" id="stats" role="tabpanel" aria-labelledby="stats-tab">
            <p v-if="profileError" class="text-muted">
              Не удалось загрузить статистику: сервер недоступен
            </p>
            <div class="row g-4">
              <div class="col-sm-6 col-lg-4">
                <stat-card label="Количество заказов">{{ projectsStore.projects.length }}</stat-card>
              </div>
              <div class="col-sm-6 col-lg-4">
                <stat-card label="Аннотированных проектов">{{ annotationsStore.annotations.length }}</stat-card>
              </div>
              <div class="col-sm-6 col-lg-4">
                <stat-card label="Потраченный бюджет"><price-label :rub="profile.spentRub" /></stat-card>
              </div>
              <div class="col-sm-6 col-lg-6">
                <stat-card label="Полученный бюджет"><price-label :rub="profile.earnedRub" /></stat-card>
              </div>
              <div class="col-sm-6 col-lg-6">
                <stat-card label="Валидных аннотаций">
                  {{ profile.validPercent === null ? '—' : `${profile.validPercent}%` }}
                </stat-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </base-layout>
</template>
