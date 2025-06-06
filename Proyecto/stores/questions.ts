// stores/questions.ts
import { defineStore } from 'pinia'

export const useStoreQuestion = defineStore('questions', {
  state: () => ({
    questions: [], // Lista de preguntas
    currentQuestion: null, // Pregunta actualmente seleccionada
  }),

  actions: {
    async fetchQuestions() {
      try {
        const response = await $fetch('/api/questions', { method: 'GET' })
        this.questions = response
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    },

    setCurrentQuestion(question) {
      this.currentQuestion = { ...question } // Clonamos para evitar mutaciones directas
    },

    updateQuestion(updatedQuestion) {
      const index = this.questions.findIndex(q => q.id === updatedQuestion.id)
      if (index !== -1) {
        this.questions[index] = { ...updatedQuestion }
        if (this.currentQuestion && this.currentQuestion.id === updatedQuestion.id) {
          this.currentQuestion = { ...updatedQuestion }
        }
      }
    },
  },

  persist: {
    storage: process.client ? localStorage : undefined, // Persistencia solo en el cliente
  },
})
