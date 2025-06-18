<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app color="primary" dark elevation="4">
      <v-app-bar-title>
        <v-icon left>mdi-robot</v-icon>
        OVA - Agentes Inteligentes
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>
      <v-btn color="accent" @click="navigateToHome" class="ml-2">
        <v-icon left>mdi-home</v-icon>
        Inicio
      </v-btn>
      <v-btn color="accent" @click="navigateToUsers" class="ml-2">
        <v-icon left>mdi-account-group</v-icon>
        Usuarios
      </v-btn>
    </v-app-bar>

    <!-- Main Page Content -->
    <v-main>
      <NuxtPage />
    </v-main>

    <!-- Footer -->
    <v-footer color="primary" class="text-center">
      <v-container>
        <p class="mb-0">
          Desarrolladores: <br>Anibal Antonio Cuadrado Rengifo<br> Guillermo Soraca<br> Antonty Martinez Cantero
        </p>
        <p class="mb-0">
          © 2025 OVA Agentes Inteligentes - Sistema de Aprendizaje Adaptativo
        </p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const router = useRouter()
const showHelp = ref(false)

const theme = useTheme()
const isDark = ref(theme.global.name.value === 'dark')

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
  isDark.value = !isDark.value
}

const navigateToUsers = () => {
  router.push('/users')
}

const navigateToHome = () => {
  router.push('/')
}
</script>

<style scoped>

</style>
