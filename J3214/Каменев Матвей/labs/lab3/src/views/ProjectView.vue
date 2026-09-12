<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import { useProjectsStore } from '@/stores/projects'
import useRequest from '@/composables/useRequest'
import useDocumentTitle from '@/composables/useDocumentTitle'

import BaseLayout from '@/layouts/BaseLayout.vue'
import ProjectHeader from '@/components/project/ProjectHeader.vue'
import DatapointCard from '@/components/project/DatapointCard.vue'
import AnnotatorsTable from '@/components/project/AnnotatorsTable.vue'

const route = useRoute()
const store = useProjectsStore()

const { loading, error, run: loadProject } = useRequest(store.loadProject)

watch(() => route.params.id, (id) => loadProject(id), { immediate: true })

useDocumentTitle(() => store.currentProject?.order.title)
</script>

<template>
  <base-layout>
    <div v-if="loading" class="container py-4">
      <p class="text-muted mb-0">Загрузка...</p>
    </div>
    <div v-else-if="error || !store.currentProject" class="container py-4">
      <p class="text-muted mb-0">
        Проект не найден или сервер недоступен.
        <router-link :to="{ name: 'profile' }">Вернуться в личный кабинет</router-link>
      </p>
    </div>
    <template v-else>
      <project-header
        :title="store.currentProject.order.title"
        :description="store.currentProject.order.description"
        :cover="store.currentProject.order.cover"
        :spent-rub="store.currentProject.spentRub"
      />

      <section class="project-content py-4">
        <div class="container">
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="datapoints-tab"
                data-bs-toggle="tab"
                data-bs-target="#datapoints"
                type="button"
                role="tab"
                aria-controls="datapoints"
                aria-selected="true"
              >
                Дата поинты
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="validation-tab"
                data-bs-toggle="tab"
                data-bs-target="#validation"
                type="button"
                role="tab"
                aria-controls="validation"
                aria-selected="false"
              >
                Валидация
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="annotators-tab"
                data-bs-toggle="tab"
                data-bs-target="#annotators"
                type="button"
                role="tab"
                aria-controls="annotators"
                aria-selected="false"
              >
                Аннотаторы
              </button>
            </li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade show active" id="datapoints" role="tabpanel" aria-labelledby="datapoints-tab">
              <div class="row g-3 dp-grid">
                <div
                  v-for="(datapoint, index) in store.currentProject.datapoints"
                  :key="index"
                  class="col-6 col-sm-4 col-md-3 col-lg-2"
                >
                  <datapoint-card :image="datapoint.image" />
                </div>
                <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                  <datapoint-card add />
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="validation" role="tabpanel" aria-labelledby="validation-tab">
              <div class="row g-4">
                <div
                  v-for="(item, index) in store.currentProject.validation"
                  :key="index"
                  class="col-sm-6 col-md-4 col-lg-3"
                >
                  <div class="validation-item">
                    <datapoint-card :image="item.image" />
                    <p class="validation-class fw-semibold mb-0 mt-2">{{ item.label }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="annotators" role="tabpanel" aria-labelledby="annotators-tab">
              <annotators-table :annotators="store.currentProject.annotators" />
            </div>
          </div>
        </div>
      </section>
    </template>
  </base-layout>
</template>
