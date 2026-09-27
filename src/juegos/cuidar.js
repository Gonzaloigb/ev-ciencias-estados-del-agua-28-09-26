/**
 * ZONA 5 — Cuidemos el agua
 *
 * Objetivos 3 y 4 del temario: "Proponer formas de cuidar el agua" y "Reconocer
 * la necesidad de cuidar el agua en nuestro planeta".
 *
 * Es el eje ACTITUDINAL, y por eso se evalua distinto a las otras zonas: aqui
 * no hay un termino que memorizar, hay un criterio que aplicar. El formato A no
 * pregunta una definicion sino que le pide decidir.
 *
 * El contexto chileno (glaciar San Rafael, sistema Toha) viene del libro, no es
 * relleno: son los dos ejemplos que el texto usa para el objetivo 4.
 */

import { CUIDADOS, POR_QUE_CUIDAR, AVISOS } from '../datos.js';
import { dibujo } from '../agua.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

export function jugarCuidar({ zona, onSalir, onFin, modo }) {
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(CUIDADOS);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 3 || i === 8) montarPorQue(ctx);
      else if (i % 4 === 2) montarElegirBuena(ctx);
      else montarCuidaONo(ctx, sacar());
    },
  });
}

/* ---------- Formato A: esto cuida el agua, si o no ---------- */
function montarCuidaONo(ctx, c) {
  ctx.pedir({
    instruccion: `"${c.texto}". ¿Esto cuida el agua?`,
    apoyo: 'Cuidar el agua es usar solo la que necesito, y no ensuciarla.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo(c.cuida ? 'llave' : 'planeta');
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones dos');
  for (const op of [{ v: true, t: '✅ Sí, la cuida' }, { v: false, t: '❌ No, la desperdicia' }]) {
    const btn = el('button', 'opcion solo-texto', op.t, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.v === c.cuida;
      btn.classList.add(acerto ? 'correcta' : 'errada');

      ctx.responder({
        acerto,
        concepto: 'cuidar-agua',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: c.cuida ? 'Sí la cuida.' : 'Esa desperdicia agua.',
        pista: c.cuida
          ? 'El agua dulce que podemos usar es poca. Cada vez que uso solo la que '
          + 'necesito, queda más para todos.'
          : 'Con esa costumbre se va mucha agua sin usarse. Siempre hay una forma de '
          + 'hacer lo mismo gastando menos.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: cual de estas SI cuida el agua ---------- */
function montarElegirBuena(ctx) {
  const buena = uno(CUIDADOS.filter((c) => c.cuida));
  const malas = barajar(CUIDADOS.filter((c) => !c.cuida)).slice(0, 2);
  const cartas = barajar([buena, ...malas]);

  ctx.pedir({ instruccion: '¿Cuál de estas cosas cuida el agua?' });

  const opciones = el('div', 'opciones lista');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto,
      { type: 'button', 'data-id': c.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(c.cuida ? 'correcta' : 'errada');
      if (!c.cuida) {
        opciones.querySelector(`[data-id="${buena.id}"]`)?.classList.add('correcta');
      }

      ctx.responder({
        acerto: c.cuida,
        concepto: 'cuidar-agua',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `La que cuida el agua es: ${buena.texto.toLowerCase()}.`,
        pista: 'Fíjate cuál de las tres usa menos agua, o evita ensuciarla.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: por que hay que cuidarla (glaciar y sistema Toha) ---------- */
function montarPorQue(ctx) {
  const tema = uno(POR_QUE_CUIDAR);
  const esGlaciar = tema.id === 'glaciar-san-rafael';

  ctx.pedir({
    instruccion: esGlaciar
      ? '¿Por qué se están derritiendo glaciares como el de la laguna San Rafael?'
      : '¿Para qué sirve el sistema que inventó el médico chileno José Tohá?',
  });

  const tarjeta = el('div', 'tarjeta-dibujo');
  tarjeta.innerHTML = dibujo(tema.dibujo);
  ctx.zonaJuego.append(tarjeta);

  const cartas = esGlaciar
    ? barajar([
        { texto: 'Por el calentamiento global: sube la temperatura del planeta', bueno: true },
        { texto: 'Porque les cae mucha lluvia encima', bueno: false },
        { texto: 'Porque el agua del mar los empuja', bueno: false },
      ])
    : barajar([
        { texto: 'Para limpiar agua sucia, usando lombrices', bueno: true },
        { texto: 'Para congelar agua más rápido', bueno: false },
        { texto: 'Para convertir el agua en vapor', bueno: false },
      ]);

  const opciones = el('div', 'opciones lista');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(c.bueno ? 'correcta' : 'errada');
      if (!c.bueno) {
        [...opciones.children].find((o) => o.textContent === cartas.find((x) => x.bueno).texto)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto: c.bueno,
        concepto: tema.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: cartas.find((x) => x.bueno).texto + '.',
        pista: tema.texto,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
