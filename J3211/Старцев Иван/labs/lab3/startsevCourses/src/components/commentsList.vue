<script setup>
defineProps({
    comments: {
        type: Array,
        required: true,
    },
})
</script>

<template>
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
</template>
