/**
 * motor.js — el esqueleto que comparten los seis minijuegos.
 *
 * Cada zona solo define COMO se ve una pregunta y QUE es correcto.
 * El conteo de aciertos, la barra de progreso, el audio, los avisos, las vidas
 * y la pantalla final viven aqui, una sola vez.
 *
 * Adaptado del motor del juego de matematica. Dos diferencias:
 *  - El flag `sinPistas` se reemplazo por un MODO explicito que elige quien juega.
 *  - Modo dificil: tres vidas por zona. Al perderlas, la zona vuelve a empezar.
 */

import { el, esperar, estrellasPorPuntaje, confeti, pintarEstrellas } from './util.js';
import { sonarBien, sonarMal, sonarVictoria, sonarEstrella } from './audio.js';
import { guardarEstrellas, registrar } from './estado.js';
import { MODOS, modo as modoDe } from './modos.js';

/**
 * Arranca una zona.
 *
 * @param {object} cfg
 *  - zona:        objeto de ZONAS
 *  - total:       cuantas preguntas
 *  - montar(ctx): dibuja UNA pregunta. Recibe el contexto y el indice.
 *  - onSalir():   volver al mapa
 *  - onFin(r):    al terminar
 *  - modo:        'normal' | 'dificil'  (por defecto, el guardado)
 *  - forzarDuro:  el simulacro mide siempre, aunque se juegue en normal
 */
