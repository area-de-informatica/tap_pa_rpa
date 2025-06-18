<template>
  <v-container class="py-8">
    <!-- Header con botón de volver -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h3">Cuestionario de Inteligencia Artificial</h1>
      <NuxtLink to="/">
        <v-btn color="primary" prepend-icon="mdi-arrow-left" variant="outlined">
          Volver al inicio
        </v-btn>
      </NuxtLink>
    </div>

    <!-- Mostrar resultados si el quiz está completado -->
    <QuizResults
      v-if="quizCompleted"
      :score="score"
      :total-questions="questions.length"
      :questions="questions"
      :user-answers="userAnswers"
      @restart-quiz="handleRestartQuiz"
    />

    <!-- Mostrar cuestionario si no está completado -->
    <template v-else>
      <!-- Barra de progreso -->
      <v-card class="mb-6" elevation="2">
        <v-card-text>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-h6">Progreso</span>
            <span class="text-body-1">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          </div>
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="8"
            rounded
          ></v-progress-linear>
        </v-card-text>
      </v-card>

      <!-- Pregunta actual -->
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :question-number="currentQuestionIndex + 1"
        :total-questions="questions.length"
        :selected-answer="userAnswers[currentQuestionIndex]"
        @select-answer="handleSelectAnswer"
      />

      <!-- Navegación -->
      <v-card elevation="2">
        <v-card-text>
          <div class="d-flex justify-space-between align-center">
            <v-btn
              :disabled="!canGoPrevious"
              color="primary"
              prepend-icon="mdi-arrow-left"
              @click="handlePreviousQuestion"
              variant="outlined"
            >
              Anterior
            </v-btn>

            <div class="d-flex gap-2">
              <v-btn
                v-for="(question, index) in questions"
                :key="question.id"
                :color="getQuestionButtonColor(index)"
                :variant="currentQuestionIndex === index ? 'elevated' : 'outlined'"
                size="small"
                @click="goToQuestion(index)"
                class="ma-1"
              >
                {{ index + 1 }}
              </v-btn>
            </div>

            <v-btn
              v-if="canGoNext"
              :disabled="!userAnswers[currentQuestionIndex]"
              color="primary"
              append-icon="mdi-arrow-right"
              @click="handleNextQuestion"
            >
              Siguiente
            </v-btn>
            
            <v-btn
              v-else
              :disabled="!allQuestionsAnswered"
              color="success"
              append-icon="mdi-check"
              @click="handleSubmitQuiz"
            >
              Finalizar
            </v-btn>
          </div>
          
          <!-- Mensaje de estado -->
          <div class="text-center mt-4">
            <v-alert
              v-if="!userAnswers[currentQuestionIndex]"
              type="info"
              variant="tonal"
              density="compact"
            >
              Selecciona una respuesta para continuar
            </v-alert>
            
            <v-alert
              v-else-if="!allQuestionsAnswered && currentQuestionIndex === questions.length - 1"
              type="warning"
              variant="tonal"
              density="compact"
            >
              Responde todas las preguntas antes de finalizar ({{ answeredCount }}/{{ questions.length }})
            </v-alert>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Loading state -->
    <v-alert v-if="!questions.length && !quizCompleted" type="info" border="start" variant="tonal">
      Cargando preguntas...
    </v-alert>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStoreQuestion } from '@/stores/questions'

const store = useStoreQuestion()

// Computed properties
const questions = computed(() => store.questions)
const currentQuestion = computed(() => store.getCurrentQuestion)
const currentQuestionIndex = computed(() => store.currentQuestionIndex)
const userAnswers = computed(() => store.userAnswers)
const quizCompleted = computed(() => store.quizCompleted)
const score = computed(() => store.score)
const progress = computed(() => store.getProgress)
const canGoNext = computed(() => store.canGoNext)
const canGoPrevious = computed(() => store.canGoPrevious)

const allQuestionsAnswered = computed(() => {
  return userAnswers.value.every(answer => answer !== null)
})

const answeredCount = computed(() => {
  return userAnswers.value.filter(answer => answer !== null).length
})

// Methods
const handleSelectAnswer = (answerKey) => {
  store.selectAnswer(answerKey)
}

const handleNextQuestion = () => {
  store.nextQuestion()
}

const handlePreviousQuestion = () => {
  store.previousQuestion()
}

const goToQuestion = (index) => {
  store.goToQuestion(index)
}

const handleSubmitQuiz = () => {
  if (allQuestionsAnswered.value) {
    store.submitQuiz()
  }
}

const handleRestartQuiz = () => {
  store.resetQuiz()
}

const getQuestionButtonColor = (index) => {
  if (userAnswers.value[index]) {
    return 'success'
  }
  return 'grey'
}

// Lifecycle
onMounted(() => {
  store.fetchQuestions()
})
</script>

<style scoped>
.v-container {
  max-width: 900px;
}
</style>