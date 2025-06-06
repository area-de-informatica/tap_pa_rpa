<template>
    <v-container>
      <v-card>
        <v-card-title>Lista de Usuarios</v-card-title>
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              color="primary"
              small
              @click="$emit('edit', item)"
            >
              Editar
            </v-btn>
            <v-btn
              color="error"
              small
              @click="$emit('delete', item.id)"
            >
              Eliminar
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  
  const usersStore = useUsersStore()
  const { users } = storeToRefs(usersStore)
  
  const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Nombre', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Acciones', key: 'actions', sortable: false }
  ]
  </script>