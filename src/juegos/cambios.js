/**
 * ZONA 3 — Frío y calor
 *
 * Objetivo del temario: "Reconocer algunos cambios de estado del agua en la
 * vida cotidiana (evaporacion y congelamiento)".
 *
 * Los DOS que el profesor nombra son congelamiento y evaporacion; derretirse
 * aparece en el libro y en el PPT pero sin nombre tecnico, asi que se usa el
 * verbo. Aqui no se escribe fusion, solidificacion ni condensacion: el libro de
 * 2 basico no los ensena.
 *
 * Cuatro formatos:
 *   A. Situacion cotidiana → que le pasa al agua.
 *   B. Temperatura → que ocurre. (p.127 del libro)
 *   C. Los dos ejercicios literales de la p.129: cubeta y hervidor.
 *   D. De que estado a que estado.
 */

import { CAMBIOS, cambio, ESTADOS, estado, pistaDeError, AVISOS } from '../datos.js';
import { dibujo } from '../agua.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

export function jugarCambios({ zona, onSalir, onFin, modo }) {
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(CAMBIOS);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 2 || i === 6) montarLibro(ctx);
      else if (i % 4 === 1) montarTemperatura(ctx);
      else if (i % 4 === 3) montarDeAdonde(ctx, sacar());
      else montarQuePasa(ctx, sacar());
    },
  });
}

/* ---------- Formato A: situacion cotidiana ---------- */
function montarQuePasa(ctx, c) {
  ctx.pedir({
    instruccion: `${c.situacion}. ¿Qué le pasa al agua?`,
    apoyo: 'Con frío el agua se congela · Con calor se derrite el hielo, o el agua se evapora.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo');
  tarjeta.innerHTML = dibujo(c.dibujo);
  ctx.zonaJuego.append(tarjeta);

  const cartas = barajar(CAMBIOS);
  const opciones = el('div', 'opciones lista');

  for (const op of cartas) {
    const btn = el('button', 'opcion solo-texto', op.verbo,
      { type: 'button', 'data-id': op.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === c.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${c.id}"]`)?.classList.add('correcta');

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: c.verbo + '.',
        pista: pistaDeError(op.id, c.id) || c.resultado,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: la temperatura manda (p.127) ---------- */
function montarTemperatura(ctx) {
  const c = uno(CAMBIOS);
  const nivel = c.temperatura === 'muy baja' ? 'baja' : (c.temperatura === 'alta' ? 'alta' : 'media');

  ctx.pedir({
    instruccion: `Cuando la temperatura es ${c.temperatura}, ¿qué pasa con el agua?`,
    apoyo: 'Muy baja: se transforma en hielo · Media: se mantiene líquida · '
         + 'Alta: el hielo se derrite o el agua se evapora.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo('termometro', nivel);
  ctx.zonaJuego.append(tarjeta);

  // Solo los cambios de esa temperatura son correctos; el resto, distractores.
  const buenos = CAMBIOS.filter((x) => x.temperatura === c.temperatura);
  const correcto = uno(buenos);
  const otros = barajar(CAMBIOS.filter((x) => x.temperatura !== c.temperatura)).slice(0, 2);
  const cartas = barajar([correcto, ...otros]);

  const opciones = el('div', 'opciones lista');
  for (const op of cartas) {
    const btn = el('button', 'opcion solo-texto', op.resultado,
      { type: 'button', 'data-id': op.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.temperatura === c.temperatura;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${correcto.id}"]`)?.classList.add('correcta');

      ctx.responder({
        acerto,
        concepto: correcto.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: correcto.resultado,
        pista: pistaDeError(op.id, correcto.id)
          || `Con temperatura ${c.temperatura}: ${correcto.resultado.toLowerCase()}`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: los dos ejercicios literales de la p.129 ---------- */
function montarLibro(ctx) {
  const esCubeta = Math.random() < 0.5;

  const pregunta = esCubeta
    ? '¿Qué ocurrió con el agua de la cubeta que se puso en el congelador?'
    : '¿Qué ocurrió con el agua del hervidor después de calentarla?';

  const correcto = esCubeta ? 'Se congeló' : 'Se evaporó';

  ctx.pedir({ instruccion: pregunta });

  const tarjeta = el('div', 'tarjeta-dibujo');
  tarjeta.innerHTML = dibujo(esCubeta ? 'congelador' : 'hervidor');
  ctx.zonaJuego.append(tarjeta);

  // Las tres opciones del libro, siempre las mismas tres.
  const cartas = barajar(['Se derritió', 'Se congeló', 'Se evaporó']);
  const opciones = el('div', 'opciones tres');

  for (const texto of cartas) {
    const btn = el('button', 'opcion solo-texto', texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = texto === correcto;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === correcto)
          ?.classList.add('correcta');
      }

      const idC = esCubeta ? 'cambio-congelar' : 'cambio-evaporar';
      const idR = texto === 'Se congeló' ? 'cambio-congelar'
                : texto === 'Se evaporó' ? 'cambio-evaporar' : 'cambio-derretir';

      ctx.responder({
        acerto,
        concepto: idC,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${correcto}.`,
        pista: pistaDeError(idR, idC) || cambio(idC).resultado,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato D: de que estado a que estado ---------- */
function montarDeAdonde(ctx, c) {
  // "Sigue igual" no sirve para esta pregunta: no hay cambio que nombrar.
  if (c.id === 'sin-cambio') c = uno(CAMBIOS.filter((x) => x.id !== 'sin-cambio'));

  ctx.pedir({
    instruccion: `${c.verbo}: el agua pasa de estado ${estado(c.de).nombre.toLowerCase()} a…`,
    apoyo: c.situacion,
  });

  const opciones = el('div', 'opciones tres');
  for (const e of ESTADOS) {
    const btn = el('button', 'opcion solo-texto', e.nombre, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = e.id === c.a;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === estado(c.a).nombre)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Pasa a estado ${estado(c.a).nombre.toLowerCase()}.`,
        pista: c.resultado,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
