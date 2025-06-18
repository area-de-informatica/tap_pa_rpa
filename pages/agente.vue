<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="mb-4">
              <v-card-title>
                <v-icon left>mdi-cog</v-icon>
                Panel de Control
              </v-card-title>
              <v-card-text>
                <!-- Simulation Controls -->
                <div class="mb-4">
                  <v-btn
                    :color="isRunning ? 'error' : 'success'"
                    @click="toggleSimulation"
                    block
                    size="large"
                  >
                    <v-icon left>{{ isRunning ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                    {{ isRunning ? 'Pausar' : 'Iniciar' }} Simulación
                  </v-btn>
                </div>

                <div class="mb-4">
                  <v-label>Velocidad de Simulación</v-label>
                  <v-slider
                    v-model="simulationSpeed"
                    :min="1"
                    :max="10"
                    :step="1"
                    show-ticks
                    tick-size="4"
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-speedometer-slow</v-icon>
                    </template>
                    <template v-slot:append>
                      <v-icon>mdi-speedometer</v-icon>
                    </template>
                  </v-slider>
                </div>

                <v-divider class="my-4"></v-divider>
                <h4 class="mb-3">Control del Entorno</h4>
                
                <v-btn
                  @click="addObstacle"
                  color="warning"
                  variant="outlined"
                  block
                  class="mb-2"
                >
                  <v-icon left>mdi-cube</v-icon>
                  Añadir Obstáculo
                </v-btn>

                <v-btn
                  @click="addFood"
                  color="success"
                  variant="outlined"
                  block
                  class="mb-2"
                >
                  <v-icon left>mdi-circle</v-icon>
                  Añadir Comida
                </v-btn>

                <v-btn
                  @click="addThreat"
                  color="error"
                  variant="outlined"
                  block
                  class="mb-2"
                >
                  <v-icon left>mdi-alert-circle</v-icon>
                  Añadir Amenaza
                </v-btn>

                <v-btn
                  @click="clearEnvironment"
                  color="grey"
                  variant="outlined"
                  block
                >
                  <v-icon left>mdi-delete</v-icon>
                  Limpiar Entorno
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title>
                <v-icon left>mdi-chart-line</v-icon>
                Estado del Agente
              </v-card-title>
              <v-card-text>
                <div class="stat-item mb-3">
                  <div class="d-flex justify-space-between mb-1">
                    <span>Energía</span>
                    <span>{{ agent.energy }}/100</span>
                  </div>
                  <v-progress-linear
                    :model-value="agent.energy"
                    color="success"
                    height="8"
                  ></v-progress-linear>
                </div>

                <div class="stat-item mb-3">
                  <div class="d-flex justify-space-between mb-1">
                    <span>Salud</span>
                    <span>{{ agent.health }}/100</span>
                  </div>
                  <v-progress-linear
                    :model-value="agent.health"
                    color="error"
                    height="8"
                  ></v-progress-linear>
                </div>

                <v-divider class="my-3"></v-divider>

                <div class="stat-row">
                  <div class="text-caption">Posición: ({{ Math.round(agent.x) }}, {{ Math.round(agent.y) }})</div>
                  <div class="text-caption">Estado: {{ agent.state }}</div>
                  <div class="text-caption">Comida Recolectada: {{ agent.foodCollected }}</div>
                  <div class="text-caption">Tiempo Activo: {{ formatTime(simulationTime) }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                <v-icon left>mdi-earth</v-icon>
                Entorno de Simulación
                <v-spacer></v-spacer>
                <v-chip :color="isRunning ? 'success' : 'error'" size="small">
                  {{ isRunning ? 'ACTIVO' : 'PAUSADO' }}
                </v-chip>
              </v-card-title>
              <v-card-text>
                <div class="simulation-container">
                  <canvas
                    ref="simulationCanvas"
                    @click="handleCanvasClick"
                    :width="canvasWidth"
                    :height="canvasHeight"
                    class="simulation-canvas"
                  ></canvas>
                  
                  <div v-if="!isRunning && environment.objects.length === 0" class="canvas-overlay">
                    <div class="text-center">
                      <v-icon size="48" color="grey">mdi-cursor-default-click</v-icon>
                      <p class="mt-2">Haz clic para añadir objetos al entorno</p>
                      <p class="text-caption">O usa los botones del panel de control</p>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mt-4">
              <v-card-title>
                <v-icon left>mdi-format-list-bulleted</v-icon>
                Registro de Comportamiento
                <v-spacer></v-spacer>
                <v-btn icon size="small" @click="clearLog">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text style="max-height: 200px; overflow-y: auto;">
                <div v-if="behaviorLog.length === 0" class="text-center text-grey">
                  No hay registros aún. Inicia la simulación para ver el comportamiento del agente.
                </div>
                <div v-else>
                  <div
                    v-for="(log, index) in behaviorLog.slice().reverse()"
                    :key="index"
                    class="log-entry"
                    :class="`log-${log.type}`"
                  >
                    <v-icon :color="getLogColor(log.type)" size="small" class="mr-2">
                      {{ getLogIcon(log.type) }}
                    </v-icon>
                    <span class="text-caption">{{ formatTime(log.time) }}</span>
                    <span class="ml-2">{{ log.message }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showHelp" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-help-circle</v-icon>
          Ayuda del Simulador
        </v-card-title>
        <v-card-text>
          <h4>¿Qué es un Agente Reactivo?</h4>
          <p class="mb-3">
            Un agente reactivo es un tipo de agente inteligente que responde directamente 
            a los estímulos del entorno sin mantener un modelo interno del mundo.
          </p>

          <h4>Cómo usar el simulador:</h4>
          <ul class="mb-3">
            <li><strong>Iniciar:</strong> Presiona "Iniciar Simulación" para comenzar</li>
            <li><strong>Añadir objetos:</strong> Usa los botones del panel o haz clic en el canvas</li>
            <li><strong>Observar:</strong> El agente reaccionará automáticamente a los objetos</li>
            <li><strong>Controlar:</strong> Ajusta la velocidad con el slider</li>
          </ul>

          <h4>Comportamientos del Agente:</h4>
          <ul>
            <li><strong>🟢 Comida:</strong> El agente se mueve hacia ella para recargar energía</li>
            <li><strong>🔴 Amenaza:</strong> El agente huye para proteger su salud</li>
            <li><strong>🟤 Obstáculo:</strong> El agente los evita modificando su trayectoria</li>
            <li><strong>⚡ Exploración:</strong> Cuando no hay estímulos, explora aleatoriamente</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showHelp = false">
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const simulationCanvas = ref(null)
const isRunning = ref(false)
const simulationSpeed = ref(5)
const simulationTime = ref(0)
const showHelp = ref(false)
const canvasWidth = ref(600)
const canvasHeight = ref(400)

const agent = ref({
  x: 300,
  y: 200,
  energy: 100,
  health: 100,
  state: 'exploring',
  direction: 0,
  speed: 2,
  size: 15,
  foodCollected: 0,
  viewRange: 80
})

const environment = ref({
  objects: []
})

const behaviorLog = ref([])

let animationFrame = null
let lastTime = 0

let ctx = null

const OBJECT_TYPES = {
  FOOD: { color: '#4CAF50', size: 8, effect: 'energy' },
  THREAT: { color: '#F44336', size: 12, effect: 'damage' },
  OBSTACLE: { color: '#795548', size: 16, effect: 'block' }
}

const initCanvas = () => {
  if (simulationCanvas.value) {
    ctx = simulationCanvas.value.getContext('2d')
    resizeCanvas()
  }
}

const resizeCanvas = () => {
  const container = simulationCanvas.value?.parentElement
  if (container) {
    canvasWidth.value = Math.min(600, container.clientWidth - 32)
    canvasHeight.value = 400
  }
}

const toggleSimulation = () => {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    startSimulation()
  } else {
    stopSimulation()
  }
}

const startSimulation = () => {
  lastTime = performance.now()
  animate()
  addBehaviorLog('info', 'Simulación iniciada')
}

const stopSimulation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  addBehaviorLog('info', 'Simulación pausada')
}

const animate = (currentTime) => {
  if (!isRunning.value) return

  const deltaTime = currentTime - lastTime
  const speedMultiplier = simulationSpeed.value / 5

  if (deltaTime >= (1000 / 60) / speedMultiplier) {
    updateAgent()
    updateEnvironment()
    draw()
    simulationTime.value += deltaTime
    lastTime = currentTime
  }

  animationFrame = requestAnimationFrame(animate)
}

const updateAgent = () => {
  // Decrease energy over time
  if (agent.value.energy > 0) {
    agent.value.energy = Math.max(0, agent.value.energy - 0.1)
  }

  // Find nearest objects
  const nearbyObjects = findNearbyObjects()
  
  if (nearbyObjects.length > 0) {
    // React to nearest object
    const target = nearbyObjects[0]
    reactToObject(target)
  } else {
    // Explore randomly
    explore()
  }

  // Move agent
  moveAgent()

  // Check for collisions
  checkCollisions()

  // Update agent state based on energy and health
  updateAgentState()
}

const findNearbyObjects = () => {
  return environment.value.objects
    .map(obj => ({
      ...obj,
      distance: Math.sqrt(
        Math.pow(obj.x - agent.value.x, 2) + 
        Math.pow(obj.y - agent.value.y, 2)
      )
    }))
    .filter(obj => obj.distance <= agent.value.viewRange)
    .sort((a, b) => a.distance - b.distance)
}

const reactToObject = (target) => {
  const dx = target.x - agent.value.x
  const dy = target.y - agent.value.y
  
  if (target.type === 'THREAT') {
    // Run away from threat
    agent.value.direction = Math.atan2(-dy, -dx)
    agent.value.state = 'fleeing'
    agent.value.speed = 3
  } else if (target.type === 'FOOD') {
    // Move towards food
    agent.value.direction = Math.atan2(dy, dx)
    agent.value.state = 'seeking_food'
    agent.value.speed = 2.5
  } else if (target.type === 'OBSTACLE') {
    // Avoid obstacle
    const avoidAngle = Math.atan2(dy, dx) + (Math.PI / 2)
    agent.value.direction = avoidAngle
    agent.value.state = 'avoiding'
    agent.value.speed = 2
  }
}

const explore = () => {
  // Random walk behavior
  if (Math.random() < 0.02) {
    agent.value.direction += (Math.random() - 0.5) * 0.5
  }
  agent.value.state = 'exploring'
  agent.value.speed = 1.5
}

const moveAgent = () => {
  const newX = agent.value.x + Math.cos(agent.value.direction) * agent.value.speed
  const newY = agent.value.y + Math.sin(agent.value.direction) * agent.value.speed

  // Bounce off walls
  if (newX < agent.value.size || newX > canvasWidth.value - agent.value.size) {
    agent.value.direction = Math.PI - agent.value.direction
  } else {
    agent.value.x = newX
  }

  if (newY < agent.value.size || newY > canvasHeight.value - agent.value.size) {
    agent.value.direction = -agent.value.direction
  } else {
    agent.value.y = newY
  }

  // Keep agent within bounds
  agent.value.x = Math.max(agent.value.size, Math.min(canvasWidth.value - agent.value.size, agent.value.x))
  agent.value.y = Math.max(agent.value.size, Math.min(canvasHeight.value - agent.value.size, agent.value.y))
}

const checkCollisions = () => {
  environment.value.objects = environment.value.objects.filter(obj => {
    const distance = Math.sqrt(
      Math.pow(obj.x - agent.value.x, 2) + 
      Math.pow(obj.y - agent.value.y, 2)
    )

    if (distance < agent.value.size + obj.size) {
      handleCollision(obj)
      return obj.type === 'OBSTACLE' // Keep obstacles, remove others
    }
    return true
  })
}

const handleCollision = (obj) => {
  switch (obj.type) {
    case 'FOOD':
      agent.value.energy = Math.min(100, agent.value.energy + 20)
      agent.value.foodCollected++
      addBehaviorLog('success', `¡Comida recolectada! Energía: ${agent.value.energy}`)
      break
    case 'THREAT':
      agent.value.health = Math.max(0, agent.value.health - 15)
      addBehaviorLog('warning', `¡Daño recibido! Salud: ${agent.value.health}`)
      break
  }
}

const updateAgentState = () => {
  if (agent.value.health <= 0) {
    agent.value.state = 'dead'
    isRunning.value = false
    addBehaviorLog('error', 'El agente ha sido eliminado')
  } else if (agent.value.energy <= 20) {
    if (agent.value.state !== 'seeking_food') {
      addBehaviorLog('warning', 'Energía baja - buscando comida')
    }
  }
}

const updateEnvironment = () => {
  // Add random food occasionally
  if (Math.random() < 0.005 && environment.value.objects.filter(o => o.type === 'FOOD').length < 3) {
    addRandomFood()
  }
}

const draw = () => {
  if (!ctx) return

  // Clear canvas
  ctx.fillStyle = '#E3F2FD'
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)

  // Draw grid
  drawGrid()

  // Draw agent's view range
  if (agent.value.state !== 'dead') {
    drawViewRange()
  }

  // Draw objects
  environment.value.objects.forEach(obj => {
    drawObject(obj)
  })

  // Draw agent
  drawAgent()
}

const drawGrid = () => {
  ctx.strokeStyle = '#E0E0E0'
  ctx.lineWidth = 1
  
  for (let x = 0; x <= canvasWidth.value; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasHeight.value)
    ctx.stroke()
  }
  
  for (let y = 0; y <= canvasHeight.value; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvasWidth.value, y)
    ctx.stroke()
  }
}

