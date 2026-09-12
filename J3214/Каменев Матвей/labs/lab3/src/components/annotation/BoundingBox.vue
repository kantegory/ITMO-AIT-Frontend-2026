<script setup>
defineProps({
  box: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete', 'resize-start'])

const corners = ['nw', 'ne', 'sw', 'se']
</script>

<template>
  <div
    class="bbox"
    :style="{ left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` }"
  >
    <button
      type="button"
      class="bbox-delete"
      aria-label="Удалить рамку"
      @mousedown.stop
      @click.stop="$emit('delete')"
    >
      ×
    </button>
    <div
      v-for="corner in corners"
      :key="corner"
      :class="['bbox-handle', `bbox-handle-${corner}`]"
      @mousedown.stop.prevent="$emit('resize-start', corner, $event)"
    ></div>
  </div>
</template>

<style scoped>
.bbox {
  position: absolute;
  border: 2px solid #0d6efd;
  background: rgba(13, 110, 253, 0.08);
  box-sizing: border-box;
}

.bbox-delete {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #dc3545;
  color: #fff;
  border: none;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 10;
}

.bbox-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #0d6efd;
  border-radius: 2px;
  z-index: 5;
}

.bbox-handle-nw {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.bbox-handle-ne {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.bbox-handle-sw {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.bbox-handle-se {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
</style>
