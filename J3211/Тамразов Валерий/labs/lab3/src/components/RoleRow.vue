<script setup>
const ROLE_LABELS = { admin: 'Админ', developer: 'Разработчик', viewer: 'Наблюдатель' };
const ROLE_BADGES = { admin: 'bg-primary', developer: 'bg-info', viewer: 'bg-secondary' };
const ACCESS_LABELS = { full: 'Полный', deploy: 'Деплой', view: 'Просмотр' };

const props = defineProps({
  role: { type: Object, required: true }
});

const accessIcon = (access) =>
  access === 'full' || access === 'deploy'
    ? 'bi-check-circle-fill text-success'
    : 'bi-eye-fill text-muted';
</script>

<template>
  <tr>
    <td>
      <div class="d-flex align-items-center">
        <div class="role-avatar">{{ role.initials }}</div>
        <div>
          <div>{{ role.name }}</div>
          <small class="text-muted">{{ role.email }}</small>
        </div>
      </div>
    </td>
    <td>
      <span :class="['role-badge', ROLE_BADGES[role.role] || 'bg-secondary', 'text-white']">
        {{ ROLE_LABELS[role.role] || role.role }}
      </span>
    </td>
    <td v-for="key in ['devAccess', 'stagingAccess', 'prodAccess']" :key="key">
      <i :class="['bi', accessIcon(role[key]), 'me-1']"></i>
      {{ ACCESS_LABELS[role[key]] || role[key] }}
    </td>
  </tr>
</template>

<style scoped>
.role-avatar {
  width: 32px;
  height: 32px;
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 10px;
}
</style>
