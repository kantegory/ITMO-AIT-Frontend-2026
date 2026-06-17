<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import AppTopbar from "../components/AppTopbar.vue";
import SvgIcon from "../components/SvgIcon.vue";
import { useResources } from "../composables/useResources.js";

const route = useRoute();
const tab = ref("description");
const text = ref("");
const { addComment, findDataset, reactToItem, resources } = useResources();
const dataset = computed(() => findDataset(route.params.id));
const source = computed(() => resources.myDatasets.some(item => item.id === Number(route.params.id)) ? "myDatasets" : "globalDatasets");
const comments = computed(() => resources.comments.filter(comment => comment.page === "dataset" && comment.resourceId === Number(route.params.id)));

async function submitComment() {
    if (!text.value.trim()) return;
    await addComment(route.params.id, "dataset", text.value.trim());
    text.value = "";
}
</script>

<template>
    <template v-if="dataset">
        <AppTopbar :title="dataset.name">
            <template #before><RouterLink to="/datasets" class="btn btn-light btn-sm me-3"><SvgIcon name="back" />Назад</RouterLink></template>
        </AppTopbar>
        <div class="content-area">
            <div class="row">
                <div class="col-md-8">
                    <ul class="nav nav-tabs border-0 mb-3" role="tablist" aria-label="Информация о датасете">
                        <li class="nav-item"><button class="nav-link border-0" :class="{ active: tab === 'description' }" type="button" role="tab" :aria-selected="tab === 'description'" @click="tab = 'description'">Описание</button></li>
                        <li class="nav-item"><button class="nav-link border-0" :class="{ active: tab === 'comments' }" type="button" role="tab" :aria-selected="tab === 'comments'" @click="tab = 'comments'">Обсуждения</button></li>
                        <li class="nav-item"><button class="nav-link border-0" :class="{ active: tab === 'preview' }" type="button" role="tab" :aria-selected="tab === 'preview'" @click="tab = 'preview'">Пример данных</button></li>
                    </ul>
                    <div v-if="tab === 'description'" class="card border-0 shadow-sm rounded-4 p-4 mb-4" role="tabpanel">
                        <h5 class="fw-bold mb-3">Описание датасета</h5>
                        <p class="text-muted mb-4">{{ dataset.description }}</p>
                        <h5 class="fw-bold mb-3">Сведения</h5>
                        <div class="d-flex justify-content-between border-bottom py-2"><span class="text-muted">Формат</span><span>{{ dataset.format }}</span></div>
                        <div class="d-flex justify-content-between border-bottom py-2"><span class="text-muted">Объём</span><span>{{ dataset.size }}</span></div>
                        <div class="d-flex justify-content-between py-2"><span class="text-muted">Строки</span><span>{{ dataset.rows || "N/A" }}</span></div>
                    </div>
                    <div v-else-if="tab === 'comments'" class="card border-0 shadow-sm rounded-4 p-4" role="tabpanel">
                        <h5 class="fw-bold mb-3">Комментарии</h5>
                        <label class="form-label visually-hidden" for="datasetComment">Ваш вопрос или отзыв</label>
                        <textarea v-model="text" class="form-control mb-2" id="datasetComment" rows="2" placeholder="Ваш вопрос или отзыв..."></textarea>
                        <button class="btn btn-primary btn-sm mb-4" type="button" @click="submitComment">Отправить</button>
                        <div v-for="comment in comments" :key="comment.id" class="p-3 bg-light rounded-4 mb-3 shadow-sm comment-item">
                            <div class="fw-bold small mb-1">{{ comment.user }}</div>
                            <div class="small text-dark">{{ comment.text }}</div>
                        </div>
                    </div>
                    <div v-else class="card border-0 shadow-sm rounded-4 p-4" role="tabpanel">
                        <h5 class="fw-bold mb-3">Пример данных</h5>
                        <div class="bg-dark text-light p-3 rounded-3 font-monospace small">{ "label": "{{ dataset.tag }}", "source": "DataPort" }</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <button class="btn btn-outline-primary w-100 mb-4" type="button" aria-label="Поставить лайк датасету" @click="reactToItem(dataset, 'like', source)">♥ {{ dataset.likes || 0 }}</button>
                        <h5 class="fw-bold mb-4">Информация</h5>
                        <div class="mb-3"><span class="small text-muted d-block">Дата публикации</span><span class="fw-semibold">{{ dataset.date || "N/A" }}</span></div>
                        <div class="mb-3"><span class="small text-muted d-block">Лицензия</span><span class="fw-semibold">{{ dataset.license }}</span></div>
                        <div class="mb-4"><span class="small text-muted d-block mb-1">Категория</span><span class="tag">{{ dataset.tag }}</span></div>
                        <button class="btn btn-primary w-100 py-2" type="button">Скачать датасет</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
