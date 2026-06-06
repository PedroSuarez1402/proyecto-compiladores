export const levels = [
  {
    id: 1,
    titulo: "Nivel 1: La Masa del Pan",
    instrucciones:
      "Transcribe el paso al DSL.\n\nPara la masa del pan necesitas:\n- Agregar 500 gr de harina\n- Agregar 200 ml de agua\n- Agregar 1 huevo\n\nTip: recuerda el punto y coma al final de cada instrucción.",
    ingredientes_requeridos: ["harina", "agua", "huevo"],
    plato_objetivo: {
      harina: { cantidad: 500, unidad: "gr" },
      agua: { cantidad: 200, unidad: "ml" },
      huevo: { cantidad: 1, unidad: "u" },
    },
    orden_requerido: ["harina", "agua", "huevo"],
  },
  {
    id: 2,
    titulo: "Nivel 2: La Carne",
    instrucciones:
      "Transcribe el paso al DSL.\n\nPara la carne necesitas:\n- Agregar 200 gr de carne_molida\n- Agregar 1 pizca de sal\n- Agregar 1 pizca de pimienta",
    ingredientes_requeridos: ["carne_molida", "sal", "pimienta"],
    plato_objetivo: {
      carne_molida: { cantidad: 200, unidad: "gr" },
      sal: { cantidad: 1, unidad: "pizca" },
      pimienta: { cantidad: 1, unidad: "pizca" },
    },
    orden_requerido: ["carne_molida", "sal", "pimienta"],
  },
  {
    id: 3,
    titulo: "Nivel 3: La Salsa",
    instrucciones:
      "Transcribe el paso al DSL.\n\nPara la salsa necesitas:\n- Agregar 30 ml de mayonesa\n- Agregar 20 ml de ketchup\n- Agregar 10 ml de mostaza",
    ingredientes_requeridos: ["mayonesa", "ketchup", "mostaza"],
    plato_objetivo: {
      mayonesa: { cantidad: 30, unidad: "ml" },
      ketchup: { cantidad: 20, unidad: "ml" },
      mostaza: { cantidad: 10, unidad: "ml" },
    },
    orden_requerido: ["mayonesa", "ketchup", "mostaza"],
  },
  {
    id: 4,
    titulo: "Nivel 4: Armado de la Hamburguesa",
    instrucciones:
      "Transcribe el paso al DSL.\n\nArma la hamburguesa en orden:\n- Agregar 2 pan\n- Agregar 200 gr de carne_molida\n- Agregar 50 gr de queso_derretido\n- Agregar 30 gr de tocineta\n- Agregar 10 ml de mayonesa\n- Agregar 10 ml de ketchup\n- Agregar 10 ml de mostaza",
    ingredientes_requeridos: [
      "pan",
      "carne_molida",
      "queso_derretido",
      "tocineta",
      "mayonesa",
      "ketchup",
      "mostaza",
    ],
    plato_objetivo: {
      pan: { cantidad: 2, unidad: "u" },
      carne_molida: { cantidad: 200, unidad: "gr" },
      queso_derretido: { cantidad: 50, unidad: "gr" },
      tocineta: { cantidad: 30, unidad: "gr" },
      mayonesa: { cantidad: 10, unidad: "ml" },
      ketchup: { cantidad: 10, unidad: "ml" },
      mostaza: { cantidad: 10, unidad: "ml" },
    },
    orden_requerido: [
      "pan",
      "carne_molida",
      "queso_derretido",
      "tocineta",
      "mayonesa",
      "ketchup",
      "mostaza",
    ],
  },
];