const drawViewRange = () => {
  ctx.beginPath()
  ctx.arc(agent.value.x, agent.value.y, agent.value.viewRange, 0, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.stroke()
  ctx.setLineDash([])
}

const drawObject = (obj) => {
  const type = OBJECT_TYPES[obj.type]
  ctx.fillStyle = type.color
  ctx.beginPath()
  
  if (obj.type === 'OBSTACLE') {
    ctx.fillRect(obj.x - obj.size/2, obj.y - obj.size/2, obj.size, obj.size)
  } else {
    ctx.arc(obj.x, obj.y, obj.size, 0, 2 * Math.PI)
    ctx.fill()
  }
}

const drawAgent = () => {
  if (agent.value.state === 'dead') {
    ctx.fillStyle = '#666666'
  } else {
    ctx.fillStyle = getAgentColor()
  }

  // Draw agent body
  ctx.beginPath()
  ctx.arc(agent.value.x, agent.value.y, agent.value.size, 0, 2 * Math.PI)
  ctx.fill()

  // Draw direction indicator
  if (agent.value.state !== 'dead') {
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(agent.value.x, agent.value.y)
    ctx.lineTo(
      agent.value.x + Math.cos(agent.value.direction) * agent.value.size,
      agent.value.y + Math.sin(agent.value.direction) * agent.value.size
    )
    ctx.stroke()
  }

  // Draw state indicator
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(agent.value.state, agent.value.x, agent.value.y + agent.value.size + 15)
}

const getAgentColor = () => {
  switch (agent.value.state) {
    case 'seeking_food': return '#4CAF50'
    case 'fleeing': return '#F44336'
    case 'avoiding': return '#FF9800'
    default: return '#2196F3'
  }
}

// Event handlers
const handleCanvasClick = (event) => {
  const rect = simulationCanvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Cycle through object types on click
  const types = ['FOOD', 'THREAT', 'OBSTACLE']
  const randomType = types[Math.floor(Math.random() * types.length)]
  
  addObjectAt(x, y, randomType)
}

const addObjectAt = (x, y, type) => {
  const objectType = OBJECT_TYPES[type]
  environment.value.objects.push({
    x,
    y,
    type,
    size: objectType.size,
    id: Date.now()
  })
}

const addObstacle = () => {
  addRandomObject('OBSTACLE')
}

const addFood = () => {
  addRandomObject('FOOD')
}

const addThreat = () => {
  addRandomObject('THREAT')
}

const addRandomObject = (type) => {
  const margin = 50
  const x = margin + Math.random() * (canvasWidth.value - 2 * margin)
  const y = margin + Math.random() * (canvasHeight.value - 2 * margin)
  addObjectAt(x, y, type)
}

const addRandomFood = () => {
  addRandomObject('FOOD')
}

const clearEnvironment = () => {
  environment.value.objects = []
  addBehaviorLog('info', 'Entorno limpiado')
}

const resetSimulation = () => {
  isRunning.value = false
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  
  // Reset agent
  agent.value = {
    x: 300,
    y: 200,
    energy: 100,
    health: 100,
    state: 'exploring',
    direction: 0,
    speed: 2,
    size: 15,
    foodCollected: 0,
    viewRange: 80
  }
  
  simulationTime.value = 0
  clearEnvironment()
  clearLog()
  addBehaviorLog('info', 'Simulación reiniciada')
}

const addBehaviorLog = (type, message) => {
  behaviorLog.value.push({
    time: simulationTime.value,
    type,
    message,
    timestamp: Date.now()
  })
  
  // Keep only last 50 logs
  if (behaviorLog.value.length > 50) {
    behaviorLog.value = behaviorLog.value.slice(-50)
  }
}

const clearLog = () => {
  behaviorLog.value = []
}

const formatTime = (time) => {
  const seconds = Math.floor(time / 1000)
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}

const getLogColor = (type) => {
  switch (type) {
    case 'success': return 'success'
    case 'warning': return 'warning'
    case 'error': return 'error'
    default: return 'info'
  }
}

const getLogIcon = (type) => {
  switch (type) {
    case 'success': return 'mdi-check-circle'
    case 'warning': return 'mdi-alert'
    case 'error': return 'mdi-alert-circle'
    default: return 'mdi-information'
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  initCanvas()
  
  // Add some initial objects
  addRandomObject('FOOD')
  addRandomObject('FOOD')
  addRandomObject('OBSTACLE')
  
  addBehaviorLog('info', 'Simulador cargado y listo')
  
  // Start drawing
  draw()
  
  // Handle window resize
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.simulation-container {
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.simulation-canvas {
  display: block;
  cursor: crosshair;
  background: #f5f5f5;
}

.canvas-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  pointer-events: none;
}

.stat-item {
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-entry {
  display: flex;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-success {
  background-color: rgba(76, 175, 80, 0.1);
}

.log-warning {
  background-color: rgba(255, 152, 0, 0.1);
}

.log-error {
  background-color: rgba(244, 67, 54, 0.1);
}

@media (max-width: 768px) {
  .simulation-canvas {
    width: 100%;
    height: 300px;
  }
}
</style>