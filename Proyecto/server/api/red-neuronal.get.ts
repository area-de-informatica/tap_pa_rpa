export default defineEventHandler((event) => {
  const redNeuronal = [
    {
      id: 1,
      culture: "¿Qué es una red neuronal artificial?",
      answers: [
        {
          a: "Un conjunto de reglas matemáticas simples",
          b: "Una técnica para almacenar imágenes",
          c: "Un modelo computacional inspirado en el cerebro humano",
        },
      ],
    },
    {
      id: 2,
      culture: "¿Cuál es el propósito de la función de activación en una red neuronal?",
      answers: [
        {
          a: "Hacer que la red sea más rápida",
          b: "Agregar no linealidad al modelo",
          c: "Ordenar los datos de entrada",
        },
      ],
    },
    {
      id: 3,
      culture: "¿Qué es el algoritmo de retropropagación (backpropagation)?",
      answers: [
        {
          a: "Un sistema de almacenamiento de datos",
          b: "Una técnica para ajustar los pesos durante el entrenamiento",
          c: "Una capa especial en redes neuronales recurrentes",
        },
      ],
    },
  ]

  return redNeuronal
})
