import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    async fetchUsers() {
      const response = await $fetch('/api/users')
      this.users = response
    },
    async addUser(user) {
      const newUser = await $fetch('/api/users', {
        method: 'POST',
        body: user
      })
      this.users.push(newUser)
    },
    async updateUser(user) {
      const updatedUser = await $fetch('/api/users', {
        method: 'PUT',
        body: user
      })
      const index = this.users.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        this.users[index] = updatedUser
      }
    },
    async deleteUser(id) {
      await $fetch('/api/users', {
        method: 'DELETE',
        body: { id }
      })
      this.users = this.users.filter((u) => u.id !== id)
    }
  },
  persist: {
    storage: process.client ? localStorage : undefined // Solo usa localStorage en el cliente
  }
})