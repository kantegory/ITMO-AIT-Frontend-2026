<script setup>
import { ref, reactive, computed } from 'vue'

import ConfirmButton from '@/components/annotation/ConfirmButton.vue'
import useEventListener from '@/composables/useEventListener'

const props = defineProps({
  datapoint: {
    type: Object,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const textContainer = ref(null)
const popup = ref(null)

const entities = ref([])
const pendingSelection = ref(null)
const popupPosition = reactive({ top: 0, left: 0 })

const colors = computed(() => Object.fromEntries(props.labels.map(({ value, color }) => [value, color])))

const paragraphs = computed(() =>
  props.datapoint.paragraphs.map((text, index) => {
    const parts = []
    let cursor = 0

    entities.value
      .filter(({ paragraph }) => paragraph === index)
      .sort((a, b) => a.start - b.start)
      .forEach((entity) => {
        if (entity.start > cursor) parts.push({ text: text.slice(cursor, entity.start) })
        parts.push({ text: text.slice(entity.start, entity.end), entity })
        cursor = entity.end
      })

    if (cursor < text.length) parts.push({ text: text.slice(cursor) })

    return parts
  }),
)

function markStyle(label) {
  const color = colors.value[label]

  return { background: `${color}33`, borderBottom: `2px solid ${color}`, borderRadius: '3px' }
}

function offsetWithin(element, node, offset) {
  const range = document.createRange()
  range.selectNodeContents(element)
  range.setEnd(node, offset)

  return range.toString().length
}

function showPopup(range) {
  const containerRect = textContainer.value.getBoundingClientRect()
  const rangeRect = range.getBoundingClientRect()

  popupPosition.top = rangeRect.bottom - containerRect.top + textContainer.value.scrollTop + 6
  popupPosition.left = Math.max(0, rangeRect.left - containerRect.left)
}

function onTextMouseUp() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
    return
  }

  const range = selection.getRangeAt(0)
  if (!textContainer.value.contains(range.commonAncestorContainer)) return

  const ancestor = range.commonAncestorContainer
  const paragraphElement = (ancestor.nodeType === Node.ELEMENT_NODE ? ancestor : ancestor.parentElement).closest(
    '[data-paragraph]',
  )
  if (!paragraphElement) return

  const paragraph = Number(paragraphElement.dataset.paragraph)
  const start = offsetWithin(paragraphElement, range.startContainer, range.startOffset)
  const end = offsetWithin(paragraphElement, range.endContainer, range.endOffset)

  if (entities.value.some((entity) => entity.paragraph === paragraph && start < entity.end && end > entity.start)) {
    return
  }

  pendingSelection.value = { paragraph, start, end }
  showPopup(range)
}

function addEntity(label) {
  if (!pendingSelection.value) return

  entities.value.push({ ...pendingSelection.value, label })

  window.getSelection().removeAllRanges()
  pendingSelection.value = null
}

function removeEntity(entity) {
  entities.value = entities.value.filter((item) => item !== entity)
}

useEventListener(document, 'mousedown', (e) => {
  if (popup.value?.contains(e.target)) return

  pendingSelection.value = null
})

function submit() {
  emit('submit', { entities: entities.value.map(({ paragraph, start, end, label }) => ({ paragraph, start, end, label })) })
}
</script>

<template>
  <div class="d-flex gap-3 flex-wrap mb-3" role="list" aria-label="Обозначения типов сущностей">
    <span v-for="label in labels" :key="label.value" class="d-flex align-items-center gap-1 small" role="listitem">
      <span
        class="ner-legend-dot"
        :style="{ background: `${label.color}33`, borderBottom: `2px solid ${label.color}` }"
        aria-hidden="true"
      ></span>
      {{ label.title }}
    </span>
  </div>

  <div class="card mb-4">
    <div class="card-body">
      <div ref="textContainer" class="ner-text" @mouseup="onTextMouseUp">
        <p v-for="(parts, index) in paragraphs" :key="index" :data-paragraph="index"><template v-for="(part, partIndex) in parts" :key="partIndex"><mark v-if="part.entity" class="ner-mark" :style="markStyle(part.entity.label)" @click="removeEntity(part.entity)">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></p>
      </div>
      <div
        v-if="pendingSelection"
        ref="popup"
        class="ner-popup"
        :style="{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }"
        role="dialog"
        aria-label="Выберите тип сущности"
      >
        <button
          v-for="label in labels"
          :key="label.value"
          type="button"
          class="btn btn-sm ner-entity-btn"
          :style="{ background: `${label.color}20`, borderColor: label.color, color: label.textColor }"
          :aria-label="`Отметить как ${label.title}`"
          @mousedown.prevent
          @click="addEntity(label.value)"
        >
          {{ label.title }}
        </button>
      </div>
    </div>
  </div>

  <confirm-button :disabled="saving" @confirm="submit" />
</template>

<style scoped>
.ner-text {
  position: relative;
  line-height: 2;
  font-size: 1rem;
}

.ner-mark {
  border-radius: 3px;
  padding: 1px 2px;
  cursor: pointer;
  position: relative;
}

.ner-mark:hover {
  opacity: 0.7;
}

.ner-popup {
  position: absolute;
  z-index: 100;
  background: #fff;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 0.4rem 0.5rem;
  display: flex;
  gap: 0.4rem;
  white-space: nowrap;
}

.ner-legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  vertical-align: middle;
}
</style>
