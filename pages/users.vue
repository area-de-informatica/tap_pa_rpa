<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <UserList
            @edit="crudComponent.editUser($event)"
            @delete="deleteUser"
          />
        </v-col>
        <v-col cols="12" md="4">
          <UserCrud ref="crudComponent" @saved="fetchUsers" />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  
  const usersStore = useUsersStore()
  const crudComponent = ref(null)
  
  const fetchUsers = async () => {
    await usersStore.fetchUsers()
  }
  
  const deleteUser = async (id) => {
    await usersStore.deleteUser(id)
  }
  
  onMounted(fetchUsers)
  </script>