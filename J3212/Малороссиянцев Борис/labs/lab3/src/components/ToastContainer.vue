<template>
  <div style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :style="toastStyle(toast.type)"
      >
        <span style="font-weight:700;">{{ icon(toast.type) }}</span>
        {{ toast.msg }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()

const STYLES = {
  success: { bg:'#f0fdf4', brd:'#bbf7d0', col:'#16a34a' },
  error:   { bg:'#fef2f2', brd:'#fecaca', col:'#dc2626' },
  info:    { bg:'#f0f9ff', brd:'#bae6fd', col:'#0284c7' },
}
const ICONS = { success:'✓', error:'✕', info:'i' }

function toastStyle(type) {
  const s = STYLES[type] || STYLES.info
  return `background:${s.bg};border:1px solid ${s.brd};color:${s.col};padding:.6rem 1rem;border-radius:10px;font-size:.875rem;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:.5rem;min-width:200px;box-shadow:0 4px 16px rgba(0,0,0,.08);`
}
function icon(type) { return ICONS[type] || ICONS.info }
</script>

<style scoped>
.toast-enter-active { animation: tIn .22s ease; }
.toast-leave-active { animation: tOut .22s ease forwards; }
@keyframes tIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
@keyframes tOut { to   { opacity:0; transform:translateY(8px); } }
</style>
