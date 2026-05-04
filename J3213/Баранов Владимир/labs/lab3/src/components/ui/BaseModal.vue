<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    title: { type: String, required: true },
    show: { type: Boolean, default: true },
});
const emit = defineEmits(["close"]);

function onKeydown(e) {
    if (e.key === "Escape" && props.show) emit("close");
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="modal-pl-backdrop" @click.self="$emit('close')">
            <div class="modal-pl" role="dialog" aria-modal="true" :aria-label="title">
                <header class="modal-pl__header">
                    <h2 class="h5 mb-0">{{ title }}</h2>
                    <button type="button" class="btn-close" aria-label="Закрыть" @click="$emit('close')"></button>
                </header>
                <div class="modal-pl__body">
                    <slot />
                </div>
                <footer class="modal-pl__footer" v-if="$slots.footer">
                    <slot name="footer" />
                </footer>
            </div>
        </div>
    </Teleport>
</template>
