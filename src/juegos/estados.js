/**
 * ZONA 1 — Los tres estados
 *
 * Objetivo del temario: "Identificar los estados del agua en la vida cotidiana
 * (solido, liquido y gaseoso)".
 *
 * Tres formatos que se alternan:
 *   A. Un objeto de la vida diaria → en que estado esta.
 *   B. Las particulas → que estado representan. (Sin palabras: es la idea
 *      visual que hace la diferencia concreta.)
 *   C. Al reves: dado un estado, cual de estos objetos lo es.
 */

import { OBJETOS, ESTADOS, estado, pistaDeError, AVISOS } from '../datos.js';
import { dibujo, particulas } from '../agua.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

export function jugarEstados({ zona, onSalir, onFin, modo }) {
  // Una bolsa barajada: que salgan todos los objetos antes de repetirse.
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(OBJETOS);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i % 3 === 1) montarParticulas(ctx);
      else if (i % 3 === 2) montarAlReves(ctx);
      else montarQueEstado(ctx, sacar());
    },
  });
}

/* ---------- Formato A: este objeto, en que estado esta ---------- */
function montarQueEstado(ctx, obj) {
  ctx.pedir({
    instruccion: `${obj.nombre}, ¿en qué estado está?`,
    apoyo: 'Sólido: duro y con forma permanente · Líquido: se adapta al recipiente '
         + 'y fluye · Gaseoso: se expande por el aire.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo');
  tarjeta.innerHTML = dibujo(obj.dibujo);
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones tres');
  for (const e of ESTADOS) {
    const btn = el('button', 'opcion solo-texto', e.nombre, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = e.id === obj.estado;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      // Al fallar, mostrar cual era: aprender, no solo saber que fallo.
      if (!acerto) {
        [...opciones.children]
          .find((o) => o.textContent === estado(obj.estado).nombre)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: obj.estado,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${obj.nombre} está en estado ${estado(obj.estado).nombre.toLowerCase()}.`,
        pista: pistaDeError(e.id, obj.estado) || estado(obj.estado).comoEs,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: las particulas ---------- */
function montarParticulas(ctx) {
  const e = uno(ESTADOS);

  ctx.pedir({
    instruccion: 'Mira cómo están las partículas. ¿Qué estado es?',
    apoyo: 'Juntas y ordenadas: no se mueven de su lugar · Sueltas: resbalan unas '
         + 'sobre otras · Dispersas: se expanden por todo el espacio.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo');
  tarjeta.innerHTML = particulas(e.particulas, { color: e.colorOscuro });
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones tres');
  for (const op of ESTADOS) {
    const btn = el('button', 'opcion solo-texto', op.nombre, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === e.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children]
          .find((o) => o.textContent === e.nombre)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: e.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Esas partículas son de un ${e.nombre.toLowerCase()}.`,
        pista: `${e.comoEs} Por eso sus partículas se ven ${e.particulas}.`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: al reves, cual de estos es solido ---------- */
function montarAlReves(ctx) {
  const e = uno(ESTADOS);
  const correcto = uno(OBJETOS.filter((o) => o.estado === e.id));
  const otros = barajar(OBJETOS.filter((o) => o.estado !== e.id)).slice(0, 2);
  const cartas = barajar([correcto, ...otros]);

  ctx.pedir({
    instruccion: `¿Cuál de estos está en estado ${e.nombre.toLowerCase()}?`,
    apoyo: e.comoEs,
  });

  const opciones = el('div', 'opciones tres');
  for (const c of cartas) {
    const btn = el('button', 'opcion',
      `${dibujo(c.dibujo)}<span class="pie">${c.nombre}</span>`,
      { type: 'button', 'data-id': c.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = c.id === correcto.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        opciones.querySelector(`[data-id="${correcto.id}"]`)?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: e.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${correcto.nombre} es el que está en estado ${e.nombre.toLowerCase()}.`,
        pista: pistaDeError(c.estado, e.id) || e.comoEs,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
