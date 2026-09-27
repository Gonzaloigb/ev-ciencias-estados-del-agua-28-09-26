/**
 * ZONA 2 — ¿Cómo es cada uno?
 *
 * Objetivo del temario: "Describir los tres estados del agua (¿como es el
 * estado liquido, solido y gaseoso?)".
 *
 * Esta zona carga con LA TRAMPA de la unidad, documentada en
 * CONTENIDOS_EXTRAIDOS.md:
 *
 *   El profesor responde "es solida y toma la forma del vaso" para el agua del
 *   congelador. Pero "adaptarse al recipiente" es la propiedad del LIQUIDO.
 *   Son dos frases casi iguales que significan cosas distintas:
 *
 *     hielo   → conserva la forma del molde donde se congelo, y ya no cambia
 *     liquido → se adapta a CUALQUIER recipiente donde lo pongas, siempre
 *
 *   El formato C existe solo para que Marina vea esa diferencia de frente. Si
 *   se quita, el juego deja pasar el error mas probable de la prueba.
 */

import { ESTADOS, estado, GLOSARIO, pistaDeError, AVISOS } from '../datos.js';
import { particulas } from '../agua.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

/* Descripciones sueltas, cada una de un solo estado. */
const DESCRIPCIONES = [
  { texto: 'Es duro y tiene forma permanente', estado: 'solido' },
  { texto: 'Se siente frío y duro', estado: 'solido' },
  { texto: 'Sus partículas están juntas y ordenadas', estado: 'solido' },
  { texto: 'Se adapta a la forma del recipiente', estado: 'liquido' },
  { texto: 'Puede fluir', estado: 'liquido' },
  { texto: 'Se puede tomar y se derrama', estado: 'liquido' },
  { texto: 'Se expande por el aire', estado: 'gaseoso' },
  { texto: 'Es liviano', estado: 'gaseoso' },
  { texto: 'No se puede observar a simple vista', estado: 'gaseoso' },
];

export function jugarDescribir({ zona, onSalir, onFin, modo }) {
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(DESCRIPCIONES);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 3 || i === 7) montarHieloVsLiquido(ctx);
      else if (i % 3 === 2) montarComoEs(ctx);
      else montarDeQuienEs(ctx, sacar());
    },
  });
}

/* ---------- Formato A: esta descripcion, de que estado es ---------- */
function montarDeQuienEs(ctx, d) {
  ctx.pedir({
    instruccion: `"${d.texto}". ¿De qué estado hablamos?`,
    apoyo: d.texto.includes('fluir') ? `Fluir: ${GLOSARIO.fluir}` : '',
  });

  const opciones = el('div', 'opciones tres');
  for (const e of ESTADOS) {
    const btn = el('button', 'opcion solo-texto', e.nombre, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = e.id === d.estado;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children]
          .find((o) => o.textContent === estado(d.estado).nombre)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: `prop-${d.estado}`,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Eso describe al estado ${estado(d.estado).nombre.toLowerCase()}.`,
        pista: pistaDeError(e.id, d.estado) || estado(d.estado).comoEs,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: dado el estado, cual descripcion le corresponde ---------- */
function montarComoEs(ctx) {
  const e = uno(ESTADOS);
  const correcta = uno(DESCRIPCIONES.filter((d) => d.estado === e.id));
  const otras = barajar(DESCRIPCIONES.filter((d) => d.estado !== e.id)).slice(0, 2);
  const cartas = barajar([correcta, ...otras]);

  ctx.pedir({
    instruccion: `¿Cómo es el estado ${e.nombre.toLowerCase()}?`,
    apoyo: '',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = particulas(e.particulas, { color: e.colorOscuro });
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones lista');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto,
      { type: 'button', 'data-estado': c.estado });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = c.estado === e.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children]
          .find((o) => o.textContent === correcta.texto)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: `prop-${e.id}`,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Eso describe al estado ${estado(c.estado).nombre.toLowerCase()}.`,
        pista: pistaDeError(c.estado, e.id) || e.comoEs,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: LA TRAMPA. Hielo en un molde vs liquido en un vaso ----------
   Es la unica pregunta del juego escrita para un error concreto y anticipado.
   Por eso no es generica: la situacion es fija y la pista explica la diferencia
   completa, no solo cual era la correcta.                                      */
function montarHieloVsLiquido(ctx) {
  const esHielo = Math.random() < 0.5;

  const situacion = esHielo
    ? 'Marina puso agua en un vaso y lo dejó en el congelador. Al otro día sacó el ' +
      'hielo del vaso y lo puso sobre un plato.'
    : 'Marina tenía agua en un vaso y la pasó a una jarra, y después a una taza.';

  const pregunta = esHielo
    ? '¿Qué pasó con la forma del hielo al cambiarlo de lugar?'
    : '¿Qué pasó con la forma del agua al cambiarla de lugar?';

  ctx.pedir({ instruccion: `${situacion} ${pregunta}` });

  const cartas = barajar([
    {
      texto: 'Siguió con la forma del vaso, aunque ya no estaba en él',
      bueno: esHielo,
    },
    {
      texto: 'Tomó la forma de cada recipiente nuevo',
      bueno: !esHielo,
    },
  ]);

  const opciones = el('div', 'opciones lista');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(c.bueno ? 'correcta' : 'errada');
      if (!c.bueno) {
        [...opciones.children]
          .find((o) => o.textContent === cartas.find((x) => x.bueno).texto)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto: c.bueno,
        concepto: esHielo ? 'prop-solido' : 'prop-liquido',
        mensajeBien: esHielo
          ? '¡Eso es! El hielo es sólido: su forma ya no cambia. 🎉'
          : '¡Eso es! El líquido se adapta a cada recipiente. 🎉',
        mensajeMal: esHielo ? 'Fíjate: el hielo ya está duro.' : 'Fíjate: el agua puede fluir.',
        // La pista explica LAS DOS, no solo la correcta: el objetivo es que la
        // diferencia quede clara, no que acierte esta pregunta.
        pista: 'El hielo toma la forma del molde donde se congela, pero después ya no ' +
               'cambia: es sólido y tiene forma permanente. El agua líquida, en cambio, ' +
               'se adapta a cualquier recipiente, todas las veces que la cambies.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
