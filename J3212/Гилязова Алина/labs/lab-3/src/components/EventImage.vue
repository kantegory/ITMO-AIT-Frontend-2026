<template>
  
  <img
    v-if="showImage"
    :src="src"
    :alt="alt"
    :class="imageClass"
    @error="onError"
  >
  <div
    v-else
    class="event-image-placeholder"
    :class="imageClass"
    role="img"
    :aria-label="alt || 'Нет фото'"
  >
    <base-icon name="image" />
    <span class="placeholder-text">Нет фото</span>
  </div>
</template>

<script>

import BaseIcon from '@/components/BaseIcon.vue'
import { isValidImageUrl } from '@/utils/validators'

export default {
  name: 'EventImage',
  components: { BaseIcon },
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },

    imageClass: { type: String, default: '' }
  },
  data() {
    return { failed: false }
  },
  computed: {

    showImage() {
      return !this.failed && isValidImageUrl(this.src)
    }
  },
  methods: {
    onError() {
      this.failed = true
    }
  },

  watch: {
    src() {
      this.failed = false
    }
  }
}

</script>
