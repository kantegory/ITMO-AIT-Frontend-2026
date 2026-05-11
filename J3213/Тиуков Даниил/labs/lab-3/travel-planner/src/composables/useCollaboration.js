import { ref } from 'vue'
import { TravelApi } from '@/api/travelApi.js'

const participants = ref([])
const stages = ref([])
const sharedNotes = ref([])
const ideas = ref([])
const isLoaded = ref(false)
const isLoading = ref(false)

export function useCollaboration() {
  async function loadAll(force = false) {
    if (!force && isLoaded.value) return
    isLoading.value = true
    try {
      const [p, s, n, i] = await Promise.all([
        TravelApi.getParticipants(),
        TravelApi.getStages(),
        TravelApi.getSharedNotes(),
        TravelApi.getIdeas()
      ])
      participants.value = p
      stages.value = s
      sharedNotes.value = [...n].sort((left, right) => new Date(right.date) - new Date(left.date))
      ideas.value = i
      isLoaded.value = true
    } catch (error) {
      console.error('useCollaboration: ошибка загрузки', error)
    } finally {
      isLoading.value = false
    }
  }

  async function addParticipant(payload) {
    const created = await TravelApi.addParticipant(payload)
    participants.value = [...participants.value, created]
  }

  async function addStage(payload) {
    const created = await TravelApi.addStage(payload)
    stages.value = [...stages.value, created]
  }

  async function updateStage(stageId, patch) {
    const updated = await TravelApi.updateStage(stageId, patch)
    stages.value = stages.value.map((stage) => (stage.id === stageId ? updated : stage))
  }

  async function removeStage(stageId) {
    await TravelApi.deleteStage(stageId)
    stages.value = stages.value.filter((stage) => stage.id !== stageId)
  }

  async function addSharedNote(payload) {
    const created = await TravelApi.addSharedNote({ ...payload, date: new Date().toISOString() })
    sharedNotes.value = [created, ...sharedNotes.value]
  }

  async function removeSharedNote(noteId) {
    await TravelApi.deleteSharedNote(noteId)
    sharedNotes.value = sharedNotes.value.filter((note) => note.id !== noteId)
  }

  async function addIdea(payload) {
    const created = await TravelApi.addIdea({ votes: 0, ...payload })
    ideas.value = [created, ...ideas.value]
  }

  async function supportIdea(ideaId) {
    const target = ideas.value.find((idea) => idea.id === ideaId)
    if (!target) return
    const updated = await TravelApi.updateIdea(ideaId, { votes: target.votes + 1 })
    ideas.value = ideas.value.map((idea) => (idea.id === ideaId ? updated : idea))
  }

  return {
    participants,
    stages,
    sharedNotes,
    ideas,
    isLoading,
    loadAll,
    addParticipant,
    addStage,
    updateStage,
    removeStage,
    addSharedNote,
    removeSharedNote,
    addIdea,
    supportIdea
  }
}
