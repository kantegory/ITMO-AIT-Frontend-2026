<script setup>
import { ref, computed } from "vue";
import { normalizeLog } from "@/composables/useExperiments.js";

const props = defineProps({
    logs: { type: Array, required: true },
});
const emit = defineEmits(["add"]);

const newLevel = ref("info");
const newMessage = ref("");

const normalized = computed(() => props.logs.map(normalizeLog));

function formatTime(ts) {
    if (!ts) return "—";
    try {
        return new Date(ts).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    } catch {
        return ts;
    }
}

function onAdd() {
    if (!newMessage.value.trim()) return;
    emit("add", { level: newLevel.value, message: newMessage.value.trim() });
    newMessage.value = "";
}
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h2 class="h6 mb-3">Логи</h2>
            <div
                v-if="normalized.length"
                class="mb-3"
                style="max-height: 320px; overflow-y: auto; padding: 0.25rem"
            >
                <div v-for="(log, idx) in normalized" :key="idx" class="log-entry">
                    <span class="log-entry__time">{{ formatTime(log.timestamp) }}</span>
                    <span class="log-entry__level" :class="`log-entry__level--${log.level}`">
                        {{ log.level }}
                    </span>
                    <span class="log-entry__message">{{ log.message }}</span>
                </div>
            </div>
            <p v-else class="text-muted small mb-3">Логов пока нет</p>
            <form class="row g-2 align-items-end" @submit.prevent="onAdd">
                <div class="col-3">
                    <label class="form-label small mb-1">Уровень</label>
                    <select v-model="newLevel" class="form-select form-select-sm">
                        <option value="info">info</option>
                        <option value="success">success</option>
                        <option value="warn">warn</option>
                        <option value="error">error</option>
                    </select>
                </div>
                <div class="col-7">
                    <label class="form-label small mb-1">Сообщение</label>
                    <input
                        v-model="newMessage"
                        class="form-control form-control-sm"
                        placeholder="Например, Epoch 5/10 - loss=0.62"
                        required
                    />
                </div>
                <div class="col-2">
                    <button type="submit" class="btn btn-sm btn-primary w-100">Добавить</button>
                </div>
            </form>
        </div>
    </div>
</template>
