<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { useProjects } from '@/composables/useProjects'

const router = useRouter()
const { user } = useAuth()
const { addProject } = useProjects()

const form = reactive({
  name: '',
  description: ''
})

const inviteLink = ref('')

async function handleSubmit() {
  if (!user.value) {
    alert('Сначала войдите в аккаунт')
    router.push('/login')
    return
  }

  if (!form.name.trim()) {
    alert('Введите название проекта')
    return
  }

  try {
    const newProject = await addProject({
      name: form.name.trim(),
      description: form.description.trim(),
      role: 'Administrator',
      ownerId: user.value.id,
      ownerName: user.value.name,
      team: [
        {
          id: user.value.id,
          name: user.value.name
        }
      ]
    })

    inviteLink.value = `${window.location.origin}/project/${newProject.id}`
    alert('Проект успешно создан')
  } catch (error) {
    alert(error.message || 'Ошибка при создании проекта')
  }
}

async function copyInvite() {
  if (!inviteLink.value) {
    alert('Сначала создайте проект')
    return
  }

  try {
    await navigator.clipboard.writeText(inviteLink.value)
    alert('Ссылка скопирована')
  } catch (error) {
    alert('Не удалось скопировать ссылку')
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="container">
      <div class="card p-4">
        <h1 class="mb-4">Create project</h1>

        <div class="mb-3">
          <label class="form-label" for="projectName">Project name</label>
          <input id="projectName" v-model="form.name" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="projectDescription">Description</label>
          <textarea
            id="projectDescription"
            v-model="form.description"
            class="form-control"
            rows="4"
          ></textarea>
        </div>

        <div class="d-flex gap-2 mb-3">
          <button id="createProjectBtn" class="btn btn-dark" @click="handleSubmit">
            Create project
          </button>
          <button id="copyInviteBtn" class="btn btn-outline-dark" @click="copyInvite">
            Copy invite link
          </button>
        </div>

        <div>
          <label class="form-label" for="inviteLink">Invite link</label>
          <input id="inviteLink" :value="inviteLink" type="text" class="form-control" readonly />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>