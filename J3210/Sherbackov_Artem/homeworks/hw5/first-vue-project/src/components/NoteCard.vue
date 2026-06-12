<template>
 <div class="note-card">
   <div class="note-card-body">
	   <!-- отображение свойств в шаблоне можно сделать так: -->
     <h5 class="note-card-title">{{ name }}</h5>
     <p class="card-text">
       {{ text }}
     </p>
   </div>
 </div>
</template>


<script>
export default {
 name: 'NoteCard',


 // свойства, которые принимает компонент
 props: {
   name: {
     type: String,
     required: true
   },
   text: {
     type: String,
     required: false
   }
 }
}
</script>

<style src="@/assets/card.css" scoped></style>