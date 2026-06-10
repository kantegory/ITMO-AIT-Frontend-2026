<script setup>
import { computed, reactive, ref } from "vue";
import AppTopbar from "../components/AppTopbar.vue";
import ResourceCard from "../components/ResourceCard.vue";
import SvgIcon from "../components/SvgIcon.vue";
import { addToCollection, store } from "../store.js";

const tab = ref("models");
const filters = reactive({ search: "", tag: "", framework: "", license: "" });
const models = computed(() => store.globalModels.filter(item => matches(item, true)));
const datasets = computed(() => store.globalDatasets.filter(item => matches(item, false)));

function matches(item, model) {
    return item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (!filters.tag || item.tag === filters.tag) &&
        (!model || !filters.framework || item.framework === filters.framework) &&
        (!filters.license || item.license?.includes(filters.license));
}

function reset() {
    Object.assign(filters, { search: "", tag: "", framework: "", license: "" });
}
</script>

<template>
    <AppTopbar title="Исследовать ресурсы">
        <template #actions>
            <div class="search-box explore-search">
                <SvgIcon name="search" />
                <label class="visually-hidden" for="globalSearch">Поиск по названию</label>
                <input v-model="filters.search" type="search" class="form-control" id="globalSearch" placeholder="Поиск по названию..." autocomplete="off">
            </div>
        </template>
    </AppTopbar>
    <div class="content-area">
        <div class="row">
            <div class="col-md-3">
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h6 class="fw-bold mb-3">Фильтры</h6>
                    <div class="mb-3">
                        <label class="small text-muted mb-2" for="filterTag">Задача (Тег)</label>
                        <select v-model="filters.tag" class="form-select form-select-sm" id="filterTag">
                            <option value="">Все задачи</option><option>LLM</option><option value="CV">Vision</option><option>NLP</option><option>GenAI</option><option>Audio</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="small text-muted mb-2" for="filterFramework">Фреймворк</label>
                        <select v-model="filters.framework" class="form-select form-select-sm" id="filterFramework">
                            <option value="">Все</option><option>PyTorch</option><option>Transformers</option><option>GGUF</option><option>Diffusers</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="small text-muted mb-2" for="filterLicense">Лицензия</label>
                        <select v-model="filters.license" class="form-select form-select-sm" id="filterLicense">
                            <option value="">Любая</option><option>MIT</option><option>Apache 2.0</option><option>OpenRail</option>
                        </select>
                    </div>
                    <button class="btn btn-light btn-sm w-100" type="button" @click="reset">Сбросить</button>
                </div>
            </div>
            <div class="col-md-9">
                <ul class="nav nav-pills mb-4" role="tablist" aria-label="Типы ресурсов">
                    <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'models' }" type="button" role="tab" :aria-selected="tab === 'models'" @click="tab = 'models'">Модели</button></li>
                    <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'datasets' }" type="button" role="tab" :aria-selected="tab === 'datasets'" @click="tab = 'datasets'">Датасеты</button></li>
                </ul>
                <div class="row g-4" role="tabpanel" aria-live="polite">
                    <template v-if="tab === 'models'">
                        <div v-for="model in models" :key="model.id" class="col-md-6 col-lg-4"><ResourceCard :item="model" kind="models" addable @add="addToCollection('models', $event)" /></div>
                        <p v-if="!models.length" class="text-muted p-3">Модели не найдены</p>
                    </template>
                    <template v-else>
                        <div v-for="dataset in datasets" :key="dataset.id" class="col-md-6 col-lg-4"><ResourceCard :item="dataset" kind="datasets" addable @add="addToCollection('datasets', $event)" /></div>
                        <p v-if="!datasets.length" class="text-muted p-3">Датасеты не найдены</p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
