<template>
  <div class="hero">
    <div class="container">
      <h1>UEFA Champions League Tickets</h1>
      <p class="mb-4">Ticket platform for the UEFA Champions League 2025/26. European Finals are coming soon!</p>
      <router-link to="/tickets" class="btn btn-primary me-2" data-icon="tickets">Buy Tickets</router-link>
    </div>
  </div>

  <main class="container mt-5 mb-5">


    <h2 class="mt-5 mb-3">European Finals 2026</h2>
    <div class="results-grid mb-5">

      <div class="ticket-card" style="background:#0b2046; border-color:#1e3a5f; display: flex; flex-direction: column;">
        <div class="result-row" style="background:transparent; align-items: center; padding: 20px 16px;">
          <span class="club-left" style="flex: 1 1 0; text-align: center; padding: 0 5px;">PSG</span>
          <span class="result-score" style="flex-shrink: 0; margin: 0 10px;">vs</span>
          <span class="club-right" style="flex: 1 1 0; text-align: center; padding: 0 5px;">Arsenal</span>
        </div>
        <div class="ticket-info" style="background:rgba(0,0,0,0.25); flex-direction:column; text-align:center; padding: 20px; flex-grow: 1; justify-content: center;">
          <span style="font-weight:700; color:#fff; font-size:1.05rem;">Champions League Final</span>
          <span style="color:#a0b4c8; margin-top: 5px;">30 May, 19:00 &nbsp;·&nbsp; Puskás Aréna, Budapest, Hungary</span>
        </div>
      </div>

      <div class="ticket-card" style="background:#993d00; border-color:#b34700; display: flex; flex-direction: column;">
        <div class="result-row" style="background:transparent; align-items: center; padding: 20px 16px;">
          <span class="club-left" style="flex: 1 1 0; text-align: center; padding: 0 5px;">Freiburg</span>
          <span class="result-score" style="flex-shrink: 0; margin: 0 10px;">vs</span>
          <span class="club-right" style="flex: 1 1 0; text-align: center; padding: 0 5px;">Aston Villa</span>
        </div>
        <div class="ticket-info" style="background:rgba(0,0,0,0.25); flex-direction:column; text-align:center; padding: 20px; flex-grow: 1; justify-content: center;">
          <span style="font-weight:700; color:#fff; font-size:1.05rem;">Europa League Final</span>
          <span style="color:#e6c2b3; margin-top: 5px;">20 May, 22:00 &nbsp;·&nbsp; Tüpraş Stadyumu, Istanbul, Türkiye</span>
        </div>
      </div>

      <div class="ticket-card" style="background:#00401a; border-color:#005c26; display: flex; flex-direction: column;">
        <div class="result-row" style="background:transparent; align-items: center; padding: 20px 16px;">
          <span class="club-left" style="flex: 1 1 0; text-align: center; padding: 0 5px; font-size:0.85rem; line-height:1.2;">Crystal Palace</span>
          <span class="result-score" style="flex-shrink: 0; margin: 0 10px;">vs</span>
          <span class="club-right" style="flex: 1 1 0; text-align: center; padding: 0 5px; font-size:0.85rem; line-height:1.2;">Rayo Vallecano</span>
        </div>
        <div class="ticket-info" style="background:rgba(0,0,0,0.25); flex-direction:column; text-align:center; padding: 20px; flex-grow: 1; justify-content: center;">
          <span style="font-weight:700; color:#fff; font-size:1.05rem;">Conference League Final</span>
          <span style="color:#b3e6c2; margin-top: 5px;">27 May, 22:00 &nbsp;·&nbsp; Red Bull Arena, Leipzig, Germany</span>
        </div>
      </div>
    </div>

    <h2 class="mb-3">Semi-Final Results</h2>
    <div class="results-grid mb-5">
      <div class="result-row" style="background:linear-gradient(to right,#003f7f 50%,#dc052d 50%)">
        <span class="club-left">PSG</span><span class="result-score">6 : 5</span><span class="club-right">Bayern</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#ce1126 50%,#ef0107 50%)">
        <span class="club-left">Atlético</span><span class="result-score">1 : 2</span><span class="club-right">Arsenal</span>
      </div>
    </div>

    <h2 class="mb-3">Quarter-Final Results</h2>
    <div class="results-grid mb-5">
      <div class="result-row" style="background:linear-gradient(to right,#003f7f 50%,#c8102e 50%)">
        <span class="club-left">PSG</span><span class="result-score">4 : 0</span><span class="club-right" style="color:#2b7427;">Liverpool</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#ffffff 50%,#dc052d 50%)">
        <span class="club-left" style="color:#000;">Real Madrid</span><span class="result-score" style="color:#000;background:rgba(0,0,0,0.1);">4 : 6</span><span class="club-right">Bayern</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#a50044 50%,#ce1126 50%)">
        <span class="club-left" style="color:#003da5;">Barcelona</span><span class="result-score">2 : 3</span><span class="club-right">Atlético</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#006600 50%,#ef0107 50%)">
        <span class="club-left">Sporting</span><span class="result-score">0 : 1</span><span class="club-right">Arsenal</span>
      </div>
    </div>

    <h2 class="mb-3">Round of 16 Results</h2>
    <div class="results-grid mb-4">
      <div class="result-row" style="background:linear-gradient(to right,#003f7f 50%,#034694 50%)">
        <span class="club-left">PSG</span><span class="result-score">8 : 2</span><span class="club-right">Chelsea</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#e07010 50%,#c8102e 50%)">
        <span class="club-left" style="color:#c8102e;">Galatasaray</span><span class="result-score">1 : 4</span><span class="club-right" style="color:#2b7427;">Liverpool</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#ffffff 50%,#6cabdd 50%)">
        <span class="club-left" style="color:#000;">Real Madrid</span><span class="result-score" style="color:#000;background:rgba(0,0,0,0.1);">5 : 1</span><span class="club-right" style="color:#000;">Man City</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#1c7abf 50%,#dc052d 50%)">
        <span class="club-left">Atalanta</span><span class="result-score">2 : 10</span><span class="club-right">Bayern</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#241f20 50%,#a50044 50%)">
        <span class="club-left">Newcastle</span><span class="result-score">3 : 8</span><span class="club-right" style="color:#003da5;">Barcelona</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#ce1126 50%,#132257 50%)">
        <span class="club-left">Atlético</span><span class="result-score">7 : 5</span><span class="club-right">Tottenham</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#f5d020 50%,#006600 50%)">
        <span class="club-left" style="color:#000;">Bodø/Glimt</span><span class="result-score">3 : 5</span><span class="club-right">Sporting</span>
      </div>
      <div class="result-row" style="background:linear-gradient(to right,#111111 50%,#ef0107 50%)">
        <span class="club-left" style="color:#e32221;">Bayer 04</span><span class="result-score">1 : 3</span><span class="club-right">Arsenal</span>
      </div>
    </div>

  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { injectIcons } from '@/composables/useIcons'

onMounted(() => {
  setTimeout(() => injectIcons(), 0)
})
</script>
