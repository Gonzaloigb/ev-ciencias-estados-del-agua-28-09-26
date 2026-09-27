/**
 * datos.js — el contenido de la unidad, como datos.
 *
 * Es la FUENTE DE VERDAD del juego. Ningun texto de la materia debe escribirse
 * dentro de la logica de un minijuego: se declara aqui y desde aqui se consume.
 * Se refleja de `Ciencias/CONTENIDOS_EXTRAIDOS.md`; si algo cambia alla, cambia
 * aqui.
 *
 * Dos reglas del temario que se ven en este archivo:
 *
 *  1. VERBOS, NO SUSTANTIVOS. El libro de 2 basico dice "se congela", "se
 *     derrite", "se evapora". No dice fusion, solidificacion ni condensacion.
 *     Solo `evaporacion` y `congelamiento` aparecen como sustantivos, porque el
 *     profesor los escribio en el temario.
 *
 *  2. LA ANALOGIA ES LA DEL PROFESOR. El PPT de clase abre con los estados de
 *     animo. Marina ya la escucho; inventar otra la obliga a aprender dos veces.
 */

/* =========================================================================
   1. La analogia con que se enseno — va en la portada
   ========================================================================= */

export const ANALOGIA = {
  pregunta: '¿Qué es un estado de ánimo?',
  respuesta: 'Habla de cómo me siento en un determinado momento.',
  puente: 'El agua también tiene estados, según cómo sea en ese momento.',
};

/* =========================================================================
   2. Los tres estados del agua
   ========================================================================= */

export const ESTADOS = [
  {
    id: 'solido',
    nombre: 'Sólido',
    ejemplo: 'hielo',
    articulo: 'el',
    color: '#7DD3FC',
    colorOscuro: '#0369A1',
    // Del PPT, textual: "Cuando es dura y tiene forma permanente".
    comoEs: 'Es duro y tiene forma permanente.',
    seSiente: 'Se siente frío y duro.',
    particulas: 'juntas',
    ejemplos: ['hielo', 'cubito de hielo', 'glaciar', 'nieve'],
  },
  {
    id: 'liquido',
    nombre: 'Líquido',
    ejemplo: 'agua',
    articulo: 'el',
    color: '#38BDF8',
    colorOscuro: '#075985',
    // Del PPT, textual: "Cuando se adapta a la forma del recipiente y puede fluir".
    comoEs: 'Se adapta a la forma del recipiente y puede fluir.',
    seSiente: 'Se puede tomar y se derrama.',
    particulas: 'sueltas',
    ejemplos: ['agua del vaso', 'agua potable', 'jugo', 'leche', 'río', 'mar'],
  },
  {
    id: 'gaseoso',
    nombre: 'Gaseoso',
    ejemplo: 'vapor',
    articulo: 'el',
    color: '#BAE6FD',
    colorOscuro: '#0C4A6E',
    // Del PPT, textual: "Cuando el agua se puede expandir por el aire".
    comoEs: 'Se expande por el aire y es liviano.',
    seSiente: 'No se puede observar a simple vista.',
    particulas: 'dispersas',
    ejemplos: ['vapor del hervidor', 'vapor de la ducha caliente'],
  },
];

export function estado(id) {
  const e = ESTADOS.find((x) => x.id === id);
  if (!e) throw new Error(`Estado desconocido: ${id}`);
  return e;
}

/** La palabra "fluir" tiene glosario propio en el PPT. */
export const GLOSARIO = {
  fluir: 'Capacidad de modificar su forma para cambiar su posición o ubicación, por sí solo.',
};

/* =========================================================================
   3. Objetos de la vida cotidiana, para clasificar (objetivo 1)
   ========================================================================= */

