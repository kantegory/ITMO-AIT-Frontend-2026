<script setup>
import { ref } from 'vue'

import BoundingBox from '@/components/annotation/BoundingBox.vue'
import ConfirmButton from '@/components/annotation/ConfirmButton.vue'
import useEventListener from '@/composables/useEventListener'

defineProps({
  datapoint: {
    type: Object,
    required: true,
  },
  labels: {
    type: Array,
    default: () => [],
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const MIN_DRAW_SIZE = 10
const MIN_RESIZE_SIZE = 20

const wrapper = ref(null)
const boxes = ref([])
const drawing = ref(null)

let nextId = 0
let drawStart = null
let resizing = null

function getRelPos(e) {
  const rect = wrapper.value.getBoundingClientRect()

  return {
    x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
    y: Math.max(0, Math.min(e.clientY - rect.top, rect.height)),
  }
}

function startDrawing(e) {
  const pos = getRelPos(e)

  drawStart = pos
  drawing.value = { id: nextId++, x: pos.x, y: pos.y, w: 0, h: 0 }
}

function startResizing(box, corner, e) {
  resizing = {
    box,
    corner,
    startMouse: getRelPos(e),
    startBox: { x: box.x, y: box.y, w: box.w, h: box.h },
  }
}

function removeBox(id) {
  boxes.value = boxes.value.filter((box) => box.id !== id)
}

function onMouseMove(e) {
  if (drawing.value) {
    const pos = getRelPos(e)

    Object.assign(drawing.value, {
      x: Math.min(drawStart.x, pos.x),
      y: Math.min(drawStart.y, pos.y),
      w: Math.abs(pos.x - drawStart.x),
      h: Math.abs(pos.y - drawStart.y),
    })
    return
  }

  if (resizing) {
    const { box, corner, startMouse, startBox } = resizing
    const pos = getRelPos(e)
    const dx = pos.x - startMouse.x
    const dy = pos.y - startMouse.y

    let { x, y, w, h } = startBox
    if (corner === 'nw') { x += dx; y += dy; w -= dx; h -= dy }
    else if (corner === 'ne') { y += dy; w += dx; h -= dy }
    else if (corner === 'sw') { x += dx; w -= dx; h += dy }
    else if (corner === 'se') { w += dx; h += dy }

    if (w < MIN_RESIZE_SIZE) {
      if (corner === 'nw' || corner === 'sw') x = startBox.x + startBox.w - MIN_RESIZE_SIZE
      w = MIN_RESIZE_SIZE
    }
    if (h < MIN_RESIZE_SIZE) {
      if (corner === 'nw' || corner === 'ne') y = startBox.y + startBox.h - MIN_RESIZE_SIZE
      h = MIN_RESIZE_SIZE
    }

    Object.assign(box, { x, y, w, h })
  }
}

function onMouseUp() {
  if (drawing.value) {
    const box = drawing.value
    drawing.value = null

    if (box.w >= MIN_DRAW_SIZE && box.h >= MIN_DRAW_SIZE) {
      boxes.value.push(box)
    }
  }

  resizing = null
}

useEventListener(document, 'mousemove', onMouseMove)
useEventListener(document, 'mouseup', onMouseUp)

function submit() {
  const { clientWidth: width, clientHeight: height } = wrapper.value

  emit('submit', {
    boxes: boxes.value.map(({ x, y, w, h }) => ({ x: x / width, y: y / height, w: w / width, h: h / height })),
  })
}
</script>

<template>
  <div class="d-flex justify-content-center mb-4">
    <div ref="wrapper" class="detect-wrapper" @mousedown.self.prevent="startDrawing">
      <img :src="datapoint.image" :alt="datapoint.alt" />
      <bounding-box
        v-for="box in boxes"
        :key="box.id"
        :box="box"
        @delete="removeBox(box.id)"
        @resize-start="(corner, e) => startResizing(box, corner, e)"
      />
      <bounding-box v-if="drawing" :box="drawing" />
    </div>
  </div>
  <confirm-button :disabled="boxes.length === 0 || saving" @confirm="submit" />
</template>

<style scoped>
.detect-wrapper {
  position: relative;
  display: inline-block;
  cursor: crosshair;
  user-select: none;
  max-width: 100%;
}

.detect-wrapper img {
  display: block;
  max-width: 100%;
  height: auto;
  pointer-events: none;
}
</style>
