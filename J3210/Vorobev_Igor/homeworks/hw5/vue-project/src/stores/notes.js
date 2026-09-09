import { defineStore } from 'pinia'
// импортируем API
import { notesApi } from '@/api'


// создаём хранилище
const useNotesStore = defineStore('notes', {
 // в стейте заведём пустой массив с заемтками
 state: () => ({
   notes: []
 }),


 actions: {
   // заведём метод для подгрузки заметок
   async loadNotes() {
     const response = await notesApi.getAll()


     this.notes = response.data


     return response
   },


   // и метод для создания новой заметки
   async createNote(data) {
     const response = await notesApi.createNote(data)


     this.notes = response.data


     return response
   }
 }
})


export default useNotesStore
