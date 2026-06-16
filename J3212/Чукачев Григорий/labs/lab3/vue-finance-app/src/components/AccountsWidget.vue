<script setup>
import { ref } from 'vue'

const isBalanceVisible = ref(true)

const toggleBalance = () => {
  isBalanceVisible.value = !isBalanceVisible.value
}
</script>

<template>
  <section aria-labelledby="accounts-heading">
    <h2 id="accounts-heading" class="visually-hidden">Мои счета и баланс</h2>

    <div class="card bg-success text-white mb-4 shadow" style="border-radius: 15px;">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-white-50"><i class="bi bi-wallet2 me-1" aria-hidden="true"></i> Общий баланс</span>
          <button @click="toggleBalance" type="button" class="btn btn-link p-0 text-white-50 small d-flex align-items-center text-decoration-none shadow-none border-0" aria-label="Скрыть или показать баланс">
            <i class="bi bi-eye me-1" aria-hidden="true"></i> Скрыть / Показать
          </button>
        </div>

        <div>
          <p v-if="!isBalanceVisible" class="h2 mb-0 fw-bold">*** ₽</p>
          <p v-else class="h2 mb-0 fw-bold">617 000 ₽</p>
        </div>
      </div>
    </div>

    <h3 class="h5 text-muted mb-3"><i class="bi bi-safe me-2" aria-hidden="true"></i> Мои счета и вклады</h3>

    <div class="accordion" id="accountsAccordion" aria-label="Список ваших счетов">
      <div class="accordion-item shadow-sm mb-3 border-0" style="border-radius: 15px; overflow: hidden;">
        <h4 class="accordion-header" id="headingSber">
          <button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSber" aria-expanded="true" aria-controls="collapseSber">
            <i class="bi bi-wallet2 text-success me-2 fs-5" aria-hidden="true"></i> Сбербанк
          </button>
        </h4>
        <div id="collapseSber" class="accordion-collapse collapse show" aria-labelledby="headingSber" data-bs-parent="#accountsAccordion">
          <div class="accordion-body bg-light">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small fw-bold">Зарплатная карта</span>
              <i class="bi bi-credit-card text-muted" aria-hidden="true"></i>
            </div>

            <div class="mb-3">
              <p v-if="!isBalanceVisible" class="h4 mb-0">*** ₽</p>
              <p v-else class="h4 mb-0 text-dark">67 000 ₽</p>
            </div>

            <div class="p-2 bg-white rounded border small text-muted">
              <div v-if="!isBalanceVisible">
                <div class="font-monospace">**** **** **** 4321</div>
                <div class="d-flex justify-content-between mt-1">
                  <span>ММ/ГГ: **/**</span>
                  <span>CVV: ***</span>
                </div>
              </div>
              <div v-else>
                <div class="font-monospace text-dark fw-bold">8841 4200 0911 4321</div>
                <div class="d-flex justify-content-between mt-1 text-dark">
                  <span>ММ/ГГ: <span class="font-monospace fw-bold">12/28</span></span>
                  <span>CVV: <span class="font-monospace fw-bold">228</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item shadow-sm mb-3 border-0" style="border-radius: 15px; overflow: hidden;">
        <h4 class="accordion-header" id="headingTbank">
          <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTbank" aria-expanded="false" aria-controls="collapseTbank">
            <i class="bi bi-shield-check text-warning me-2 fs-5" aria-hidden="true"></i> Т-Банк
          </button>
        </h4>
        <div id="collapseTbank" class="accordion-collapse collapse" aria-labelledby="headingTbank" data-bs-parent="#accountsAccordion">
          <div class="accordion-body bg-light">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small fw-bold">Кредитная карта</span>
              <i class="bi bi-credit-card text-muted" aria-hidden="true"></i>
            </div>

            <div class="mb-3">
              <p v-if="!isBalanceVisible" class="h4 mb-0">*** ₽</p>
              <p v-else class="h4 mb-0 text-dark">400 000 ₽</p>
            </div>

            <div class="p-2 bg-white rounded border small text-muted">
              <div v-if="!isBalanceVisible">
                <div class="font-monospace">**** **** **** 1234</div>
                <div class="d-flex justify-content-between mt-1">
                  <span>ММ/ГГ: **/**</span>
                  <span>CVV: ***</span>
                </div>
              </div>
              <div v-else>
                <div class="font-monospace text-dark fw-bold">5536 9112 0000 1234</div>
                <div class="d-flex justify-content-between mt-1 text-dark">
                  <span>ММ/ГГ: <span class="font-monospace fw-bold">09/26</span></span>
                  <span>CVV: <span class="font-monospace fw-bold">337</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="accordion-item shadow-sm mb-3 border-0" style="border-radius: 15px; overflow: hidden;">
        <h4 class="accordion-header" id="headingVtb">
          <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVtb" aria-expanded="false" aria-controls="collapseVtb">
            <i class="bi bi-piggy-bank text-primary me-2 fs-5" aria-hidden="true"></i> ВТБ
          </button>
        </h4>
        <div id="collapseVtb" class="accordion-collapse collapse" aria-labelledby="headingVtb" data-bs-parent="#accountsAccordion">
          <div class="accordion-body bg-light">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small fw-bold">Накопительный счет</span>
              <span class="badge bg-primary">8% годовых</span>
            </div>

            <div class="mb-3">
              <p v-if="!isBalanceVisible" class="h4 mb-0">*** ₽</p>
              <p v-else class="h4 mb-0 text-primary">150 000 ₽</p>
            </div>

            <div class="p-2 bg-white rounded border small text-muted">
              <div v-if="!isBalanceVisible">
                <div>Счет: **** **** **** 9988</div>
              </div>
              <div v-else>
                <div class="text-dark">Счет:</div>
                <div class="font-monospace text-dark fw-bold">4081 7810 0999 1234 9988</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
