<script setup>
defineProps(['course'])
defineEmits(['delete'])
</script>

<template>
    <tr class="align-middle">
        <td class="ps-4 py-3">
            <router-link :to="`/course/${course.id}`"
                         class="text-decoration-none course-link fw-bold">
                {{ course.title }}
            </router-link>
        </td>
        <td><span class="badge bg-light text-dark border">{{ course.studentsCount }} чел.</span>
        </td>
        <td><small>{{ course.category }}</small></td>
        <td class="pe-4">
            <button @click="$emit('delete', course)" class="btn btn-sm btn-outline-danger border-0"
                    :aria-label="'Удалить курс ' + course.title">
                <svg class="icon" aria-hidden="true" focusable="false">
                    <use xlink:href="/sprite.svg#icon-trash"></use>
                </svg>
            </button>
        </td>
    </tr>
</template>
