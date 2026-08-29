<template>
  <div class="row g-4 mb-4 align-items-stretch">
    <!-- Итоговый баланс -->
    <div class="col-12 col-lg-6 d-flex flex-column">
      <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 d-flex justify-content-between align-items-center h-100 flex-grow-1">
        <div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 36px; height: 36px;">
              <i class="bi bi-wallet2 fs-5"></i>
            </div>
            <span class="theme-text-muted fw-medium small">Итоговый баланс</span>
          </div>
          <h2 class="fw-bold m-0 display-6 theme-text-main">${{ (income - expenses).toFixed(2) }}</h2>
        </div>
      </div>
    </div>

    <!-- Расходы и Доходы -->
    <div class="col-12 col-lg-6 d-flex flex-column">
      <div class="row g-4 h-100 flex-grow-1">
        
        <!-- Расходы -->
        <div class="col-6 d-flex flex-column">
          <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 d-flex flex-column justify-content-between h-100 flex-grow-1">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <div class="bg-danger-subtle text-danger rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px;">
                  <i class="bi bi-arrow-down-right"></i>
                </div>
                <span class="theme-text-muted fw-medium small">Расходы</span>
              </div>
            </div>
            <div>
              <h3 class="fw-bold m-0 h4 text-danger">-${{ expenses.toFixed(2) }}</h3>
              <div class="theme-text-muted" style="font-size: 11px;">за текущий месяц</div>
            </div>
          </div>
        </div>

        <!-- Доходы -->
        <div class="col-6 d-flex flex-column">
          <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 d-flex flex-column justify-content-between h-100 flex-grow-1">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <div class="bg-success-subtle text-success rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px;">
                  <i class="bi bi-arrow-up-right"></i>
                </div>
                <span class="theme-text-muted fw-medium small">Доходы</span>
              </div>
            </div>
            <div>
              <h3 class="fw-bold m-0 h4 text-success">+${{ income.toFixed(2) }}</h3>
              <div class="theme-text-muted" style="font-size: 11px;">за текущий месяц</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  income: {
    type: Number,
    default: 0
  },
  expenses: {
    type: Number,
    default: 0
  }
})
</script>