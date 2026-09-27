/**
 * ZONA 4 — Incolora, inodora, insípida
 *
 * Paginas 114-117, que el profesor mando como material de estudio. El temario
 * no nombra estas tres palabras, pero son el vocabulario con que se describe el
 * estado liquido (objetivo 2), asi que entran como apoyo.
 *
 * La dificultad real es que las tres empiezan casi igual. La pista de error las
 * separa siempre por la raiz: inCOLORa / inODORa / inSIPIDa.
 *
 * Cuatro formatos:
 *   A. Que significa esta palabra.
 *   B. Al reves: sin color / sin olor / sin sabor → que palabra es.
 *   C. Los ejercicios literales de la p.116.
 *   D. La tabla de la p.117: agua, jugo y leche.
 */

import { PROPIEDADES, propiedad, AGUA_POTABLE, LIQUIDOS_TABLA, pistaDeError, AVISOS } from '../datos.js';
import { dibujo } from '../agua.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

export function jugarPropiedades({ zona, onSalir, onFin, modo }) {
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(PROPIEDADES);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 3) montarNino(ctx);
      else if (i === 6) montarIngrediente(ctx);
      else if (i === 8) montarPotable(ctx);
      else if (i % 3 === 1) montarTabla(ctx);
      else if (i % 3 === 2) montarAlReves(ctx, sacar());
      else montarQueSignifica(ctx, sacar());
    },
  });
}

/* ---------- Formato A: que significa la palabra ---------- */
function montarQueSignifica(ctx, p) {
  ctx.pedir({ instruccion: `El agua es ${p.palabra.toLowerCase()}. ¿Qué significa?` });

  const cartas = barajar(PROPIEDADES);
  const opciones = el('div', 'opciones lista');

  for (const op of cartas) {
    const btn = el('button', 'opcion solo-texto', op.significa,
      { type: 'button', 'data-id': op.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === p.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${p.id}"]`)?.classList.add('correcta');

      ctx.responder({
        acerto,
        concepto: p.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${p.palabra}: ${p.significa.toLowerCase()}`,
        pista: pistaDeError(op.id, p.id),
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: al reves ---------- */
function montarAlReves(ctx, p) {
  ctx.pedir({
    instruccion: `El agua no tiene ${p.significa.toLowerCase().replace('no tiene ', '').replace('.', '')}. ¿Cómo se dice?`,
    apoyo: `Se nota con ${p.sentido}.`,
  });

  const opciones = el('div', 'opciones tres');
  for (const op of PROPIEDADES) {
    const btn = el('button', 'opcion solo-texto', op.palabra, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === p.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === p.palabra)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: p.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Se dice ${p.palabra.toLowerCase()}.`,
        pista: pistaDeError(op.id, p.id),
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C1: el nino bajo el agua (p.116, literal) ---------- */
function montarNino(ctx) {
  ctx.pedir({ instruccion: 'Un niño abre los ojos bajo el agua y ve todo. ¿Por qué puede ver?' });

  const cartas = barajar([
    { texto: 'Porque el agua es incolora', id: 'incolora', bueno: true },
    { texto: 'Porque el agua es inodora', id: 'inodora', bueno: false },
    { texto: 'Porque el agua es insípida', id: 'insipida', bueno: false },
  ]);

  const opciones = el('div', 'opciones lista');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(c.bueno ? 'correcta' : 'errada');
      if (!c.bueno) {
        [...opciones.children].find((o) => o.textContent.includes('incolora'))
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto: c.bueno,
        concepto: 'incolora',
        mensajeBien: '¡Eso es! El agua es incolora: transparente. 🎉',
        mensajeMal: 'Es porque el agua es incolora.',
        pista: pistaDeError(c.id, 'incolora')
          || 'Incolora quiere decir transparente: se puede ver a través de ella.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C2: que ingrediente le quita el olor (p.116, literal) ---------- */
function montarIngrediente(ctx) {
  ctx.pedir({
    instruccion: 'Tienes un vaso con agua y quieres que deje de ser inodora. '
               + '¿Qué le agregarías?',
    apoyo: 'Inodora significa que no tiene olor.',
  });

  // Las tres del libro: azucar, chocolate en polvo, harina. Solo el chocolate
  // tiene olor propio.
  const cartas = barajar([
    { texto: 'Chocolate en polvo', bueno: true },
    { texto: 'Azúcar', bueno: false },
    { texto: 'Harina', bueno: false },
  ]);

  const opciones = el('div', 'opciones tres');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(c.bueno ? 'correcta' : 'errada');
      if (!c.bueno) {
        [...opciones.children].find((o) => o.textContent === 'Chocolate en polvo')
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto: c.bueno,
        concepto: 'inodora',
        mensajeBien: '¡Exacto! El chocolate le da olor al agua. 🎉',
        mensajeMal: 'Es el chocolate en polvo.',
        pista: 'El chocolate tiene olor propio, y se lo pasa al agua. El azúcar le da '
             + 'sabor pero casi no huele, y la harina tampoco.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C3: agua potable ---------- */
function montarPotable(ctx) {
  ctx.pedir({ instruccion: '¿Qué es el agua potable?' });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo('vaso');
  ctx.zonaJuego.append(tarjeta);

  const cartas = barajar([
    { texto: AGUA_POTABLE, bueno: true },
    { texto: 'Es el agua que está congelada en los glaciares.', bueno: false },
    { texto: 'Es el agua que sale en forma de vapor del hervidor.', bueno: false },
  ]);

  const opciones = el('div', 'opciones lista');
  for (const c of cartas) {
    const btn = el('button', 'opcion solo-texto', c.texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(c.bueno ? 'correcta' : 'errada');
      if (!c.bueno) {
        [...opciones.children].find((o) => o.textContent === AGUA_POTABLE)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto: c.bueno,
        concepto: 'agua-potable',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: 'Es la que tomamos todos los días.',
        pista: AGUA_POTABLE,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato D: la tabla de la p.117 ---------- */
function montarTabla(ctx) {
  const liq = uno(LIQUIDOS_TABLA);
  const campo = uno(['color', 'olor', 'sabor']);
  const tiene = liq[campo];

  const palabras = { color: 'incolora', olor: 'inodora', sabor: 'insípida' };
  const conSin = {
    color: ['Con color', 'Sin color'],
    olor: ['Con olor', 'Sin olor'],
    sabor: ['Con sabor', 'Sin sabor'],
  };

  ctx.pedir({
    instruccion: `${liq.nombre}: ¿tiene ${campo}?`,
    apoyo: `El agua es ${palabras[campo]}, pero otros líquidos no.`,
  });

  const opciones = el('div', 'opciones dos');
  for (const texto of conSin[campo]) {
    const btn = el('button', 'opcion solo-texto', texto, { type: 'button' });
    const dice = texto.startsWith('Con');

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = dice === tiene;
      btn.classList.add(acerto ? 'correcta' : 'errada');

      const id = { color: 'incolora', olor: 'inodora', sabor: 'insipida' }[campo];
      ctx.responder({
        acerto,
        concepto: id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${liq.nombre} ${tiene ? 'sí' : 'no'} tiene ${campo}.`,
        pista: liq.nombre === 'Agua'
          ? `El agua es ${propiedad(id).palabra.toLowerCase()}: ${propiedad(id).significa.toLowerCase()}`
          : `${liq.nombre} sí tiene ${campo}. El agua es el que no tiene ni color, ni olor, ni sabor.`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
