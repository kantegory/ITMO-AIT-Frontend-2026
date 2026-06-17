<template>
    <BaseLayout>
        <h1 class="visually-hidden">AI Hub catalog</h1>
        <div class="row">
            <CatalogFilters
                v-model:type="type"
                v-model:task="task"
                v-model:license="license"
            />

            <section class="col-md-9">
                <div class="mb-4">
                    <label for="searchInput" class="form-label">Search by name</label>
                    <input
                        id="searchInput"
                        v-model="search"
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="Search by name..."
                        autocomplete="off"
                    />
                </div>

                <div v-if="loading" class="text-center my-5">
                    <p>Loading data from API...</p>
                </div>
                <div v-else-if="!filteredItems.length">
                    <p>No matches found.</p>
                </div>
                <div v-else class="row g-3">
                    <div v-for="item in filteredItems" :key="item.id" class="col-lg-6">
                        <CatalogCard
                            :item="item"
                            :is-subscribed="subscriptions.includes(item.id)"
                            :is-starred="starred.includes(item.id)"
                            @toggle-subscription="onToggleSubscription"
                            @toggle-star="onToggleStar"
                        />
                    </div>
                </div>
            </section>
        </div>
    </BaseLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getItems, patchItem } from "../api/items";
import CatalogCard from "../components/CatalogCard.vue";
import CatalogFilters from "../components/CatalogFilters.vue";
import { useAuth } from "../composables/useAuth";
import { useCatalogFilters } from "../composables/useCatalogFilters";
import { useUserCollections } from "../composables/useUserCollections";
import BaseLayout from "../layouts/BaseLayout.vue";

const router = useRouter();
const { isLoggedIn } = useAuth();
const { subscriptions, starred } = useUserCollections();

const loading = ref(false);
const items = ref([]);

const { type, task, license, search, filteredItems } = useCatalogFilters(items);

const loadItems = async () => {
    loading.value = true;
    try {
        items.value = await getItems();
    } finally {
        loading.value = false;
    }
};

const ensureAuth = () => {
    if (isLoggedIn.value) return true;
    router.push({ name: "login", query: { redirect: router.currentRoute.value.fullPath } });
    return false;
};

const onToggleSubscription = (itemId) => {
    if (!ensureAuth()) return;
    subscriptions.toggle(itemId);
};

const onToggleStar = async (item) => {
    if (!ensureAuth()) return;

    const isStarred = starred.includes(item.id);
    const nextStars = isStarred ? Math.max(0, item.stars - 1) : item.stars + 1;

    await patchItem(item.id, { stars: nextStars });
    starred.toggle(item.id);

    const target = items.value.find((entry) => String(entry.id) === String(item.id));
    if (target) target.stars = nextStars;
};

onMounted(loadItems);
</script>
