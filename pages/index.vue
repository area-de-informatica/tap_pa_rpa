
<template>
  <v-app>
    <v-main>
      <!-- Hero Section -->
      <v-container fluid class="hero-section">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="display-2 font-weight-bold mb-4">
              Agentes Inteligentes
            </h1>
            <p class="headline font-weight-light mb-6">
              Explora el fascinante mundo de los sistemas autónomos que pueden percibir, 
              razonar y actuar en entornos complejos
            </p>
          </v-col>
        </v-row>
      </v-container>

      <!-- Progress Section -->
      <v-container v-if="showProgress" class="my-8">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-progress-check</v-icon>
            Tu Progreso de Aprendizaje
          </v-card-title>
          <v-card-text>
            <v-progress-linear
              :model-value="userProgress"
              color="success"
              height="20"
              class="mb-4"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
            <p>Has completado {{ completedModules }} de {{ totalModules }} módulos</p>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Main Content -->
      <v-container ref="contentSection" class="py-12">
        <!-- Objetivos de Aprendizaje -->
        <v-row class="mb-12">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold text-center mb-8">
              Objetivos de Aprendizaje
            </h2>
            <v-row>
              <v-col 
                v-for="objetivo in objetivos" 
                :key="objetivo.id"
                cols="12" 
                md="4"
              >
                <v-card 
                  class="objective-card h-100" 
                  :class="{ 'completed': objetivo.completado }"
                  @click="toggleObjetivo(objetivo.id)"
                >
                  <v-card-text class="text-center">
                    <v-icon 
                      :color="objetivo.completado ? 'success' : 'primary'" 
                      size="48"
                      class="mb-4"
                    >
                      {{ objetivo.icono }}
                    </v-icon>
                    <h3 class="text-h6 mb-2">{{ objetivo.titulo }}</h3>
                    <p>{{ objetivo.descripcion }}</p>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-chip 
                      :color="objetivo.completado ? 'success' : 'grey'" 
                      variant="outlined"
                    >
                      {{ objetivo.completado ? 'Completado' : 'Pendiente' }}
                    </v-chip>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Módulos de Contenido -->
        <v-row class="mb-12">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold text-center mb-8">
              Módulos de Contenido
            </h2>
            <v-expansion-panels variant="accordion" multiple>
              <v-expansion-panel
                v-for="modulo in modulos"
                :key="modulo.id"
                :value="modulo.id"
              >
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-icon :color="modulo.completado ? 'success' : 'primary'" class="mr-4">
                      {{ modulo.icono }}
                    </v-icon>
                    <div>
                      <h3>{{ modulo.titulo }}</h3>
                      <p class="text-caption mb-0">{{ modulo.duracion }}</p>
                    </div>
                    <v-spacer></v-spacer>
                    <v-chip 
                      :color="modulo.completado ? 'success' : 'warning'" 
                      size="small"
                    >
                      {{ modulo.completado ? 'Completado' : 'En progreso' }}
                    </v-chip>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p class="mb-4">{{ modulo.descripcion }}</p>
                  <v-row>
                    <v-col cols="12" md="8">
                      <h4>Contenidos:</h4>
                      <ul>
                        <li v-for="contenido in modulo.contenidos" :key="contenido">
                          {{ contenido }}
                        </li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>

        <!-- Actividades -->
        <v-row class="mb-12">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold text-center mb-8">
              Actividades de Aprendizaje
            </h2>
            <v-row>
              <v-col 
                v-for="actividad in actividades" 
                :key="actividad.id"
                cols="12" 
                md="6" 
                lg="4"
              >
                <v-card class="activity-card">
                  <v-img
                    :src="actividad.imagen"
                    height="200"
                    cover
                  >
                    <div class="card-overlay">
                      <v-chip :color="actividad.tipo === 'practica' ? 'success' : 'info'">
                        {{ actividad.tipo.toUpperCase() }}
                      </v-chip>
                    </div>
                  </v-img>
                  <v-card-title>{{ actividad.titulo }}</v-card-title>
                  <v-card-text>
                    <p>{{ actividad.descripcion }}</p>
                    <div class="d-flex align-center mt-2">
                      <v-icon left size="small">mdi-clock</v-icon>
                      <span class="text-caption">{{ actividad.duracion }}</span>
                      <v-spacer></v-spacer>
                      <v-rating
                        :model-value="actividad.dificultad"
                        color="orange"
                        size="small"
                        readonly
                        density="compact"
                      ></v-rating>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn 
                      color="primary" 
                      @click="iniciarActividad(actividad.id)"
                      :disabled="!actividad.disponible"
                    >
                      {{ actividad.disponible ? 'Iniciar' : 'Bloqueada' }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon size="small" @click="toggleFavorito(actividad.id)">
                      <v-icon :color="actividad.favorito ? 'red' : 'grey'">
                        mdi-heart
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Evaluaciones -->
        <v-row class="mb-12">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold text-center mb-8">
              Sistema de Evaluación
            </h2>
            <v-row>
              <v-col cols="12" md="12">
                <v-card>
                  <v-card-title>
                    <v-icon left>mdi-trophy</v-icon>
                    Logros y Certificaciones
                  </v-card-title>
                  <v-card-text>
                    <div v-for="logro in logros" :key="logro.id" class="mb-4">
                      <div class="d-flex align-center mb-2">
                        <v-icon 
                          :color="logro.obtenido ? 'gold' : 'grey'" 
                          class="mr-2"
                        >
                          mdi-medal
                        </v-icon>
                        <h4>{{ logro.titulo }}</h4>
                      </div>
                      <v-progress-linear
                        :model-value="logro.progreso"
                        :color="logro.obtenido ? 'success' : 'primary'"
                        height="8"
                      ></v-progress-linear>
                      <p class="text-caption mt-1">{{ logro.descripcion }}</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

// Composables
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

// Reactive data
const showProgress = ref(false)
const showHelp = ref(false)
const contentSection = ref(null)

// Store simulation (replace with Pinia store)
const userProgress = ref(0)
const completedModules = ref(0)
const totalModules = ref(3)

const objetivos = ref([
  {
    id: 1,
    titulo: 'Conceptos Fundamentales',
    descripcion: 'Comprender qué son los agentes inteligentes y sus características principales',
    icono: 'mdi-lightbulb',
    completado: false
  },
  {
    id: 2,
    titulo: 'Arquitecturas de Agentes',
    descripcion: 'Analizar diferentes tipos de arquitecturas y sus aplicaciones',
    icono: 'mdi-cog',
    completado: false
  },
  {
    id: 3,
    titulo: 'Implementación Práctica',
    descripcion: 'Desarrollar agentes inteligentes usando herramientas modernas',
    icono: 'mdi-code-tags',
    completado: false
  }
])

const modulos = ref([
  {
    id: 1,
    titulo: 'Introducción a los Agentes Inteligentes',
    descripcion: 'Fundamentos teóricos y conceptuales de los sistemas de agentes',
    duracion: '2 horas',
    icono: 'mdi-school',
    completado: false,
    contenidos: [
      'Definición y características de agentes',
      'Historia y evolución',
      'Clasificación de agentes',
      'Entornos de operación'
    ]
  },
  {
    id: 2,
    titulo: 'Arquitecturas de Agentes',
    descripcion: 'Diferentes modelos arquitectónicos para el diseño de agentes',
    duracion: '3 horas',
    icono: 'mdi-sitemap',
    completado: false,
    contenidos: [
      'Agentes reactivos',
      'Agentes deliberativos',
      'Arquitecturas híbridas',
      'Sistemas multi-agente'
    ]
  },
  {
    id: 3,
    titulo: 'Algoritmos de Búsqueda',
    descripcion: 'Técnicas de búsqueda para la resolución de problemas',
    duracion: '4 horas',
    icono: 'mdi-magnify',
    completado: false,
    contenidos: [
      'Búsqueda no informada',
      'Búsqueda informada (heurística)',
      'Algoritmos genéticos',
      'Optimización por enjambres'
    ]
  }
])

const actividades = ref([
  {
    id: 1,
    titulo: 'Simulador de Agente Reactivo',
    descripcion: 'Construye un agente que responda a estímulos del entorno',
    tipo: 'practica',
    duracion: '45 min',
    dificultad: 2,
    disponible: true,
    favorito: false,
    imagen: 'https://imecaf.com/blog/wp-content/uploads/computacion-basica.jpg',
    ruta: '/agente'
  },
  {
    id: 2,
    titulo: 'Quiz: Fundamentos Teóricos',
    descripcion: 'Evalúa tu comprensión de los conceptos básicos',
    tipo: 'evaluacion',
    duracion: '20 min',
    dificultad: 1,
    disponible: true,
    favorito: false,
    imagen: 'https://quizizz.com/media/resource/gs/quizizz-media/quizzes/7eac3788-ac0c-4f70-a672-f2c0738c0118',
    ruta: '/questions'
  },
  {
    id: 3,
    titulo: 'Proyecto: Sistema Multi-Agente',
    descripcion: 'Desarrolla un sistema completo con múltiples agentes',
    tipo: 'practica',
    duracion: '2 horas',
    dificultad: 4,
    disponible: false,
    favorito: false,
    imagen: 'https://smartdataautomation.com/wp-content/uploads/2023/03/banner-perfil-.jpg'
  }
])

const logros = ref([
  {
    id: 1,
    titulo: 'Explorador de Agentes',
    descripcion: 'Completa el primer módulo',
    progreso: 100,
    obtenido: true
  },
  {
    id: 2,
    titulo: 'Arquitecto de Sistemas',
    descripcion: 'Domina las arquitecturas de agentes',
    progreso: 75,
    obtenido: false
  },
  {
    id: 3,
    titulo: 'Maestro de IA',
    descripcion: 'Completa Quiz: Fundamentos Teóricos',
    progreso: 45,
    obtenido: false
  }
])

import { useRouter } from 'vue-router'
const router = useRouter()

// Methods
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const navigateToUsers = () => {
  // En una app real de Nuxt, usarías: navigateTo('/users')
  console.log('Navegando a /users')
  window.location.href = '/users'
}

const scrollToContent = () => {
  contentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const toggleObjetivo = (id) => {
  const objetivo = objetivos.value.find(obj => obj.id === id)
  if (objetivo) {
    objetivo.completado = !objetivo.completado
  }
}

const iniciarActividad = (id) => {
  console.log(`Iniciando actividad ${id}`)
  // Aquí navegarías a la actividad específica
  const actividad = actividades.value.find(act => act.id === id)
  if (actividad && actividad.ruta && actividad.disponible) {
    router.push(actividad.ruta)
  }
}

const toggleFavorito = (id) => {
  const actividad = actividades.value.find(act => act.id === id)
  if (actividad) {
    actividad.favorito = !actividad.favorito
  }
}

const getEvaluacionColor = (estado) => {
  switch (estado) {
    case 'completado': return 'success'
    case 'disponible': return 'primary'
    case 'bloqueado': return 'grey'
    default: return 'grey'
  }
}

const getEvaluacionIcon = (estado) => {
  switch (estado) {
    case 'completado': return 'mdi-check-circle'
    case 'disponible': return 'mdi-play-circle'
    case 'bloqueado': return 'mdi-lock'
    default: return 'mdi-help-circle'
  }
}

// Lifecycle
onMounted(() => {
  console.log('OVA Agentes Inteligentes cargado')
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 60vh;
  padding-top: 20vh;

}

.objective-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.objective-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.objective-card.completed {
  border: 2px solid #4CAF50;
}

.activity-card {
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.card-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.v-expansion-panel-title {
  padding: 16px !important;
}
</style>