export const OBJETOS = [
  { id: 'cubito', nombre: 'Un cubito de hielo', estado: 'solido', dibujo: 'cubito' },
  { id: 'glaciar', nombre: 'Un glaciar', estado: 'solido', dibujo: 'glaciar' },
  { id: 'nieve', nombre: 'La nieve', estado: 'solido', dibujo: 'nieve' },
  { id: 'vaso', nombre: 'El agua de un vaso', estado: 'liquido', dibujo: 'vaso' },
  { id: 'rio', nombre: 'El agua de un río', estado: 'liquido', dibujo: 'rio' },
  { id: 'lluvia', nombre: 'La lluvia', estado: 'liquido', dibujo: 'lluvia' },
  { id: 'vapor-hervidor', nombre: 'El vapor del hervidor', estado: 'gaseoso', dibujo: 'hervidor' },
  { id: 'vapor-ducha', nombre: 'El vapor de la ducha caliente', estado: 'gaseoso', dibujo: 'ducha' },
];

/* =========================================================================
   4. Cambios de estado (objetivo 5)

   El temario nombra DOS: evaporacion y congelamiento. "Derretirse" aparece en
   el libro y en el PPT pero sin nombre tecnico, asi que se usa el verbo.
   ========================================================================= */

export const CAMBIOS = [
  {
    id: 'cambio-congelar',
    situacion: 'Pones agua en el congelador',
    verbo: 'Se congela',
    resultado: 'El agua se transforma en hielo.',
    de: 'liquido',
    a: 'solido',
    temperatura: 'muy baja',
    nombre: 'congelamiento',   // el profesor SI lo nombra
    dibujo: 'congelador',
  },
  {
    id: 'cambio-evaporar',
    situacion: 'Hierves agua en el hervidor',
    verbo: 'Se evapora',
    resultado: 'El agua se transforma en vapor.',
    de: 'liquido',
    a: 'gaseoso',
    temperatura: 'alta',
    nombre: 'evaporación',     // el profesor SI lo nombra
    dibujo: 'hervidor',
  },
  {
    id: 'cambio-derretir',
    situacion: 'Sostienes un cubito de hielo en la mano',
    verbo: 'Se derrite',
    resultado: 'El hielo vuelve a ser agua líquida.',
    de: 'solido',
    a: 'liquido',
    temperatura: 'alta',
    nombre: null,              // el libro NO le pone nombre tecnico
    dibujo: 'mano-hielo',
  },
  {
    id: 'sin-cambio',
    situacion: 'Dejas un vaso con agua sobre la mesa',
    verbo: 'Sigue igual',
    resultado: 'Con temperatura media, el agua se mantiene líquida.',
    de: 'liquido',
    a: 'liquido',
    temperatura: 'media',
    nombre: null,
    dibujo: 'vaso',
  },
];

export function cambio(id) {
  const c = CAMBIOS.find((x) => x.id === id);
  if (!c) throw new Error(`Cambio desconocido: ${id}`);
  return c;
}

/** Del cuestionario del profesor: el unico numero de la unidad. */
export const PUNTO_EBULLICION = '100°';

/* =========================================================================
   5. Propiedades del agua (paginas 114-117)
   ========================================================================= */

export const PROPIEDADES = [
  {
    id: 'incolora',
    palabra: 'Incolora',
    significa: 'No tiene color, es transparente.',
    sentido: 'la vista',
    // Ejercicio literal de la p.116.
    pruebaLibro: '¿Por qué el niño puede ver bajo el agua?',
    seRompeCon: 'colorante o jugo en polvo',
  },
  {
    id: 'inodora',
    palabra: 'Inodora',
    significa: 'No tiene olor.',
    sentido: 'el olfato',
    pruebaLibro: '¿Qué le agregarías al agua para que deje de ser inodora?',
    seRompeCon: 'chocolate en polvo',   // p.116: no azucar, no harina
  },
  {
    id: 'insipida',
    palabra: 'Insípida',
    significa: 'No tiene sabor.',
    sentido: 'el gusto',
    pruebaLibro: '¿Qué le agregarías al agua para que deje de ser insípida?',
    seRompeCon: 'azúcar',
  },
];

