<script setup>
import { ref } from "vue";
import SvgIcon from "./SvgIcon.vue";
import { uploadItem } from "../store.js";

const props = defineProps({
    initialType: {
        type: String,
        default: "model"
    }
});
const emit = defineEmits(["close"]);
const name = ref("");
const type = ref(props.initialType);
const sending = ref(false);

async function submit() {
    if (!name.value.trim()) {
        window.alert("Введите название");
        return;
    }
    sending.value = true;
    await uploadItem(name.value.trim(), type.value);
    sending.value = false;
    window.alert("Успешно отправлено на модерацию!");
    emit("close");
}
</script>

<template>
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show modal-visible" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="uploadModalTitle">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-4 border-0 rounded-4 shadow">
                <h5 class="mb-3 fw-bold" id="uploadModalTitle">Загрузить новый объект</h5>
                <div class="mb-3">
                    <label class="form-label small text-muted" for="uploadName">Название</label>
                    <input v-model="name" class="form-control" id="uploadName" placeholder="Например: BERT-Base-Russian">
                </div>
                <div class="mb-3">
                    <label class="form-label small text-muted" for="uploadType">Тип</label>
                    <select v-model="type" class="form-select" id="uploadType">
                        <option value="model">Модель</option>
                        <option value="dataset">Датасет</option>
                    </select>
                </div>
                <div class="d-flex justify-content-end gap-2 mt-2">
                    <button class="btn btn-light px-4" type="button" @click="emit('close')">Отмена</button>
                    <button class="btn btn-primary px-4" type="button" :disabled="sending" @click="submit"><SvgIcon name="upload" />Загрузить</button>
                </div>
            </div>
        </div>
    </div>
</template>
