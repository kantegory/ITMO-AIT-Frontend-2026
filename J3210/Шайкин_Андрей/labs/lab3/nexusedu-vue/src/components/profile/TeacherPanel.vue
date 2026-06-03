<template>
  <div class="tab-pane fade show active">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fs-5 fw-bold mb-0">Авторские курсы</h2>
      <button class="btn glass-btn btn-sm">+ Создать</button>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-borderless align-middle">
        <thead class="border-bottom border-secondary border-opacity-25 opacity-75">
          <tr>
            <th scope="col">Курс</th>
            <th scope="col">Студенты</th>
            <th scope="col">Статус</th>
            <th scope="col">Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="fw-bold">Deep Learning / AI</td>
            <td class="opacity-75">1 240</td>
            <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Опубликован</span></td>
            <td><button class="btn btn-sm btn-adaptive-outline">Настроить</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>