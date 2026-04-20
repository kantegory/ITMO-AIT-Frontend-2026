<template>
    <header>
        <nav class="navbar navbar-expand-lg site-navbar">
            <div class="container">
                <RouterLink class="navbar-brand text-white" to="/">AI Hub</RouterLink>

                <div class="d-flex align-items-center gap-2 ms-auto">
                    <button
                        type="button"
                        class="btn btn-outline-light"
                        :aria-label="themeButtonLabel"
                        :title="themeButtonLabel"
                        @click="toggleTheme"
                    >
                        {{ theme === "dark" ? "☀" : "🌙" }}
                    </button>

                    <template v-if="isLoggedIn">
                        <div class="dropdown">
                            <button
                                id="notifDropdown"
                                type="button"
                                class="btn btn-outline-light dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Notifications
                                <span v-if="notifications.length" class="badge rounded-pill bg-danger ms-1">{{ notifications.length }}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" style="max-height: 320px; overflow: auto; width: 320px;">
                                <li v-if="loadingNotifications" class="dropdown-item text-muted">Loading...</li>
                                <li v-else-if="!notifications.length" class="dropdown-item text-muted">No notifications</li>
                                <li v-for="notification in notifications" :key="notification.id" class="dropdown-item d-flex justify-content-between gap-2">
                                    <RouterLink :to="`/model/${notification.itemId}`" class="text-decoration-none text-dark small">
                                        <strong>{{ notification.actorName }}</strong>
                                        {{ notification.type === "reply" ? " replied to your comment" : " commented on your item" }}
                                    </RouterLink>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-link text-danger p-0"
                                        aria-label="Delete notification"
                                        @click="removeNotification(notification.id)"
                                    >
                                        ✕
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <RouterLink to="/profile" class="btn btn-outline-light">Profile</RouterLink>
                        <button type="button" class="btn btn-danger btn-sm" @click="handleLogout">Log out</button>
                    </template>

                    <template v-else>
                        <RouterLink to="/login" class="btn btn-outline-light">Log in</RouterLink>
                        <RouterLink to="/register" class="btn btn-primary">Sign up</RouterLink>
                    </template>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { deleteNotification, getUserNotifications } from "../api/notifications";
import { useAuth } from "../composables/useAuth";
import { useTheme } from "../composables/useTheme";

const router = useRouter();
const { user, isLoggedIn, logout } = useAuth();
const { theme, applyTheme, toggleTheme } = useTheme();

const notifications = ref([]);
const loadingNotifications = ref(false);

const themeButtonLabel = computed(() => {
    return theme.value === "dark" ? "Switch to light theme" : "Switch to dark theme";
});

const loadNotifications = async () => {
    if (!user.value?.id) {
        notifications.value = [];
        return;
    }

    loadingNotifications.value = true;
    try {
        notifications.value = await getUserNotifications(user.value.id);
    } finally {
        loadingNotifications.value = false;
    }
};

const removeNotification = async (id) => {
    await deleteNotification(id);
    await loadNotifications();
};

const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    logout();
    await router.push("/");
};

watch(isLoggedIn, (loggedIn) => {
    if (!loggedIn) {
        notifications.value = [];
        return;
    }
    loadNotifications();
}, { immediate: true });

onMounted(() => {
    applyTheme(theme.value);
});
</script>
