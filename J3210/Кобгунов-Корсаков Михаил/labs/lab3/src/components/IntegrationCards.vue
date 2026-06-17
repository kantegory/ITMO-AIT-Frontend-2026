<script setup>
function stub() {
  alert('заглушка');
}
</script>

<template>
  <div>
    <div class="card shadow-sm mb-4">
      <div class="card-header">Подключённые сервисы</div>

      <table class="table mb-0">
        <thead>
          <tr>
            <th>Сервис</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Тинькофф</td>
            <td>Подключен</td>
            <td>
              <button class="btn btn-sm btn-outline-danger" type="button">
                Отключить
              </button>
            </td>
          </tr>

          <tr>
            <td>Сбербанк</td>
            <td>Не подключен</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" type="button">
                Подключить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3>Импорт транзакций</h3>
            <p class="text-muted">Загрузка операций из подключённых банковских аккаунтов.</p>
            <button class="btn btn-primary" type="button" @click="stub">
              Импортировать
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3>Настройка правил</h3>
            <p class="text-muted">Автоматическая категоризация транзакций.</p>
            <ul>
              <li>Супермаркет → Продукты</li>
              <li>Такси → Транспорт</li>
              <li>Кино → Развлечения</li>
            </ul>
            <button class="btn btn-secondary" type="button" @click="stub">
              Сохранить правила
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
