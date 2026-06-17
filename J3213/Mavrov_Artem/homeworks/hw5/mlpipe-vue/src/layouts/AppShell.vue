<template>
  <div class="app-shell">
    <SvgSprite />
    <AppSidebar />
    <div class="main-wrap">
      <AppTopbar :title="title">
        <template #actions>
          <slot name="actions" />
        </template>
      </AppTopbar>
      <div class="content-area">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import SvgSprite from '@/components/SvgSprite.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'

export default {
  name: 'AppShell',
  components: { SvgSprite, AppSidebar, AppTopbar },
  props: {
    title: { type: String, default: 'MLPipe' }
  }
}
</script>
