<template>
  <div>
    <div class="container py-5 text-center">
      <h1 class="mb-3">Управляйте своими финансами</h1>
      <p class="lead">Контролируйте расходы, планируйте бюджет и анализируйте свои финансы.</p>

      <RouterLink to="/login" class="btn btn-primary btn-lg me-2">
        Начать
      </RouterLink>
    </div>

    <div class="container pb-5">
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow-sm p-4 text-center">
            <h2>Учёт расходов</h2>
            <p>Добавляйте и отслеживайте транзакции.</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card shadow-sm p-4 text-center">
            <h2>Финансовая аналитика</h2>
            <p>Просматривайте отчёты и категории расходов.</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card shadow-sm p-4 text-center">
            <h2>Планирование бюджета</h2>
            <p>Следите за лимитами расходов.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
