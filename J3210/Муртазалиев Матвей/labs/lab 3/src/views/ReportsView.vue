<template>
  <main id="main-content" class="page-section" tabindex="-1">
    <div class="container">
      <section class="page-banner">
        <div>
          <span class="section-label">Отчёты</span>
          <h1 class="section-title mt-3">Финансовая аналитика</h1>
          <p class="page-banner__copy">{{ currentPreset.summary }}</p>
        </div>
        <PeriodSwitcher v-model="activePeriod" />
      </section>

      <div v-if="loading" class="alert alert-light border" role="status">Загружаем отчеты из API...</div>
      <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

      <template v-else>
        <section class="row g-4 mt-1">
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Расходы" :value="currentPreset.spend" :status="currentPreset.spendStatus" status-class="warning" />
          </div>
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Средний чек" :value="currentPreset.average" :status="currentPreset.averageStatus" />
          </div>
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Главная категория" :value="currentPreset.category" :status="currentPreset.categoryStatus" status-class="negative" />
          </div>
          <div class="col-sm-6 col-xl-3">
            <MetricCard label="Прогноз" :value="currentPreset.forecast" :status="currentPreset.forecastStatus" status-class="positive" />
          </div>
        </section>

        <ReportCharts :preset="currentPreset" />

        <section class="row g-4 mt-2">
          <div class="col-lg-7">
            <div class="content-card h-100">
              <span class="section-label">Прогноз</span>
              <h2 class="h3 mt-2">{{ currentPreset.forecastText }}</h2>
              <p class="text-secondary mb-0">{{ currentPreset.forecastDescription }}</p>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="content-card h-100">
              <span class="section-label">Подсказка</span>
              <h2 class="h3 mt-2">Что проверить</h2>
              <p class="text-secondary mb-0">{{ currentPreset.tip }}</p>
            </div>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import MetricCard from "@/components/dashboard/MetricCard.vue";
import PeriodSwitcher from "@/components/reports/PeriodSwitcher.vue";
import ReportCharts from "@/components/reports/ReportCharts.vue";
import { useFinanceData } from "@/composables/useFinanceData";
import { useReports } from "@/composables/useReports";

const activePeriod = ref("week");
const {
  accounts,
  transactions,
  loading,
  error,
  loadReportsData,
} = useFinanceData();
const { presets } = useReports(transactions, accounts);

const currentPreset = computed(() => presets.value[activePeriod.value] || presets.value.week);

onMounted(loadReportsData);
</script>
