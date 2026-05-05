<template>
  <div>
    <Navbar />
    <main class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <div class="card mb-3 border-info shadow-sm">
              <div class="card-header bg-info text-dark">Blue Team</div>
              <div class="card-body py-2">
                <p class="mb-1 small" v-for="a in blueAgents" :key="a.id">
                  <svg class="icon text-info me-1"><use href="/assets/sprite.svg#shield"></use></svg>
                  {{ a.name }}
                </p>
              </div>
          </div>
          <div class="card mb-3 border-danger shadow-sm">
              <div class="card-header bg-danger text-white">Red Team</div>
              <div class="card-body py-2">
                <p class="mb-1 small" v-for="a in redAgents" :key="a.id">
                  <svg class="icon text-danger me-1"><use href="/assets/sprite.svg#radioactive"></use></svg>
                  {{ a.name }}
                </p>
              </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <span>Live Simulation</span>
              <span class="badge" :class="isSimulating ? 'bg-success' : 'bg-secondary'">
                {{ isSimulating ? 'Running' : 'Stopped' }}
              </span>
            </div>
            <div class="card-body shadow-inner" ref="chatBox" style="height: 550px; overflow-y: auto; background-image: radial-gradient(#808080 1px, transparent 1px); background-size: 20px 20px;">
              <div class="d-flex mb-3" v-for="(msg, idx) in uiHistory" :key="idx" :class="msg.align">
                <div class="p-3 rounded-3 shadow-sm border" style="max-width: 80%;" :class="msg.bgColor">
                  <strong class="small" :class="msg.textColor">{{ msg.sender }}</strong>
                  <div class="mt-1">{{ msg.text }}</div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <form @submit.prevent="startSimulation" class="input-group">
                <input type="text" v-model="inputText" class="form-control" placeholder="Опишите ситуацию..." :disabled="isSimulating" required>
                <button class="btn btn-primary" v-if="!isSimulating" type="submit">Запустить</button>
                <button class="btn btn-danger" v-else type="button" @click="stopSimulation">
                  <svg class="icon me-1"><use href="/assets/sprite.svg#stop-fill"></use></svg>
                  Стоп
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { api } from '@/api'
import { useAuth } from '@/composables/useAuth'
import Navbar from '@/components/Navbar.vue'

const { checkAuth } = useAuth()
const blueAgents = ref([])
const redAgents = ref([])
const inputText = ref('')
const isSimulating = ref(false)
const chatBox = ref(null)

const chatHistory = ref([])
const uiHistory = ref([])

onMounted(async () => {
  checkAuth()
  const res = await api.get('/agents')
  blueAgents.value = res.data.filter(a => a.role === 'Defender')
  redAgents.value = res.data.filter(a => a.role === 'Attacker')
})

const startSimulation = async () => {
  const text = inputText.value
  uiHistory.value.push({ sender: 'System Prompt', text: text, textColor: 'text-muted', bgColor: 'bg-light', align: 'justify-content-start' })
  chatHistory.value.push({ role: 'user', content: `Context: ${text}. Talk as humans.` })
  inputText.value = ''
  isSimulating.value = true
  await nextTick()
  chatBox.value.scrollTop = chatBox.value.scrollHeight
  runLoop()
}

const runLoop = async () => {
  while(isSimulating.value) {
    for (let agent of blueAgents.value) {
        if (!isSimulating.value) break
        await turn(agent, 'text-info', 'bg-white', 'justify-content-start')
        await new Promise(r => setTimeout(r, 3000))
    }
    for (let agent of redAgents.value) {
        if (!isSimulating.value) break
        await turn(agent, 'text-danger', 'bg-danger-subtle', 'justify-content-end')
        await new Promise(r => setTimeout(r, 3000))
    }
  }
}

const turn = async (agent, textColor, bgColor, align) => {
    try {
        const res = await api.post('/chat/generate', {
            agent_id: agent.id, 
            history: chatHistory.value 
        })
        uiHistory.value.push({ sender: agent.name, text: res.data.content, textColor, bgColor, align })
        chatHistory.value.push({ role: 'assistant', content: res.data.content })
        await nextTick()
        chatBox.value.scrollTop = chatBox.value.scrollHeight
    } catch(e) {}
}

const stopSimulation = () => {
  isSimulating.value = false
}
</script>