export function propiedad(id) {
  const p = PROPIEDADES.find((x) => x.id === id);
  if (!p) throw new Error(`Propiedad desconocida: ${id}`);
  return p;
}

export const AGUA_POTABLE =
  'Es la que tomamos habitualmente, porque está libre de contaminación y de gérmenes ' +
  'que pueden dañar nuestra salud.';

/** Tabla de la p.117: comparar tres liquidos. */
export const LIQUIDOS_TABLA = [
  { nombre: 'Agua',  color: false, olor: false, sabor: false },
  { nombre: 'Jugo',  color: true,  olor: true,  sabor: true  },
  { nombre: 'Leche', color: true,  olor: true,  sabor: true  },
];

/* =========================================================================
   6. Cuidar el agua (objetivos 3 y 4)
   ========================================================================= */

/**
 * El libro NO trae una lista de formas de cuidar el agua: el objetivo dice
 * "proponer", asi que el juego las ofrece. Vienen del sentido comun.
 *
 * PENDIENTE: si el cuaderno de Marina trae la lista que trabajo el profesor,
 * esa manda sobre esta.
 */
export const CUIDADOS = [
  { id: 'llave', texto: 'Cerrar la llave mientras me lavo los dientes', cuida: true },
  { id: 'ducha', texto: 'Ducharme rápido, sin quedarme jugando', cuida: true },
  { id: 'regar', texto: 'Regar las plantas temprano o al atardecer', cuida: true },
  { id: 'basura', texto: 'No botar basura en los ríos ni en el mar', cuida: true },
  { id: 'gotera', texto: 'Avisar cuando una llave queda goteando', cuida: true },
  { id: 'reutilizar', texto: 'Reutilizar el agua con que lavo las verduras', cuida: true },
  { id: 'llave-abierta', texto: 'Dejar la llave abierta mientras juego', cuida: false },
  { id: 'manguera', texto: 'Lavar el auto con la manguera corriendo', cuida: false },
  { id: 'tirar', texto: 'Botar papeles y plásticos al río', cuida: false },
  { id: 'banera', texto: 'Llenar la tina hasta el borde todos los días', cuida: false },
];

export const POR_QUE_CUIDAR = [
  {
    id: 'glaciar-san-rafael',
    titulo: 'El glaciar San Rafael',
    texto: 'Algunos glaciares de Chile, como el de la laguna San Rafael, se están ' +
           'derritiendo por el aumento de la temperatura en nuestro planeta.',
    causa: 'el calentamiento global',
    dibujo: 'glaciar',
  },
  {
    id: 'sistema-toha',
    titulo: 'El sistema Tohá',
    texto: 'El médico chileno José Tohá creó un sistema para limpiar el agua sucia ' +
           'usando lombrices, que se alimentan de los desechos.',
    causa: 'una invención chilena para purificar agua',
    dibujo: 'lombriz',
  },
];

/* =========================================================================
   7. Pistas de error — lo que convierte un fallo en aprendizaje
   ========================================================================= */

/**
 * Devuelve la regla que explica un error concreto, o null si no hay nada util
 * que decir.
 *
 * La leccion viene del juego de ingles: la pista DEBE verificar que el error
 * es el que cree. Explicar la regla equivocada confunde mas que no explicar.
 *
 * @param {string} respondio  id de lo que marco
 * @param {string} esperaba   id de lo correcto
 */
