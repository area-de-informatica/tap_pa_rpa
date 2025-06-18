import { defineStore } from 'pinia'

export const useStoreQuestion = defineStore('questions', {
  state: () => ({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    quizCompleted: false,
    score: 0,
  }),

  getters: {
    getCurrentQuestion: (state) => {
      return state.questions[state.currentQuestionIndex] || null
    },
    
    getTotalQuestions: (state) => state.questions.length,
    
    getProgress: (state) => {
      return state.questions.length > 0 
        ? ((state.currentQuestionIndex + 1) / state.questions.length) * 100 
        : 0
    },

    canGoNext: (state) => {
      return state.currentQuestionIndex < state.questions.length - 1
    },

    canGoPrevious: (state) => {
      return state.currentQuestionIndex > 0
    }
  },

  actions: {
    async fetchQuestions() {
      try {
        const response = await $fetch('/api/questions', { method: 'GET' })
        this.questions = response
        // Inicializar respuestas del usuario
        this.userAnswers = new Array(response.length).fill(null)
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    },

    selectAnswer(answerKey) {
      if (this.currentQuestionIndex < this.userAnswers.length) {
        this.userAnswers[this.currentQuestionIndex] = answerKey
      }
    },

    nextQuestion() {
      if (this.canGoNext) {
        this.currentQuestionIndex++
      }
    },

    previousQuestion() {
      if (this.canGoPrevious) {
        this.currentQuestionIndex--
      }
    },

    goToQuestion(index) {
      if (index >= 0 && index < this.questions.length) {
        this.currentQuestionIndex = index
      }
    },

    submitQuiz() {
      // Calcular puntaje
      let correctAnswers = 0
      
      this.questions.forEach((question, index) => {
        const userAnswer = this.userAnswers[index]
        const correctAnswer = question.correctAnswer
        
        if (userAnswer === correctAnswer) {
          correctAnswers++
        }
      })

      this.score = correctAnswers
      this.quizCompleted = true
    },

    resetQuiz() {
      this.currentQuestionIndex = 0
      this.userAnswers = new Array(this.questions.length).fill(null)
      this.quizCompleted = false
      this.score = 0
    },

    getUserAnswerForQuestion(index) {
      return this.userAnswers[index] || null
    },

    isAnswerCorrect(questionIndex) {
      const question = this.questions[questionIndex]
      const userAnswer = this.userAnswers[questionIndex]
      return question && userAnswer === question.correctAnswer
    }
  },

  persist: {
    storage: process.client ? localStorage : undefined,
  },
})