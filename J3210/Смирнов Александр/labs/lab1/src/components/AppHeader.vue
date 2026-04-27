<template>
    <header>
        <nav class="navbar navbar-expand-lg site-navbar">
            <div class="container">
                <RouterLink class="navbar-brand text-white" to="/">AI Hub</RouterLink>

                <div class="d-flex align-items-center gap-2 ms-auto">
                    <button
                        type="button"
                        class="btn btn-outline-light d-inline-flex align-items-center justify-content-center"
                        :aria-label="themeButtonLabel"
                        :title="themeButtonLabel"
                        style="width: 42px; height: 38px;"
                        @click="toggleTheme"
                    >
                        <svg v-if="theme === 'dark'" class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                            <path
                                fill="currentColor"
                                d="M6.76 4.84l-1.8-1.79l-1.41 1.41l1.79 1.8zM1 13h3v-2H1zm10-9h2v3h-2zm7.66 1.46l1.41-1.41l-1.79-1.8l-1.41 1.42zM17.24 19.16l1.8 1.79l1.41-1.41l-1.79-1.8zM20 11v2h3v-2zm-8 9h2v3h-2zM4.22 19.36l1.41 1.41l1.79-1.79l-1.41-1.41zM12 6a6 6 0 1 0 6 6a6 6 0 0 0-6-6"
                            />
                        </svg>
                        <svg v-else class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                            <path
                                fill="currentColor"
                                d="M9.37 5.51A7 7 0 0 0 18.49 14.63A8 8 0 1 1 9.37 5.51"
                            />
                        </svg>
                    </button>

                    <template v-if="isLoggedIn">
                        <div class="dropdown">
                            <button
                                id="notifDropdown"
                                type="button"
                                class="btn btn-outline-light position-relative d-inline-flex align-items-center justify-content-center"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                aria-label="Notifications"
                                title="Notifications"
                                style="width: 42px; height: 38px;"
                            >
                                <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                                    <path
                                        fill="currentColor"
                                        d="M12 2a6 6 0 0 0-6 6v3.764c0 .52-.208 1.02-.578 1.388L4 14.586V16h16v-1.414l-1.422-1.434A1.96 1.96 0 0 1 18 11.764V8a6 6 0 0 0-6-6m0 20a3 3 0 0 0 2.816-2H9.184A3 3 0 0 0 12 22"
                                    />
                                </svg>
                                <span
                                    v-if="notifications.length"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style="font-size: 0.65rem;"
                                >
                                    {{ notifications.length }}
                                </span>
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
                                        class="btn btn-sm btn-link text-danger p-0 d-inline-flex align-items-center justify-content-center"
                                        aria-label="Delete notification"
                                        @click="removeNotification(notification.id)"
                                    >
                                        <svg class="icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                                            <path
                                                fill="currentColor"
                                                d="M18.3 5.71L12 12l6.3 6.29l-1.41 1.42L10.59 13.41L4.29 19.7L2.88 18.29L9.17 12L2.88 5.71L4.29 4.29l6.3 6.3l6.29-6.3z"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <RouterLink
                            to="/profile"
                            class="btn btn-outline-light d-inline-flex align-items-center justify-content-center"
                            aria-label="Profile"
                            title="Profile"
                            style="width: 42px; height: 38px;"
                        >
                            <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                                <path
                                    fill="currentColor"
                                    d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-5.33 0-8 2.24-8 4v2h16v-2c0-1.76-2.67-4-8-4"
                                />
                            </svg>
                        </RouterLink>
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
