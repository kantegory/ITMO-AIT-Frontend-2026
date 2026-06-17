import { useApi } from './useApi'

export function useDiscussions() {
    const api = useApi()

    async function listByItem(itemId) {
        const { data } = await api.get(`/discussions?itemId=${itemId}`)
        return data
    }

    async function create(itemId, userId, title) {
        const { data } = await api.post('/discussions', {
            itemId,
            userId,
            title,
            createdAt: new Date().toISOString(),
        })
        return data
    }

    async function messages(discussionId) {
        const { data } = await api.get(`/messages?discussionId=${discussionId}`)
        return data
    }

    async function sendMessage(discussionId, userId, body) {
        const { data } = await api.post('/messages', {
            discussionId,
            userId,
            body,
            createdAt: new Date().toISOString(),
        })
        return data
    }

    return { listByItem, create, messages, sendMessage }
}
