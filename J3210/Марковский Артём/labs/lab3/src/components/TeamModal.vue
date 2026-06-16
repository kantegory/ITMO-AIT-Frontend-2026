<script setup>
import { ref } from 'vue'
import { useProjects } from '@/composables/useProjects.js'
import { getUserName } from '@/stores/auth.js'
import { buildProjectActions } from '@/api/index.js'

const props = defineProps({ project: Object })

const { updateProject } = useProjects()

const newMemberName = ref('')
const newMemberRole = ref('Участник')

function changeMemberName(index, value) {
  const name = value.trim()
  if (!name) return
  updateProject(props.project.id, (p) => {
    const prev = p.members[index].name
    const next = name.slice(0, 60)
    p.members[index].name = next
    p.tasks.forEach((t) => {
      if (t.assignee === prev) t.assignee = next
    })
  })
}

function changeMemberRole(index, value) {
  updateProject(props.project.id, (p) => {
    p.members[index].role = value
    if (p.members[index].name === getUserName()) {
      p.role = value
      p.actions = buildProjectActions(value)
    }
  })
}

function removeMember(index) {
  updateProject(props.project.id, (p) => {
    const removed = p.members[index]
    if (!removed) return
    p.tasks.forEach((t) => {
      if (t.assignee === removed.name) {
        t.assignee = 'Без исполнителя'
        if (t.status === 'Завершено') t.status = 'Новая'
      }
    })
    p.members.splice(index, 1)
  })
}

function addMember() {
  const name = newMemberName.value.trim()
  if (!name) return
  updateProject(props.project.id, (p) => {
    p.members.push({ name: name.slice(0, 60), role: newMemberRole.value })
  })
  newMemberName.value = ''
}
</script>

<template>
  <div class="modal-editor-list">
    <div class="modal-editor-card">
      <div class="modal-section-title">Состав команды</div>
      <div
        v-for="(member, i) in project.members"
        :key="i"
        class="modal-grid modal-grid-team"
      >
        <input
          class="form-control"
          type="text"
          :value="member.name"
          @change="(e) => changeMemberName(i, e.target.value)"
        />
        <select
          class="form-select"
          :value="member.role"
          @change="(e) => changeMemberRole(i, e.target.value)"
        >
          <option value="Администратор">Администратор</option>
          <option value="Участник">Участник</option>
          <option value="Наблюдатель">Наблюдатель</option>
        </select>
        <button class="btn btn-light" type="button" @click="removeMember(i)">Удалить</button>
      </div>
    </div>
    <div class="modal-editor-card">
      <div class="modal-section-title">Добавить участника</div>
      <div class="modal-grid modal-grid-team-add">
        <input
          class="form-control"
          type="text"
          placeholder="Имя и фамилия"
          v-model="newMemberName"
        />
        <select class="form-select" v-model="newMemberRole">
          <option value="Участник">Участник</option>
          <option value="Наблюдатель">Наблюдатель</option>
          <option value="Администратор">Администратор</option>
        </select>
        <button class="btn btn-primary" type="button" @click="addMember">Добавить</button>
      </div>
    </div>
  </div>
</template>