export function correrZona(cfg) {
  const raiz = document.getElementById('app');
  const { zona, total, montar, onSalir, onFin, forzarDuro = false } = cfg;

  const m = modoDe(cfg.modo);
  // El simulacro no da pistas ni apoyo aunque se juegue en modo normal: ahi la
  // idea es medir, no ensenar. Pero tampoco quita vidas — perder el simulacro
  // a la tercera no ayuda a nadie.
  const ayuda = forzarDuro ? false : m.ayuda;

  let indice = 0;
  let aciertos = 0;
  let vidas = m.vidas;
  const fallos = [];

  /* ---------- Estructura de la pantalla ---------- */
  const pantalla = el('div', `pantalla cielo-${zona.momento}`);

  const barra = el('div', 'barra');
  const btnVolver = el('button', 'btn-volver', '⬅ Volver', { type: 'button' });
  const titulo = el('h2', 'titulo-zona', `${zona.icono} ${zona.titulo}`);
  const contador = el('div', 'contador');
  const progreso = el('div', 'progreso', '<i></i>');
  const marcaVidas = el('div', 'vidas');
  barra.append(btnVolver, titulo, progreso, contador);
  if (m.vidas > 0) barra.append(marcaVidas);

  const tablero = el('div', 'tablero');
  const consigna = el('div', 'consigna');
  const zonaJuego = el('div', 'zona-juego');
  const aviso = el('div', 'aviso');
  tablero.append(consigna, zonaJuego, aviso);

  pantalla.append(barra, tablero);
  raiz.replaceChildren(pantalla);

  btnVolver.addEventListener('click', onSalir);

  function pintarVidas() {
    if (m.vidas <= 0) return;
    marcaVidas.textContent = '❤️'.repeat(Math.max(0, vidas));
  }

  /* ---------- Contexto que recibe cada minijuego ---------- */
  const ctx = {
    consigna,
    zonaJuego,
    modo: m.id,
    // Las zonas preguntan esto para decidir cuantas alternativas ofrecer.
    ayuda,
    opciones: m.opciones,

    /**
     * Arma la consigna.
     * @param {object} p
     *  - instruccion: que tiene que hacer
     *  - apoyo:       recordatorio de la definicion (opcional)
     */
    pedir({ instruccion, apoyo = '' }) {
      consigna.replaceChildren();
      consigna.append(el('p', 'instruccion', instruccion));
      if (apoyo && ayuda) consigna.append(el('p', 'apoyo', apoyo));
    },

    /** Marca la respuesta y pasa a la siguiente pregunta. */
    async responder({ acerto, concepto, mensajeBien, mensajeMal, pista }) {
      if (concepto) registrar(concepto, acerto);

      if (acerto) {
        aciertos += 1;
        sonarBien();
        aviso.className = 'aviso bien';
        aviso.textContent = mensajeBien || '¡Muy bien! 🎉';
      } else {
        fallos.push(concepto);
        sonarMal();
        vidas -= 1;
        pintarVidas();
        aviso.className = 'aviso mal';
        aviso.replaceChildren(document.createTextNode(mensajeMal || 'Casi… 💪'));
        // La pista es lo que convierte el error en aprendizaje. En modo dificil
        // y en el simulacro se calla, porque ahi la idea es medir.
        if (pista && ayuda) aviso.append(el('span', 'pista', pista));

        // En celular el aviso nace al pie y puede quedar bajo la linea de
        // flotacion: una pista que no se ve no ensena nada. Se trae a la vista.
        if (aviso.getBoundingClientRect().bottom > window.innerHeight) {
          aviso.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
      }

      // Un error necesita mas tiempo en pantalla: hay que alcanzar a leer la razon.
      await esperar(acerto ? 1100 : (ayuda ? 2900 : 1100));
      aviso.className = 'aviso';
      aviso.replaceChildren();

      // Modo dificil: sin vidas, la zona vuelve a empezar.
      if (m.vidas > 0 && vidas <= 0) return sinVidas();

      indice += 1;
      siguiente();
    },
  };

  /* ---------- Ciclo de preguntas ---------- */
  function pintarBarra() {
    contador.textContent = `${indice + 1} / ${total}`;
    progreso.querySelector('i').style.width = `${(indice / total) * 100}%`;
    pintarVidas();
  }

  function siguiente() {
    if (indice >= total) return terminar();
    pintarBarra();
    zonaJuego.replaceChildren();
    montar(ctx, indice);
  }

  /** Reinicia el estado de la partida sin reconstruir el DOM. */
  function reiniciar() {
    indice = 0;
    aciertos = 0;
    vidas = m.vidas;
    fallos.length = 0;
    raiz.replaceChildren(pantalla);
    tablero.replaceChildren(consigna, zonaJuego, aviso);
    siguiente();
  }

  /** Modo dificil: se acabaron las vidas. */
  function sinVidas() {
    sonarMal();
    const panel = el('div', 'fiesta');
    panel.append(
      el('h2', '', 'Se acabaron las vidas 💔'),
      el('div', 'puntaje', `Llegaste a la pregunta ${indice + 1} de ${total}`),
      el('div', 'panel',
        '<h3>No pasa nada</h3><p>En modo difícil no hay pistas y cada error cuesta ' +
        'una vida. Puedes intentarlo otra vez o cambiar a modo normal desde el mapa.</p>'),
    );

    const botones = el('div', 'fila-botones');
    const otra = el('button', 'btn-chico destacado', '🔁 Intentar de nuevo', { type: 'button' });
    const volver = el('button', 'btn-chico', '🗺️ Volver al mapa', { type: 'button' });
    otra.addEventListener('click', reiniciar);
    volver.addEventListener('click', () => onFin({ aciertos, total, estrellas: 0, perdio: true }));
    botones.append(otra, volver);
    panel.append(botones);

    tablero.replaceChildren(panel);
  }

  async function terminar() {
    progreso.querySelector('i').style.width = '100%';
    contador.textContent = `${total} / ${total}`;

    const estrellas = estrellasPorPuntaje(aciertos, total);
    guardarEstrellas(zona.id, estrellas);

    const fiesta = el('div', 'fiesta');
    const bien = aciertos >= total * 0.7;
    fiesta.append(
      el('h2', '', bien ? '¡Excelente, Marina! 🎉' : '¡Buen intento! 💪'),
      el('div', 'estrellas-grandes',
        [0, 1, 2].map((i) => `<span>${i < estrellas ? '⭐' : '☆'}</span>`).join('')),
      el('div', 'puntaje', `${aciertos} de ${total} correctas`),
    );

    if (m.vidas > 0 && bien) {
      fiesta.append(el('div', 'sello-duro', '🔥 En modo difícil'));
    }

    if (fallos.filter(Boolean).length) {
      const unicos = [...new Set(fallos.filter(Boolean))];
      fiesta.append(el('div', 'panel',
        `<h3>Para repasar</h3><p>${unicos.map(legible).join(' · ')}</p>`));
    }

    const botones = el('div', 'fila-botones');
    const otra = el('button', 'btn-chico destacado', '🔁 Jugar de nuevo', { type: 'button' });
    const volver = el('button', 'btn-chico', '🗺️ Volver al mapa', { type: 'button' });
    otra.addEventListener('click', reiniciar);
    volver.addEventListener('click', () => onFin({ aciertos, total, estrellas }));
    botones.append(otra, volver);
    fiesta.append(botones);

    tablero.replaceChildren(fiesta);

    if (bien) {
      sonarVictoria();
      confeti(70);
      for (let i = 0; i < estrellas; i++) {
        await esperar(220);
        sonarEstrella();
      }
    }
  }

  siguiente();
}

/**
 * Nombre legible de un concepto, para el informe y el "para repasar".
 *
 * Los conceptos se guardan como identificadores sin tildes (`cambio-evaporar`)
 * porque son claves de localStorage. Aqui se traducen a como se dicen.
 */
const NOMBRES = {
  solido: 'estado sólido',
  liquido: 'estado líquido',
  gaseoso: 'estado gaseoso',
  'prop-solido': 'cómo es el sólido',
  'prop-liquido': 'cómo es el líquido',
  'prop-gaseoso': 'cómo es el gaseoso',
  'cambio-congelar': 'congelamiento',
  'cambio-evaporar': 'evaporación',
  'cambio-derretir': 'cuándo se derrite',
  'sin-cambio': 'cuando el agua sigue igual',
  incolora: 'incolora (sin color)',
  inodora: 'inodora (sin olor)',
  insipida: 'insípida (sin sabor)',
  'agua-potable': 'agua potable',
  'cuidar-agua': 'formas de cuidar el agua',
  'glaciar-san-rafael': 'el glaciar San Rafael',
  'sistema-toha': 'el sistema Tohá',
};

export function legible(concepto) {
  return NOMBRES[concepto] || String(concepto).replace(/-/g, ' ');
}

/** Pinta las estrellas — reexportado para que las zonas no importen util. */
export { pintarEstrellas, MODOS };
