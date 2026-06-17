<script setup>
defineProps({
    comments: {
        type: Array,
        required: true,
    },
    buttonVisible: {
        type: Boolean,
        default: false,
    },
    buttonText: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['open-comment'])
</script>

<template>
    <div class="card mt-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Комментарии</h2>

            <button
                v-if="buttonVisible"
                type="button"
                class="btn btn-primary btn-sm px-2 px-sm-3"
                data-bs-toggle="modal"
                data-bs-target="#commentModal"
                :aria-label="buttonText"
                @click="emit('open-comment')"
            >
                <svg class="default_svg" aria-hidden="true">
                    <use href="/sprites.svg#chat"></use>
                </svg>
                <span class="d-none d-sm-inline ms-1">{{ buttonText }}</span>
            </button>
        </div>

        <div class="card-body">
            <ul class="list-group list-group-flush">
                <li
                    v-if="!comments.length"
                    class="list-group-item px-0 text-muted"
                >
                    Пока нет комментариев.
                </li>

                <li
                    v-for="comment in comments"
                    :key="comment.userId"
                    class="list-group-item px-0"
                >
                    <article>
                        <header class="d-flex justify-content-between gap-2">
                            <strong>{{ comment.authorName }}</strong>
                            <span>
                                <svg class="rating__star" aria-hidden="true">
                                    <use href="/sprites.svg#ratingStar"></use>
                                </svg>
                                {{ comment.rating }}/5
                            </span>
                        </header>
                        <p class="mb-0 mt-1">{{ comment.text }}</p>
                    </article>
                </li>
            </ul>
        </div>
    </div>
</template>
