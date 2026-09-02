<script setup>
import { GitBranch } from '@lucide/vue'

defineProps({
  showcaseEyebrow: { type: String, required: true },
  showcaseLines: { type: Array, required: true },
  showcaseText: { type: String, required: true },
  registration: { type: Boolean, default: false },
})
</script>

<template>
  <main :class="['auth-shell', { 'auth-shell-register': registration }]">
    <section :class="['auth-showcase', { 'auth-showcase-login': !registration }]" aria-labelledby="showcaseTitle">
      <RouterLink class="auth-brand" to="/login" aria-label="Т-Пульс — вход">
        <span class="auth-brand-mark"><GitBranch :size="22" /></span>
        <span>Т‑Пульс</span>
      </RouterLink>

      <div class="auth-showcase-copy">
        <span class="auth-eyebrow">{{ showcaseEyebrow }}</span>
        <h1 id="showcaseTitle">
          <template v-for="(line, index) in showcaseLines" :key="line">
            {{ line }}<br v-if="index < showcaseLines.length - 1" />
          </template>
        </h1>
        <p>{{ showcaseText }}</p>
      </div>

      <ol v-if="registration" class="setup-steps" aria-label="Этапы настройки">
        <li class="is-active"><span>1</span><div><strong>Создайте аккаунт</strong><small>Только основные данные</small></div></li>
        <li><span>2</span><div><strong>Настройте пространство</strong><small>Название и размер команды</small></div></li>
        <li><span>3</span><div><strong>Запустите проект</strong><small>Готовые доски и статусы</small></div></li>
      </ol>
    </section>

    <section class="auth-panel">
      <div class="auth-form-wrap"><slot /></div>
    </section>
  </main>
</template>
