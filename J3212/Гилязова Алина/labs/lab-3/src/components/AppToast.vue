<template>
  
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div ref="toastEl" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{ toastState.title }}</strong>
        <button type="button" class="btn-close" aria-label="Закрыть" @click="hideToast" />
      </div>
      <div class="toast-body">{{ toastState.message }}</div>
    </div>
  </div>
</template>

<script>

import { Toast } from 'bootstrap'
import useToast from '@/composables/useToast'

export default {
  name: 'AppToast',
  setup() {
    const { toastState, hideToast } = useToast()
    return { toastState, hideToast }
  },
  data() {
    return { toast: null }
  },
  mounted() {
    this.toast = new Toast(this.$refs.toastEl, { delay: 3500 })
  },
  watch: {

    'toastState.token'() {
      if (this.toast && this.toastState.visible) this.toast.show()
    }
  }
}

</script>
