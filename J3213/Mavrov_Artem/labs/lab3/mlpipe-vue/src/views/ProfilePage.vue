<template>
  <AppShell title="Мой кабинет">
    <div class="panel">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem">
        <div class="prof-avatar">{{ userInitial }}</div>
        <div>
          <div style="font-size:1.1rem;font-weight:700">{{ user?.name }}</div>
          <span class="role-chip">{{ user?.role }}</span>
        </div>
      </div>

      <div class="mb-3">
        <label class="flabel">Email</label>
        <div style="color:var(--txt);font-size:.9rem">{{ user?.email }}</div>
      </div>

      <div class="mb-3">
        <label class="flabel">Токен сессии</label>
        <div class="token-row">
          <span>{{ token ? token.slice(0, 24) + '...' : '—' }}</span>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script>
import AppShell from '@/layouts/AppShell.vue'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ProfilePage',
  components: { AppShell },

  computed: {
    ...mapState(useAuthStore, ['user', 'token']),
    userInitial() {
      return this.user?.name?.[0]?.toUpperCase() || '?'
    }
  }
}
</script>
