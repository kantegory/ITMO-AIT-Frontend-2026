<template>
  <AppLayout>
    <template #header="{ toggleSidebar }">
      <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center">
              <button class="btn btn-light d-lg-none me-2" @click="toggleSidebar" aria-expanded="false" aria-controls="sidebar" aria-label="Открыть меню">
                  <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-list"></use></svg>
              </button>
              <h1 class="m-0 h2">Мои накопления</h1>
          </div>
          <button class="btn btn-primary btn-sm px-3 py-2" @click="openModal('goal')">
              <svg class="bi me-1" aria-hidden="true"><use href="/assets/sprite.svg#bi-plus-lg"></use></svg> Новая цель
          </button>
      </div>
    </template>

    <div v-if="!isDataLoaded" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-muted" aria-live="polite">Загрузка данных...</div>
    </div>

    <div v-else>
      <section class="row g-4" v-if="goals.length > 0" aria-label="Список целей">
        <!-- Карточка цели -->
        <div class="col-12 col-md-6 col-xl-4" v-for="g in goals" :key="g.id">
            <div class="card border-0 shadow-sm h-100 p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h2 class="m-0 fw-bold h5">
                        <svg class="bi text-primary me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-bullseye"></use></svg>
                        {{ g.name }}
                    </h2>
                    <div class="dropdown">
                        <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false" :aria-label="'Действия с целью ' + g.name">
                            <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-three-dots-vertical"></use></svg>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="openModal('goal', g)">
                                    <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-pencil"></use></svg>Редактировать
                                </a>
                            </li>
                            <li><hr class="dropdown-divider" aria-hidden="true"></li>
                            <li>
                                <a class="dropdown-item text-danger" href="#" @click.prevent="openModal('delete', { id: g.id, type: 'goal' })">
                                    <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-trash"></use></svg>Удалить
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="d-flex justify-content-between text-muted small mb-1">
                        <span>Накоплено: <strong>{{ g.currentAmount.toLocaleString() }} ₽</strong></span>
                        <span>Цель: {{ g.targetAmount.toLocaleString() }} ₽</span>
                    </div>
                    <!-- Доступный прогресс-бар -->
                    <div class="progress" style="height: 10px;" role="progressbar" :aria-label="'Прогресс цели: ' + g.name" :aria-valuenow="getPercent(g).toFixed(0)" aria-valuemin="0" aria-valuemax="100">
                        <div 
                          class="progress-bar" 
                          :class="getProgressBarClass(g)" 
                          :style="{ width: getPercent(g) + '%' }"
                        ></div>
                    </div>
                    <div class="text-end text-muted small mt-1" aria-hidden="true">{{ getPercent(g).toFixed(1) }}%</div>
                </div>

                <div class="d-flex gap-2 mt-auto">
                    <button class="btn btn-outline-success w-100" @click="openModal('addFunds', g)">
                      <svg class="bi me-1" aria-hidden="true"><use href="/assets/sprite.svg#bi-plus-circle"></use></svg> Пополнить
                    </button>
                    <button class="btn btn-outline-warning w-100" @click="openModal('withdrawFunds', g)" :disabled="g.currentAmount <= 0">
                      <svg class="bi me-1" aria-hidden="true"><use href="/assets/sprite.svg#bi-dash-circle"></use></svg> Снять
                    </button>
                </div>
            </div>
        </div>
      </section>
      
      <!-- Если целей нет -->
      <section v-else class="row g-4" aria-label="Пустой список целей">
          <div class="col-12 text-center text-muted py-5">У вас пока нет целей. Создайте первую!</div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { useFinanceData } from '../composables/useFinanceData';
import { useModals } from '../composables/useModals';

const { goals, isDataLoaded, loadData } = useFinanceData();
const { openModal } = useModals();

onMounted(() => {
    if (!isDataLoaded.value) loadData();
});

const getPercent = (goal) => {
    let percent = (goal.currentAmount / goal.targetAmount) * 100;
    return percent > 100 ? 100 : percent;
};

const getProgressBarClass = (goal) => {
    const percent = getPercent(goal);
    if (percent >= 100) return 'bg-success';
    if (percent > 50) return 'bg-info';
    return 'bg-primary';
};
</script>