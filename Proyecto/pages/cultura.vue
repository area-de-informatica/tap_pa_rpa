<template>
  <v-container>
    <h1 class="text-h4 mb-4">Cuestionario: Redes Neuronales</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-alert v-if="!questions.length" type="info" border="start" variant="tonal">
          No hay preguntas disponibles.
        </v-alert>
        <Test
          v-for="question in questions"
          :key="question.id"
          :question="question"
          @select-question="handleSelectQuestion"
        />
      </v-col>

      <v-col cols="12" md="6">
        <EditQuestion
          v-if="currentQuestion"
          :question="currentQuestion"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStoreRedNeuronal } from '@/stores/redNeuronal'

const store = useStoreRedNeuronal()

const questions = computed(() => store.questions)
const currentQuestion = computed(() => store.currentQuestion)

const handleSelectQuestion = (question) => {
  store.setCurrentQuestion(question)
}

onMounted(() => {
  store.fetchQuestions()
})
</script>
