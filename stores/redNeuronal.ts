// stores/redNeuronal.ts
import { defineStore } from 'pinia'

interface RedNeuronalQuestion {
  id: number; // O el tipo de ID que uses
  culture: string; // O question, si prefieres ese nombre
  answers: { [key: string]: string }[]; // O un tipo más específico si conoces la estructura de las respuestas
}

export const useStoreRedNeuronal = defineStore('redNeuronal', {
  state: () => ({
    redNeuronals: [] as RedNeuronalQuestion[], // Indicamos que esperamos un array de RedNeuronalQuestion
    currentRedNeuronal: null as RedNeuronalQuestion | null, // Pregunta actualmente seleccionada
  }),

  actions: {
    async fetchQuestions() {
      try {
       // Usamos el tipo RedNeuronalQuestion con $fetch
       const response = await $fetch<RedNeuronalQuestion[]>('/api/red-neuronal', { method: 'GET' });
       this.redNeuronals = response;
      } catch (error) {
        console.error('Error fetching red neuronal questions:', error)
      }
    },

    setCurrentRedNeuronal(redNeuronal: RedNeuronalQuestion) {
      this.currentRedNeuronal = { ...redNeuronal } // Clonamos para evitar mutaciones directas
    },

    updateQuestion(updateRedNeuronal: RedNeuronalQuestion) {
      const index = this.redNeuronals.findIndex(q => q.id === updateRedNeuronal.id)
      if (index !== -1) {
        this.redNeuronals[index] = { ...updateRedNeuronal }
        if (this.currentRedNeuronal && this.currentRedNeuronal.id === updateRedNeuronal.id) {
          this.currentRedNeuronal = { ...updateRedNeuronal }
        }
      }
    },
  },

  persist: {
    storage: process.client ? localStorage : undefined, // Persistencia en el cliente
  },
})
