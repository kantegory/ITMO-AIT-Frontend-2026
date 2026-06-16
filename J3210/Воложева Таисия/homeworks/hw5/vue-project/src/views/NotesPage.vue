<template>
  <base-layout>
    <h1 class="mb-4">Приложение для заметок</h1>

    <form
      ref="noteForm"
      @submit.prevent="createCard"
      class="d-flex flex-column my-5 p-4 border rounded bg-light shadow-sm"
    >
      <h4 class="mb-3">Создать новую заметку</h4>

      <div class="mb-2">
        <label class="form-label">Заголовок</label>
        <input
          type="text"
          v-model="form.name"
          class="form-control"
          placeholder="Введите название..."
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Текст заметки</label>
        <textarea
          cols="30"
          rows="5"
          v-model="form.text"
          class="form-control"
          placeholder="О чем вы думаете?"
          required
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary shadow-sm">
        Добавить заметку
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-2" id="notes">
      <div class="col" v-for="note in notes" :key="note.id">
        <note-card :name="note.name" :text="note.text" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";
import NoteCard from "@/components/NoteCard.vue";
import { mapActions, mapState } from "pinia";
import useNotesStore from "@/stores/notes";

export default {
  name: "NotesPage",

  components: {
    BaseLayout,
    NoteCard,
  },

  computed: {
    ...mapState(useNotesStore, ["notes"]),
  },

  methods: {
    ...mapActions(useNotesStore, ["loadNotes", "createNote"]),

    async createCard() {
      try {
        //отправка новой заметки
        await this.createNote({
          name: this.form.name,
          text: this.form.text,
          userId: this.form.userId,
        });

        //очистка полей формы
        this.form.name = "";
        this.form.text = "";

        //обновление списка заметок из хранилища
        await this.loadNotes();
      } catch (error) {
        console.error("Ошибка при создании заметки:", error);
        alert("Не удалось сохранить заметку. Проверьте соединение с сервером.");
      }
    },
  },

  data() {
    return {
      form: {
        name: "",
        text: "",
        userId: 1,
      },
    };
  },

  mounted() {
    //автоматическая загрузка заметок при монтировании компонента
    this.loadNotes();
  },
};
</script>

<style scoped>
h1 {
  color: #2c3e50;
  font-weight: bold;
}
</style>
