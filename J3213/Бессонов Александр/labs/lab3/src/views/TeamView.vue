<script setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import WorkspaceShell from '../components/WorkspaceShell.vue'
import { useTeamStore } from '../stores/team'

const teamStore = useTeamStore()
const { members, loading, error } = storeToRefs(teamStore)
const query = ref('')
const inviteOpen = ref(false)
const message = ref('')
const invite = reactive({ name: '', email: '', role: 'Участник' })
const filteredMembers = computed(() => {
  const value = query.value.trim().toLocaleLowerCase('ru-RU')
  if (!value) return members.value
  return members.value.filter((member) => [member.name, member.email, member.role].join(' ').toLocaleLowerCase('ru-RU').includes(value))
})

async function submitInvite() {
  try {
    await teamStore.inviteMember({ ...invite })
    Object.assign(invite, { name: '', email: '', role: 'Участник' })
    inviteOpen.value = false
    message.value = 'Участник приглашён через REST API'
  } catch (requestError) {
    message.value = requestError.message
  }
}

async function changeRole(member, role) {
  try {
    await teamStore.updateRole(member.id, role)
    message.value = `Роль пользователя ${member.shortName} обновлена`
  } catch (requestError) {
    message.value = requestError.message
  }
}

onMounted(() => teamStore.loadMembers().catch(() => {}))
</script>

<template>
  <WorkspaceShell title="Команда" subtitle="Участники рабочего пространства">
    <section class="workspace-heading">
      <div><p class="eyebrow">Digital Lab</p><h1>Команда</h1><p>Управляйте участниками пространства и их ролями.</p></div>
      <button class="outline-button" type="button" @click="inviteOpen = !inviteOpen">Пригласить участника</button>
    </section>

    <form v-if="inviteOpen" class="invite-form" @submit.prevent="submitInvite">
      <div><label for="inviteName">Имя</label><input id="inviteName" v-model.trim="invite.name" type="text" placeholder="Имя Фамилия" required /></div>
      <div><label for="inviteEmail">Почта</label><input id="inviteEmail" v-model.trim="invite.email" type="email" placeholder="name@example.ru" required /></div>
      <div><label for="inviteRole">Роль</label><select id="inviteRole" v-model="invite.role"><option>Участник</option><option>Наблюдатель</option><option>Администратор</option></select></div>
      <button class="primary-button" type="submit">Отправить приглашение</button>
    </form>

    <div class="workspace-filterbar"><input v-model="query" type="search" placeholder="Поиск по имени, почте или роли" aria-label="Поиск участников" /><span>{{ filteredMembers.length }} участников</span></div>
    <div v-if="loading" class="api-state">Загрузка команды…</div>
    <div v-else-if="error" class="api-state api-state-error">{{ error }}</div>
    <p v-if="message" class="workspace-message" role="status">{{ message }}</p>

    <section class="team-table-card">
      <div class="team-table-head"><span>Участник</span><span>Статус</span><span>Проекты</span><span>Роль</span></div>
      <article v-for="member in filteredMembers" :key="member.id" class="team-row">
        <div class="team-person"><span :class="['team-avatar', `avatar-${member.avatar}`]">{{ member.initials }}</span><span><strong>{{ member.name }}</strong><small>{{ member.email }}</small></span></div>
        <span :class="['team-status', { online: member.status === 'Онлайн' }]">{{ member.status }}</span>
        <strong>{{ member.projectsCount }}</strong>
        <select :value="member.role" :disabled="member.userId === 1" @change="changeRole(member, $event.target.value)"><option>Администратор</option><option>Участник</option><option>Наблюдатель</option></select>
      </article>
      <div v-if="!filteredMembers.length" class="workspace-empty">Участники не найдены.</div>
    </section>
  </WorkspaceShell>
</template>
