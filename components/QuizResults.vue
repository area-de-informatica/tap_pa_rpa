<template>
  <v-card class="mb-4" elevation="3">
    <v-card-title class="text-h4 text-center bg-success text-white">
      ¡Cuestionario Completado!
    </v-card-title>
    
    <v-card-text class="pa-6">
      <div class="text-center mb-6">
        <v-icon 
          :icon="scoreIcon" 
          :color="scoreColor" 
          size="80"
          class="mb-4"
        ></v-icon>
        
        <h2 class="text-h3 mb-2" :class="scoreColor">
          {{ score }} / {{ totalQuestions }}
        </h2>
        
        <p class="text-h6 mb-4">
          Porcentaje: {{ percentage }}%
        </p>
        
        <p class="text-body-1 mb-4" :class="scoreColor">
          {{ scoreMessage }}
        </p>
      </div>

      <!-- Revisión detallada -->
      <v-divider class="mb-4"></v-divider>
      
      <h3 class="text-h5 mb-4">Revisión de Respuestas:</h3>
      
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(question, index) in questions"
          :key="question.id"
          :title="`Pregunta ${index + 1}`"
        >
          <v-expansion-panel-text>
            <div class="mb-3">
              <strong>{{ question.question }}</strong>
            </div>
            
            <div class="mb-2">
              <v-chip 
                :color="isCorrect(index) ? 'success' : 'error'"
                variant="tonal"
                class="mb-2"
              >
                <v-icon 
                  :icon="isCorrect(index) ? 'mdi-check' : 'mdi-close'"
                  start
                ></v-icon>
                {{ isCorrect(index) ? 'Correcta' : 'Incorrecta' }}
              </v-chip>
            </div>
            
            <div class="mb-2">
              <strong>Tu respuesta:</strong> 
              <span :class="isCorrect(index) ? 'text-success' : 'text-error'">
                {{ getUserAnswerText(index) }}
              </span>
            </div>
            
            <div v-if="!isCorrect(index)">
              <strong>Respuesta correcta:</strong> 
              <span class="text-success">
                {{ getCorrectAnswerText(index) }}
              </span>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-center mt-6">
        <v-btn 
          color="primary" 
          size="large"
          prepend-icon="mdi-restart"
          @click="$emit('restart-quiz')"
          class="mr-4"
        >
          Reintentar
        </v-btn>
        
        <NuxtLink to="/">
          <v-btn 
            color="success" 
            size="large"
            prepend-icon="mdi-home"
          >
            Volver al Inicio
          </v-btn>
        </NuxtLink>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  questions: { type: Array, required: true },
  userAnswers: { type: Array, required: true }
})

defineEmits(['restart-quiz'])

const percentage = computed(() => {
  return Math.round((props.score / props.totalQuestions) * 100)
})

const scoreColor = computed(() => {
  if (percentage.value >= 80) return 'text-success'
  if (percentage.value >= 60) return 'text-warning'
  return 'text-error'
})

const scoreIcon = computed(() => {
  if (percentage.value >= 80) return 'mdi-trophy'
  if (percentage.value >= 60) return 'mdi-medal'
  return 'mdi-thumb-down'
})

const scoreMessage = computed(() => {
  if (percentage.value >= 80) return '¡Excelente trabajo!'
  if (percentage.value >= 60) return 'Buen trabajo, pero puedes mejorar'
  return 'Necesitas estudiar más. ¡Inténtalo de nuevo!'
})

const isCorrect = (index) => {
  const question = props.questions[index]
  const userAnswer = props.userAnswers[index]
  return userAnswer === question.correctAnswer
}

const getUserAnswerText = (index) => {
  const question = props.questions[index]
  const userAnswer = props.userAnswers[index]
  return userAnswer ? `${userAnswer.toUpperCase()}) ${question.answers[userAnswer]}` : 'Sin respuesta'
}

const getCorrectAnswerText = (index) => {
  const question = props.questions[index]
  const correctKey = question.correctAnswer
  return `${correctKey.toUpperCase()}) ${question.answers[correctKey]}`
}
</script>