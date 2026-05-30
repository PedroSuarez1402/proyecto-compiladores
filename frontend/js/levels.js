export const levels = [
  {
    id: 1,
    titulo: "Nivel 1: La Masa del Pan",
    instrucciones:
      "Transcribe el paso al DSL (usa MAYÚSCULAS en palabras clave y termina cada instrucción con ';').\n\n" +
      "Para el pan necesitas:\n" +
      "- Agregar 500 gr de harina\n" +
      "- Agregar 250 ml de agua\n" +
      "- Agregar 1 huevo\n" +
      "- Agregar 10 gr de sal\n\n" +
      "Tip: Para ingredientes por unidad puedes escribir: AGREGAR 1 huevo;",
    ingredientes_requeridos: ["harina", "agua", "huevo", "sal"],
    orden_requerido: ["harina", "agua", "huevo", "sal"],
    plato_objetivo: {
      harina: { cantidad: 500, unidad: "gr" },
      agua: { cantidad: 250, unidad: "ml" },
      huevo: { cantidad: 1, unidad: "u" },
      sal: { cantidad: 10, unidad: "gr" },
    },
  },
  {
    id: 2,
    titulo: "Nivel 2: La Carne",
    instrucciones:
      "Transcribe el paso al DSL.\n\n" +
      "Para la carne necesitas:\n" +
      "- Agregar 200 gr de carne_molida\n" +
      "- Agregar 1 pizca de sal\n" +
      "- Agregar 1 pizca de pimienta\n",
    ingredientes_requeridos: ["carne_molida", "sal", "pimienta"],
    orden_requerido: ["carne_molida", "sal", "pimienta"],
    plato_objetivo: {
      carne_molida: { cantidad: 200, unidad: "gr" },
      sal: { cantidad: 1, unidad: "pizca" },
      pimienta: { cantidad: 1, unidad: "pizca" },
    },
  },
  {
    id: 3,
    titulo: "Nivel 3: La Salsa",
    instrucciones:
      "Transcribe el paso al DSL.\n\n" +
      "Para la salsa necesitas:\n" +
      "- Agregar 50 ml de mayonesa\n" +
      "- Agregar 30 ml de ketchup\n" +
      "- Agregar 10 ml de mostaza\n",
    ingredientes_requeridos: ["mayonesa", "ketchup", "mostaza"],
    orden_requerido: ["mayonesa", "ketchup", "mostaza"],
    plato_objetivo: {
      mayonesa: { cantidad: 50, unidad: "ml" },
      ketchup: { cantidad: 30, unidad: "ml" },
      mostaza: { cantidad: 10, unidad: "ml" },
    },
  },
  {
    id: 4,
    titulo: "Nivel 4: Armado de la Hamburguesa",
    instrucciones:
      "Transcribe el paso al DSL.\n\n" +
      "Para el armado necesitas:\n" +
      "- Agregar 1 pan\n" +
      "- Agregar 150 gr de carne_molida\n" +
      "- Agregar 40 gr de queso_derretido\n" +
      "- Agregar 30 gr de tocineta\n" +
      "- Agregar 15 ml de mayonesa\n",
    ingredientes_requeridos: ["pan", "carne_molida", "queso_derretido", "tocineta", "mayonesa"],
    orden_requerido: ["pan", "carne_molida", "queso_derretido", "tocineta", "mayonesa"],
    plato_objetivo: {
      pan: { cantidad: 1, unidad: "u" },
      carne_molida: { cantidad: 150, unidad: "gr" },
      queso_derretido: { cantidad: 40, unidad: "gr" },
      tocineta: { cantidad: 30, unidad: "gr" },
      mayonesa: { cantidad: 15, unidad: "ml" },
    },
  },
];