export function pistaDeError(respondio, esperaba) {
  // --- La confusion mas probable de toda la unidad ---
  // El profesor dice "toma la forma del vaso" para el HIELO (conserva la forma
  // del molde). Es casi igual a la propiedad del liquido (se adapta al
  // recipiente). Si se mezclan, el juego ensena algo incorrecto.
  if (esperaba === 'solido' && respondio === 'liquido') {
    return 'El hielo es sólido: tiene forma permanente. Es cierto que toma la forma ' +
           'del molde donde se congeló, pero después ya no cambia. El líquido, en ' +
           'cambio, se adapta a cualquier recipiente donde lo pongas.';
  }
  if (esperaba === 'liquido' && respondio === 'solido') {
    return 'El líquido se adapta a la forma del recipiente y puede fluir. El sólido ' +
           'es duro y tiene forma permanente.';
  }

  // --- El vapor no se ve ---
  if (esperaba === 'gaseoso') {
    return 'Es estado gaseoso: el agua se expande por el aire y es liviana. Ojo, el ' +
           'vapor de agua no se puede observar a simple vista.';
  }

  // --- Los dos cambios del temario, invertidos ---
  if (esperaba === 'cambio-congelar' && respondio === 'cambio-evaporar') {
    return 'Congelar es con FRÍO: el agua se transforma en hielo. Evaporar es con ' +
           'CALOR: el agua se transforma en vapor.';
  }
  if (esperaba === 'cambio-evaporar' && respondio === 'cambio-congelar') {
    return 'Evaporar es con CALOR: el agua se transforma en vapor. Congelar es con ' +
           'FRÍO: el agua se transforma en hielo.';
  }

  // --- Derretir vs evaporar: ambos "con calor" ---
  if (esperaba === 'cambio-derretir' && respondio === 'cambio-evaporar') {
    return 'Los dos pasan con calor, pero no son lo mismo: derretirse es de sólido a ' +
           'líquido (el hielo vuelve a ser agua). Evaporarse es de líquido a gas.';
  }
  if (esperaba === 'cambio-evaporar' && respondio === 'cambio-derretir') {
    return 'Evaporarse es de líquido a gas (el agua se hace vapor). Derretirse es de ' +
           'sólido a líquido (el hielo se hace agua).';
  }

  // --- Las tres palabras que empiezan casi igual ---
  const props = ['incolora', 'inodora', 'insipida'];
  if (props.includes(esperaba) && props.includes(respondio)) {
    return 'Ojo con las tres: inCOLORa es sin COLOR, inODORa es sin OLOR, ' +
           'inSÍPIDa es sin SABOR.';
  }

  return null;
}

/* =========================================================================
   8. Las zonas del mapa
   ========================================================================= */

export const ZONAS = [
  {
    id: 'estados',
    n: 1,
    titulo: 'Los tres estados',
    subtitulo: 'Sólido, líquido y gaseoso en la vida diaria',
    icono: '💧',
    momento: 'hielo',
  },
  {
    id: 'describir',
    n: 2,
    titulo: '¿Cómo es cada uno?',
    subtitulo: 'Duro, fluye, se expande',
    icono: '🔍',
    momento: 'liquido',
  },
  {
    id: 'cambios',
    n: 3,
    titulo: 'Frío y calor',
    subtitulo: 'Se congela, se derrite, se evapora',
    icono: '🌡️',
    momento: 'vapor',
  },
  {
    id: 'propiedades',
    n: 4,
    titulo: 'Incolora, inodora, insípida',
    subtitulo: 'Cómo es el agua que tomamos',
    icono: '🥛',
    momento: 'claro',
  },
  {
    id: 'cuidar',
    n: 5,
    titulo: 'Cuidemos el agua',
    subtitulo: 'Por qué importa y cómo se hace',
    icono: '🌍',
    momento: 'tierra',
  },
  {
    id: 'simulacro',
    n: 6,
    titulo: 'Ensayo de la prueba',
    subtitulo: 'Todo mezclado, sin ayudas',
    icono: '📝',
    momento: 'prueba',
  },
];

export function zona(id) {
  const z = ZONAS.find((x) => x.id === id);
  if (!z) throw new Error(`Zona desconocida: ${id}`);
  return z;
}

/* =========================================================================
   9. Avisos
   ========================================================================= */

export const AVISOS = {
  bien: ['¡Muy bien! 🎉', '¡Correcto! 💧', '¡Eso es! ⭐', '¡Perfecto! 🌊'],
  mal: ['Casi… 💪', 'No es esa 🤔', 'Vuelve a mirar 👀'],
};
