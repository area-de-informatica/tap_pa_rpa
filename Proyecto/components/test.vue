<template>
  <v-card class="mb-4" elevation="2">
    <v-card-title>{{ question.question }}</v-card-title>
    <v-card-text>
      <v-radio-group v-model="selectedAnswer">
        <v-radio
          v-for="(answer, key) in question.answers[0]"
          :key="key"
          :label="answer"
          :value="key"
        ></v-radio>
      </v-radio-group>
      <v-btn color="primary" @click="selectQuestion">Editar Pregunta</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>


const props = defineProps({
  question: { type: Object, required: true },
})

const emit = defineEmits(['select-question'])

const selectedAnswer = ref(null)

const selectQuestion = () => {
  emit('select-question', props.question)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>