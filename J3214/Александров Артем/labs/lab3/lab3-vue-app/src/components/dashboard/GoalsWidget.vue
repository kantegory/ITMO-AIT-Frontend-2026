<template>
  <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 h-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="h6 fw-bold m-0">Финансовые цели</h3>
      <button class="btn theme-bg-secondary theme-text-main rounded-circle d-flex align-items-center justify-content-center p-0" style="width: 28px; height: 28px;" type="button">
        <i class="bi bi-plus-lg theme-text-main"></i>
      </button>
    </div>

    <div class="d-flex flex-column gap-4">
      <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-semibold theme-text-main" style="font-size: 14px;">MacBook Pro 16</div>
          <span class="theme-text-main fw-bold" style="font-size: 13px;">75%</span>
        </div>
        <div class="progress theme-bg-secondary" style="height: 6px;">
          <div class="progress-bar bg-primary rounded-pill" style="width: 75%;"></div>
        </div>
        <div class="d-flex justify-content-between theme-text-muted mt-1" style="font-size: 11px;">
          <span>Накоплено: $1,500</span>
          <span>Цель: $2,000</span>
        </div>
      </div>

      <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-semibold theme-text-main" style="font-size: 14px;">Подушка безопасности</div>
          <span class="theme-text-main fw-bold" style="font-size: 13px;">40%</span>
        </div>
        <div class="progress theme-bg-secondary" style="height: 6px;">
          <div class="progress-bar bg-primary rounded-pill" style="width: 40%;"></div>
        </div>
        <div class="d-flex justify-content-between theme-text-muted mt-1" style="font-size: 11px;">
          <span>Накоплено: $4,000</span>
          <span>Цель: $10,000</span>
        </div>
      </div>
    </div>
  </div>
</template>