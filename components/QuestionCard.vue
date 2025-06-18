<template>
  <v-card class="mb-4" elevation="3">
    <v-card-title class="text-h5 bg-primary text-white">
      Pregunta {{ questionNumber }} de {{ totalQuestions }}
    </v-card-title>
    
    <v-card-text class="pa-6">
      <h3 class="text-h6 mb-4">{{ question.question }}</h3>
      
      <v-radio-group 
        :model-value="selectedAnswer" 
        @update:model-value="$emit('select-answer', $event)"
      >
        <v-radio
          v-for="(answer, key) in question.answers"
          :key="key"
          :label="answer"
          :value="key"
          class="mb-2"
          color="primary"
        >
          <template #label>
            <span class="text-body-1">{{ String(key).toUpperCase() }}) {{ answer }}</span>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  question: { type: Object, required: true },
  questionNumber: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  selectedAnswer: { type: String, default: null }
})

defineEmits(['select-answer'])
</script>