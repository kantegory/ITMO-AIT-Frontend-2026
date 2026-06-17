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
    <AppTopbar title="Мои датасеты">
        <template #actions><button class="btn btn-primary" type="button" @click="uploadOpen = true"><SvgIcon name="upload" />Загрузить датасет</button></template>
    </AppTopbar>
    <div class="content-area">
        <CollectionTable :items="resources.myDatasets" kind="datasets" @remove="removeItem('datasets', $event)" />
    </div>
    <UploadModal v-if="uploadOpen" initial-type="dataset" @close="uploadOpen = false" />
</template>
