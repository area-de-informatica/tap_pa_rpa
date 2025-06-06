export default defineEventHandler((event) => {
  const questions = [
    {
      id: 1,
      question: "¿Qué es un agente inteligente en inteligencia artificial?",
      answers: [
        { d:"Recibe su entorno y toma decisiones para alcanzar objetivos",
          c: "Un robot que solo repite órdenes sin aprender",
          a: "Un programa que actúa aleatoriamente",
          b: "Un sistema que pe"
        },
      ],
    },
    {
      id: 2,
      question: "¿Cuál de los siguientes es un ejemplo de agente inteligente?",
      answers: [
        {
          a: "Un ventilador eléctrico",
          b: "Un sistema de navegación GPS que adapta rutas en tiempo real",
          c: "Una calculadora básica",
        },
      ],
    },
    {
      id: 3,
      question: "¿Qué componentes básicos tiene un agente inteligente?",
      answers: [
        {
          a: "Sensor y actuador solamente",
          b: "Interfaz gráfica y teclado",
          c: "Sensores, actuadores, entorno, y una función de agente",
        },
      ],
    },
    {
      id: 4,
      question: "¿Qué tipo de agente aprende de su entorno?",
      answers: [
        {
          a: "Agente reactivo simple",
          b: "Agente basado en objetivos",
          c: "Agente basado en aprendizaje",
        },
      ],
    },
  ];

  return questions;
});
