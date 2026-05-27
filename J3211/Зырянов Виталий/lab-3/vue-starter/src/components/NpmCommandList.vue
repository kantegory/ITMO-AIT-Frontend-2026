<script setup>
const commands = [
  { cmd: 'npm --version', description: 'Проверка версии npm' },
  { cmd: 'npm install', description: 'Установка зависимостей проекта' },
  { cmd: 'npm run dev', description: 'Запуск dev-сервера' },
  { cmd: 'npm run build', description: 'Сборка production-версии' },
  { cmd: 'npm run preview', description: 'Локальный просмотр сборки' },
  { cmd: 'npm install axios', description: 'Установка новой зависимости' },
  { cmd: 'npm uninstall axios', description: 'Удаление зависимости' },
  { cmd: 'npm list --depth=0', description: 'Просмотр установленных пакетов' }
]
</script>

<template>
  <section class="panel">
    <h2>Основные команды npm</h2>
    <ul>
      <li v-for="item in commands" :key="item.cmd">
        <code>{{ item.cmd }}</code>
        <span>{{ item.description }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.panel {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
}

h2 {
  margin: 0 0 12px;
}

ul {
  margin: 0;
  padding-left: 18px;
}

li {
  margin-bottom: 8px;
}

code {
  margin-right: 8px;
  color: #0c4a6e;
}
</style>
