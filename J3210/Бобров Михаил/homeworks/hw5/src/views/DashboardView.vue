<script setup>
import { ref } from "vue";
import AppTopbar from "../components/AppTopbar.vue";
import ResourceCard from "../components/ResourceCard.vue";
import SvgIcon from "../components/SvgIcon.vue";
import UploadModal from "../components/UploadModal.vue";
import { store } from "../store.js";

const tab = ref("models");
const uploadOpen = ref(false);
const tabs = [
    { key: "models", title: "Модели" },
    { key: "datasets", title: "Датасеты" },
    { key: "subscriptions", title: "Подписки" }
];
</script>

<template>
    <AppTopbar title="Личный кабинет">
        <template #actions>
            <button class="btn btn-primary upload-btn" type="button" @click="uploadOpen = true"><SvgIcon name="upload" />Загрузить</button>
        </template>
    </AppTopbar>
    <div class="content-area">
        <ul class="nav nav-pills mb-4" role="tablist" aria-label="Разделы личного кабинета">
            <li v-for="item in tabs" :key="item.key" class="nav-item">
                <button class="nav-link" :class="{ active: tab === item.key }" type="button" role="tab" :aria-selected="tab === item.key" @click="tab = item.key">{{ item.title }}</button>
            </li>
        </ul>
        <div class="row g-4" role="tabpanel" aria-live="polite">
            <template v-if="tab === 'models'">
                <div v-for="model in store.myModels" :key="model.id" class="col-md-4"><ResourceCard :item="model" kind="models" compact /></div>
            </template>
            <template v-else-if="tab === 'datasets'">
                <div v-for="dataset in store.myDatasets" :key="dataset.id" class="col-md-4"><ResourceCard :item="dataset" kind="datasets" compact /></div>
            </template>
            <template v-else>
                <div v-for="subscription in store.mySubscriptions" :key="subscription.id" class="col-md-4"><ResourceCard :item="subscription" kind="subscriptions" compact /></div>
            </template>
        </div>
    </div>
    <UploadModal v-if="uploadOpen" @close="uploadOpen = false" />
</template>
