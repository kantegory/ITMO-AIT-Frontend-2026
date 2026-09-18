import instance from "./instance"
import NotesApi from "./notes"
const notesApi = new NotesApi(instance)
export { notesApi }