<script setup>
import { ref } from "vue";
import AppTopbar from "../components/AppTopbar.vue";
import CollectionTable from "../components/CollectionTable.vue";
import SvgIcon from "../components/SvgIcon.vue";
import UploadModal from "../components/UploadModal.vue";
import { useResources } from "../composables/useResources.js";

const uploadOpen = ref(false);
const { removeItem, resources } = useResources();
</script>

<template>
    <AppTopbar title="Мои модели">
        <template #actions><button class="btn btn-primary" type="button" @click="uploadOpen = true"><SvgIcon name="upload" />Загрузить модель</button></template>
    </AppTopbar>
    <div class="content-area">
        <CollectionTable :items="resources.myModels" kind="models" @remove="removeItem('models', $event)" />
    </div>
    <UploadModal v-if="uploadOpen" initial-type="model" @close="uploadOpen = false" />
</template>
