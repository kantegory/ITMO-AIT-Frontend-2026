<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    submitText: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['submit', 'update:rating', 'update:text'])
</script>

<template>
    <div
        id="commentModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="commentModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="commentModalLabel" class="modal-title fs-5">
                        {{ title }}
                    </h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                <div class="modal-body">
                    <form id="commentForm" @submit.prevent="emit('submit')">
                        <div class="mb-3">
                            <label for="commentRating" class="form-label">Оценка</label>
                            <select
                                id="commentRating"
                                :value="props.rating"
                                class="form-select"
                                name="rating"
                                @change="emit('update:rating', $event.target.value)"
                            >
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                        </div>

                        <div>
                            <label for="commentText" class="form-label">Текст комментария</label>
                            <textarea
                                id="commentText"
                                :value="props.text"
                                class="form-control"
                                rows="4"
                                name="text"
                                placeholder="Напишите комментарий..."
                                required
                                @input="emit('update:text', $event.target.value)"
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        Отмена
                    </button>
                    <button type="submit" class="btn btn-primary" form="commentForm">
                        {{ submitText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
