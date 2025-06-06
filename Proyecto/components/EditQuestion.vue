<template>
    <v-card class="mb-4" elevation="2">
      <v-card-title>Editar Pregunta</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveQuestion">
          <v-text-field
            v-model="localQuestion.question"
            label="Pregunta"
            required
          ></v-text-field>
          <v-text-field
            v-for="(answer, key) in localQuestion.answers[0]"
            :key="key"
            v-model="localQuestion.answers[0][key]"
            :label="`Respuesta ${key.toUpperCase()}`"
            required
          ></v-text-field>
          <v-btn type="submit" color="success" class="mr-2">Guardar</v-btn>
          <v-btn color="error" @click="cancelEdit">Cancelar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  
  const props = defineProps({
    question: { type: Object, required: true },
  })
  
  const store = useStore()
  
  // Estado local para manejar los cambios en el formulario
  const localQuestion = ref({ ...props.question })
  
  // Sincronizar cambios en la prop question
  watch(
    () => props.question,
    (newQuestion) => {
      localQuestion.value = { ...newQuestion }
    },
    { deep: true }
  )
  
  // Guardar los cambios en el store
  const saveQuestion = () => {
    store.updateQuestion(localQuestion.value)
    store.setCurrentQuestion(null) // Limpiar la pregunta actual después de guardar
  }
  
  // Cancelar la edición
  const cancelEdit = () => {
    store.setCurrentQuestion(null) // Limpiar la pregunta actual
  }
  </script>
  
  <style scoped>
  .mb-4 {
    margin-bottom: 16px;
  }
  </style>