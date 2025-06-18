<template>
    <v-container>
      <v-card>
        <v-card-title>{{ editing ? 'Editar' : 'Crear' }} Usuario</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveUser">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              required
            ></v-text-field>
            <v-btn
              type="submit"
              color="success"
              :disabled="!form.name || !form.email"
            >
              {{ editing ? 'Actualizar' : 'Crear' }}
            </v-btn>
            <v-btn
              v-if="editing"
              color="warning"
              @click="resetForm"
            >
              Cancelar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  
  const usersStore = useUsersStore()
  
  const form = ref({
    id: null,
    name: '',
    email: ''
  })
  const editing = ref(false)
  
  const emit = defineEmits(['saved'])
  
  const saveUser = async () => {
    if (editing.value) {
      await usersStore.updateUser({ ...form.value })
    } else {
      await usersStore.addUser({ name: form.value.name, email: form.value.email })
    }
    resetForm()
    emit('saved')
  }
  
  const resetForm = () => {
    form.value = { id: null, name: '', email: '' }
    editing.value = false
  }
  
  defineExpose({
    editUser(user) {
      form.value = { ...user }
      editing.value = true
    }
  })
  </script>