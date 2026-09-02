<script setup>
import { Bell, Check, X } from '@lucide/vue'

defineProps({
  open: { type: Boolean, default: false },
  notifications: { type: Array, required: true },
})
defineEmits(['close', 'mark-read'])
</script>

<template>
  <Transition name="overlay"><button v-if="open" class="drawer-overlay" type="button" aria-label="Закрыть уведомления" @click="$emit('close')"></button></Transition>
  <Transition name="drawer">
    <aside v-if="open" class="notifications-drawer" aria-labelledby="notificationsTitle">
      <header><div><small>Центр событий</small><h2 id="notificationsTitle">Уведомления</h2></div><button class="small-icon-button" type="button" aria-label="Закрыть" @click="$emit('close')"><X /></button></header>
      <button class="mark-read-button" type="button" @click="$emit('mark-read')"><Check />Отметить все прочитанными</button>
      <div class="notification-list">
        <article v-for="item in notifications" :key="item.id" :class="{ unread: !item.read }">
          <span class="notification-icon"><Bell /></span>
          <div><strong>{{ item.title ?? 'Уведомление' }}</strong><p>{{ item.text }}</p><time>{{ item.id === 1 ? '10 минут назад' : item.id === 2 ? '1 час назад' : 'Вчера' }}</time></div>
        </article>
        <p v-if="!notifications.length" class="workspace-empty">Новых уведомлений нет.</p>
      </div>
    </aside>
  </Transition>
</template>
