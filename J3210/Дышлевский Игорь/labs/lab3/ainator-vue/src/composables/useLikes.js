import { useApi } from './useApi'

export function useLikes() {
    const api = useApi()

    async function count(itemId) {
        const { data } = await api.get(`/likes?itemId=${itemId}`)
        return data.length
    }

    async function myLike(itemId, userId) {
        const { data } = await api.get(`/likes?itemId=${itemId}&userId=${userId}`)
        return data[0] || null
    }

    async function toggle(itemId, userId) {
        const existing = await myLike(itemId, userId)
        if (existing) {
            await api.delete(`/likes/${existing.id}`)
            return false
        }
        await api.post('/likes', { itemId, userId })
        return true
    }

    return { count, myLike, toggle }
}
