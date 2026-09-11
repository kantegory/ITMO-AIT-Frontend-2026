<template>
  <section class="info-card">
    <div class="mb-3">
      <h2 class="h5 fw-bold mb-0">Команда</h2>
    </div>

    <form v-if="isAdmin" class="invite-form mb-4" @submit.prevent="invite">
      <label for="inviteEmail" class="form-label">Добавить участника по Email</label>
      <div class="d-flex flex-column flex-sm-row gap-2">
        <input id="inviteEmail" v-model.trim="inviteEmail" class="form-control" type="email" placeholder="user@example.com" required />
        <button class="btn btn-outline-black text-nowrap" type="submit">Добавить</button>
      </div>
    </form>

    <p v-if="!team.length" class="text-muted mb-0">В проекте пока нет участников.</p>

    <div v-for="member in team" :key="member.email || `${member.name}-${member.surname}`" class="team-member">
      <div>
        <div class="fw-bold">{{ member.name }} {{ member.surname }}</div>
        <small v-if="member.email" class="text-muted">{{ member.email }}</small>
        <span class="badge ms-2">{{ member.role }}</span>
      </div>

      <div v-if="isAdmin && member.role !== 'Администратор'" class="d-flex flex-wrap justify-content-end gap-2">
        <select
          class="form-select form-select-sm role-select"
          :value="member.role"
          :aria-label="`Роль ${member.name}`"
          @change="$emit('change-role', member, $event.target.value)"
        >
          <option value="Участник">Участник</option>
          <option value="Наблюдатель">Наблюдатель</option>
        </select>
        <button class="btn btn-sm btn-outline-black" type="button" @click="$emit('remove', member)">Удалить</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  team: { type: Array, default: () => [] },
  isAdmin: { type: Boolean, default: false },
})

const emit = defineEmits(['invite', 'change-role', 'remove'])
const inviteEmail = ref('')

function invite() {
  if (!inviteEmail.value) return
  emit('invite', inviteEmail.value)
  inviteEmail.value = ''
}
</script>
