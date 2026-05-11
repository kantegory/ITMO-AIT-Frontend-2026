import { ref } from 'vue'
import { registrationsApi } from '@/api'

// логика записи/отмены записи
export function useRegistration(eventId, userId) {
    const registrations = ref([])
    const isRegistered = ref(false)
    const hint = ref('')

    async function syncState() {
        try {
            const res = await registrationsApi.getAll({ eventId: eventId.value })
            registrations.value = res.data
            isRegistered.value = registrations.value.some(
                r => String(r.userId) === String(userId.value) && r.status === 'active'
            )
        } catch {
            registrations.value = []
        }
    }

    async function register(capacity) {
        const activeCount = registrations.value.filter(r => r.status === 'active').length
        if (activeCount >= capacity) { hint.value = 'Свободных мест нет.'; return }
        try {
            await registrationsApi.create({
                id: crypto.randomUUID(),
                eventId: eventId.value,
                userId: userId.value,
                status: 'active'
            })
            await syncState()
        } catch { hint.value = 'Не удалось записаться.' }
    }

    async function cancel() {
        const reg = registrations.value.find(
            r => String(r.userId) === String(userId.value) && r.status === 'active'
        )
        if (!reg) { await syncState(); return }
        try {
            await registrationsApi.update(reg.id, { status: 'cancelled' })
            await syncState()
        } catch { hint.value = 'Не удалось отменить запись.' }
    }

    return { registrations, isRegistered, hint, syncState, register, cancel }
}