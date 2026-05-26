<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import AppTopbar from "../components/AppTopbar.vue";
import SvgIcon from "../components/SvgIcon.vue";
import { addComment, findModel, reactToItem, store } from "../store.js";

const route = useRoute();
const tab = ref("description");
const text = ref("");
const model = computed(() => findModel(route.params.id));
const source = computed(() => store.myModels.some(item => item.id === Number(route.params.id)) ? "myModels" : "globalModels");
const comments = computed(() => store.comments.filter(comment => comment.page === "model" && comment.resourceId === Number(route.params.id)));

async function submitComment() {
    if (!text.value.trim()) return;
    await addComment(route.params.id, "model", text.value.trim());
    text.value = "";
}
</script>

<template>
    <template v-if="model">
        <AppTopbar :title="model.name">
            <template #before><RouterLink to="/models" class="btn btn-light btn-sm me-3"><SvgIcon name="back" />Назад</RouterLink></template>
        </AppTopbar>
        <div class="content-area">
            <div class="row">
                <div class="col-md-8">
                    <ul class="nav nav-tabs border-0 mb-3" role="tablist" aria-label="Информация о модели">
                        <li class="nav-item"><button class="nav-link border-0" :class="{ active: tab === 'description' }" type="button" role="tab" :aria-selected="tab === 'description'" @click="tab = 'description'">Описание</button></li>
                        <li class="nav-item"><button class="nav-link border-0" :class="{ active: tab === 'comments' }" type="button" role="tab" :aria-selected="tab === 'comments'" @click="tab = 'comments'">Обсуждения</button></li>
                        <li class="nav-item"><button class="nav-link border-0" :class="{ active: tab === 'tests' }" type="button" role="tab" :aria-selected="tab === 'tests'" @click="tab = 'tests'">Воспроизводимость</button></li>
                    </ul>
                    <div v-if="tab === 'description'" class="card border-0 shadow-sm rounded-4 p-4 mb-4" role="tabpanel">
                        <h5 class="fw-bold mb-3">Описание модели</h5>
                        <p class="text-muted mb-4">{{ model.description }}</p>
                        <h6 class="fw-bold mb-2">Пример подключения (Python)</h6>
                        <div class="bg-dark text-light p-3 rounded-3 font-monospace small mb-4">
                            import dataport<br>model = dataport.load_model("{{ model.name.toLowerCase().replace(/\s+/g, "-") }}")<br>print(model.summary())
                        </div>
                        <h5 class="fw-bold mb-3">История изменений</h5>
                        <div class="d-flex justify-content-between border-bottom py-2"><span class="text-muted">v.1.0.0</span><span class="text-muted">Первоначальный релиз</span></div>
                    </div>
                    <div v-else-if="tab === 'comments'" class="card border-0 shadow-sm rounded-4 p-4" role="tabpanel">
                        <h5 class="fw-bold mb-3">Комментарии</h5>
                        <label class="form-label visually-hidden" for="modelComment">Ваш вопрос или отзыв</label>
                        <textarea v-model="text" class="form-control mb-2" id="modelComment" rows="2" placeholder="Ваш вопрос или отзыв..."></textarea>
                        <button class="btn btn-primary btn-sm mb-4" type="button" @click="submitComment">Отправить</button>
                        <div v-for="comment in comments" :key="comment.id" class="p-3 bg-light rounded-4 mb-3 shadow-sm comment-item">
                            <div class="fw-bold small mb-1">{{ comment.user }}</div>
                            <div class="small text-dark">{{ comment.text }}</div>
                        </div>
                    </div>
                    <div v-else class="card border-0 shadow-sm rounded-4 p-4" role="tabpanel">
                        <h5 class="fw-bold mb-3">Результаты тестов</h5>
                        <div class="p-3 bg-light rounded-3 mb-2 d-flex justify-content-between"><span>Валидация на ImageNet</span><span class="badge bg-success">Passed (Acc: 94.2%)</span></div>
                        <div class="p-3 bg-light rounded-3 mb-2 d-flex justify-content-between"><span>Тест на задержку (Latency)</span><span class="badge bg-success">14ms / image</span></div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div class="d-flex gap-2 mb-4">
                            <button class="btn btn-outline-primary flex-grow-1" type="button" aria-label="Поставить лайк модели" @click="reactToItem(model, 'like', source)">♥ {{ model.likes || 0 }}</button>
                            <button class="btn btn-outline-secondary flex-grow-1" type="button" aria-label="Сделать форк модели" @click="reactToItem(model, 'fork', source)">⑂ {{ model.forks || 0 }}</button>
                        </div>
                        <h5 class="fw-bold mb-4">Информация</h5>
                        <div class="mb-3"><span class="small text-muted d-block">Автор</span><span class="fw-semibold">{{ model.author }}</span></div>
                        <div class="mb-3"><span class="small text-muted d-block">Фреймворк</span><span class="fw-semibold">{{ model.framework }}</span></div>
                        <div class="mb-3"><span class="small text-muted d-block">Размер файла</span><span class="fw-semibold">{{ model.size }}</span></div>
                        <div class="mb-4"><span class="small text-muted d-block mb-1">Категория</span><span class="tag">{{ model.tag }}</span></div>
                        <button class="btn btn-primary w-100 py-2" type="button">Скачать веса (.bin)</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
