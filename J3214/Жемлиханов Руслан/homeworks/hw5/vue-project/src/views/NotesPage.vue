<template>
  <BaseLayout>
    <section class="py-3">
      <div class="row g-4">
        <div class="col-12">
          <h1 class="notes-page-title mb-1">Notes app</h1>
          <p class="text-muted mb-0">Create notes and view them in a Bootstrap card list.</p>
        </div>

        <div class="col-12 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="h4 mb-3">Create note</h2>

              <form ref="noteForm" @submit.prevent="submitForm">
                <div class="mb-3">
                  <label class="form-label" for="note-name">Name</label>
                  <input
                    id="note-name"
                    v-model="form.name"
                    class="form-control"
                    type="text"
                    placeholder="Enter note title"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="note-text">Text</label>
                  <textarea
                    id="note-text"
                    v-model="form.text"
                    class="form-control"
                    placeholder="Enter note text"
                  />
                </div>

                <button class="btn btn-primary" type="submit">Create note</button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-7">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h2 class="h4 mb-0">Notes list</h2>
            <span class="badge text-bg-primary">{{ notesCount }}</span>
          </div>

          <div v-if="notes.length" class="row g-3">
            <div v-for="note in notes" :key="note.id" class="col-12">
              <NoteCard :name="note.name" :text="note.text" />
            </div>
          </div>

          <div v-else class="alert alert-secondary mb-0">
            Notes are not loaded yet. Add the first note to see it here.
          </div>
        </div>
      </div>
    </section>
  </BaseLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import NoteCard from '@/components/NoteCard.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useNotesStore } from '@/stores/notes'

export default {
  name: 'NotesPage',
  components: {
    BaseLayout,
    NoteCard,
  },
  data() {
    return {
      form: this.getDefaultForm(),
    }
  },
  computed: {
    ...mapState(useNotesStore, ['notes']),
    notesCount() {
      return this.notes.length
    },
  },
  mounted() {
    this.loadNotes()
  },
  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote']),
    getDefaultForm() {
      return {
        name: '',
        text: '',
        userId: 1,
      }
    },
    async submitForm() {
      const trimmedName = this.form.name.trim()

      if (!trimmedName) {
        return
      }

      const payload = {
        ...this.form,
        name: trimmedName,
        text: this.form.text.trim(),
      }

      await this.createNote(payload)
      await this.loadNotes()
      this.$refs.noteForm.reset()
      this.form = this.getDefaultForm()
    },
  },
}
</script>
