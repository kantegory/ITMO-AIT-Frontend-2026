<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Банк</th>
          <th>Статус</th>
          <th>Последняя синхронизация</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!banks.length"><td colspan="4" class="text-center text-muted">Банки пока не добавлены</td></tr>
        <tr v-for="bank in banks" :key="bank.id">
          <td>{{ bank.name }}</td>
          <td><span :class="['badge', bank.connected ? 'text-bg-success' : 'text-bg-secondary']">{{ bank.connected ? 'Подключён' : 'Не подключён' }}</span></td>
          <td>{{ bank.lastSync || 'Нет синхронизации' }}</td>
          <td><button class="btn btn-sm" :class="bank.connected ? 'btn-outline-danger' : 'btn-outline-primary'" disabled :title="'Кнопка показана только как элемент интерфейса'">{{ bank.connected ? 'Отключить' : 'Подключить' }}</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  banks: { type: Array, default: () => [] },
});
</script>
