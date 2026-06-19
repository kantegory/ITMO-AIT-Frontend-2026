import { ref } from 'vue'
import { useAuth } from './useAuth'

const toastMessage = ref('')
const toastType = ref('success')

function buildTicketFromEvent(eventItem) {
  return {
    id: `EP-${String(Date.now()).slice(-6)}`,
    category: eventItem.category || 'Мероприятие',
    eventName: eventItem.title || eventItem.name || 'Событие',
    date: eventItem.dateLabel || eventItem.date || 'Скоро',
    city: eventItem.city || 'Не указан',
    seat: eventItem.seatForPurchase || 'Электронный билет',
    price: Number(eventItem.price?.value ?? eventItem.price ?? 0),
    status: 'paid',
    canRefund: true,
  }
}

export function useTickets() {
  const { currentUser, loadCurrentUser, persistUser } = useAuth()

  function showToast(message, type = 'success') {
    toastMessage.value = message
    toastType.value = type
    window.setTimeout(() => {
      toastMessage.value = ''
    }, 2400)
  }

  async function purchaseTicket(eventItem) {
    const user = currentUser.value || (await loadCurrentUser())
    if (!user) {
      return { ok: false, redirect: '/auth' }
    }

    if (user.accountType === 'organizer') {
      showToast('С аккаунта организатора нельзя купить билет.', 'danger')
      return { ok: false }
    }

    const nextUser = {
      ...user,
      tickets: [buildTicketFromEvent(eventItem), ...(Array.isArray(user.tickets) ? user.tickets : [])],
      refunds: Array.isArray(user.refunds) ? user.refunds : [],
      organizerEvents: Array.isArray(user.organizerEvents) ? user.organizerEvents : [],
    }

    await persistUser(nextUser)
    showToast('Билет куплен.', 'success')
    return { ok: true }
  }

  async function requestRefund(ticketId, reason) {
    const user = currentUser.value || (await loadCurrentUser())
    const ticket = user?.tickets?.find((item) => item.id === ticketId)

    if (!ticket || !ticket.canRefund || !String(reason || '').trim()) {
      return null
    }

    const tickets = user.tickets.map((item) => (item.id === ticketId ? { ...item, canRefund: false } : item))
    const refunds = [
      {
        ticketId: ticket.id,
        eventName: ticket.eventName,
        requestedAt: new Date().toLocaleDateString('ru-RU'),
        amount: ticket.price,
        reason: String(reason).trim(),
        status: 'processing',
      },
      ...(Array.isArray(user.refunds) ? user.refunds : []),
    ]

    return persistUser({
      ...user,
      tickets,
      refunds,
    })
  }

  return {
    toastMessage,
    toastType,
    buildTicketFromEvent,
    purchaseTicket,
    requestRefund,
  }
}
