<template>
  <div class="row g-4" v-if="mapData">
    <div class="col-lg-8">
      <div class="map-placeholder" style="position:relative;">
        <!-- Сетка -->
        <div class="map-grid-line" style="top:0;left:33%;width:1px;height:100%;"></div>
        <div class="map-grid-line" style="top:0;left:66%;width:1px;height:100%;"></div>
        <div class="map-grid-line" style="top:25%;left:0;width:100%;height:1px;"></div>
        <div class="map-grid-line" style="top:50%;left:0;width:100%;height:1px;"></div>
        <div class="map-grid-line" style="top:75%;left:0;width:100%;height:1px;"></div>

        <!-- Пины -->
        <div
          v-for="pin in mapData.pins"
          :key="pin.name"
          :style="{
            position:'absolute', top:pin.top, left:pin.left,
            fontSize: activePin === pin.name ? '2rem' : '1.5rem',
            filter: activePin === pin.name ? 'drop-shadow(0 0 6px #2c5f4a)' : '',
            cursor:'pointer', zIndex:2, transition:'all .3s',
          }"
          :title="pin.label"
          @click="activePin = activePin === pin.name ? null : pin.name">
          📍
        </div>

        <!-- Центральный блок -->
        <div style="text-align:center;position:relative;z-index:1;">
          <div style="font-size:2.5rem;opacity:.2;margin-bottom:.5rem;">🗺</div>
          <p style="color:var(--text-muted);font-size:.9rem;margin:0;">Карта — {{ mapData.city }}</p>
          <p style="font-size:.78rem;color:var(--text-light);margin:.3rem 0 1rem;">Нажмите на маркер</p>
          <a
            :href="`https://maps.google.com/?q=${encodeURIComponent(mapData.query)}`"
            target="_blank"
            class="btn-outline-custom"
            style="font-size:.82rem;padding:.4rem 1rem;">
            <i class="bi bi-map me-1"></i>Google Maps
          </a>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <h3 class="serif mb-3" style="font-size:1rem;">Точки на карте</h3>
      <div class="d-flex flex-column gap-2">
        <div
          v-for="pin in mapData.pins"
          :key="pin.name"
          class="attraction-item"
          :style="{ padding:'.7rem', cursor:'pointer', background: activePin===pin.name ? 'var(--accent-light)' : '' }"
          @click="activePin = activePin === pin.name ? null : pin.name">
          <span style="font-size:1.2rem;">{{ pin.icon }}</span>
          <div>
            <strong style="font-size:.85rem;">{{ pin.label }}</strong>
            <div style="font-size:.75rem;color:var(--text-muted);">{{ pin.district }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ mapData: { type: Object, default: null } })
const activePin = ref(null)
</script>
