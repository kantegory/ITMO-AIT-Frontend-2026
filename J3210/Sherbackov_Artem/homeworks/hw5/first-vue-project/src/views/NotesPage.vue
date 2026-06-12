<template>
 <base-layout>
   <h1 class="text-center mb-4">Notes app</h1>


   <form
    ref="noteForm"
    @submit.prevent="createCard"
    class="note-form-container d-flex flex-column my-5"
    >
        <input
            type="text"
            v-model="form.name"
            class="note-input my-1"
            placeholder="Название заметки..."
        >


        <textarea
            cols="30" rows="10"
            v-model="form.text"
            class="note-textarea my-1"
            placeholder="Текст заметки..."
        />


        <button
            type="submit"
            class="note-submit-btn mt-3"
        >
            Отправить
        </button>
    </form>



   <div class="row row-cols-1 row-cols-md-2 g-4 mt-5" id="notes">
     <div class="col" v-for="note in notes" :key="note.id">
       <note-card :name="note.name" :text="note.text" />
     </div>
   </div>
 </base-layout>
</template>


<script>
import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'
import useNotesStore from '@/stores/notes'


export default {
    name: 'NotesPage',

    components: { BaseLayout, NoteCard },

    data() {
        return {
            form: {
                name: '',
                text: '',
                userId: 1
            }
        }
    },

    computed: {
        ...mapState(useNotesStore, ['notes'])
    },

    methods: {
        ...mapActions(useNotesStore, ['loadNotes', 'createNote']),

        async createCard() {
            await this.createNote(this.form)
            await this.loadNotes()

            this.$refs.noteForm.reset()
        }
    },

    mounted() {
        this.loadNotes()
    }
}
</script>

<style src="@/assets/form.css" scoped></style>
