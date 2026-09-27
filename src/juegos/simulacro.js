/**
 * ZONA 6 — Ensayo de la prueba
 *
 * Como la prueba de verdad: preguntas de toda la unidad, mezcladas y sin
 * ayudas. Aqui la idea es MEDIR, no ensenar — por eso `forzarDuro: true`, que
 * silencia el apoyo y las pistas aunque se juegue en modo normal.
 *
 * Lo que `forzarDuro` NO hace es quitar vidas: perder el ensayo a la tercera no
 * le ensena nada a nadie. Si Marina eligio modo dificil, las vidas vienen del
 * modo, no de aqui.
 *
 * El reparto de preguntas sigue los CINCO objetivos del temario, en proporcion
 * a su peso:
 *   4 identificar estados · 3 describirlos · 4 cambios de estado ·
 *   2 propiedades · 2 cuidar el agua
 */

import {
  OBJETOS, ESTADOS, estado, CAMBIOS, PROPIEDADES, CUIDADOS,
  pistaDeError, AVISOS,
} from '../datos.js';
import { dibujo, particulas } from '../agua.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';
import { guardarSimulacro } from '../estado.js';

const TOTAL = 15;

export function jugarSimulacro({ zona, onSalir, onFin, modo }) {
  const guion = barajar([
    'estado', 'estado', 'estado', 'estado',
    'describir', 'describir', 'describir',
    'cambio', 'cambio', 'cambio', 'cambio',
    'propiedad', 'propiedad',
    'cuidar', 'cuidar',
  ]);

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    modo,
    forzarDuro: true,
    onFin(r) {
      guardarSimulacro(r.aciertos, r.total);
      onFin(r);
    },
    montar(ctx, i) {
      switch (guion[i]) {
        case 'estado': return preguntaEstado(ctx);
        case 'describir': return preguntaDescribir(ctx);
        case 'cambio': return preguntaCambio(ctx);
        case 'propiedad': return preguntaPropiedad(ctx);
        case 'cuidar': return preguntaCuidar(ctx);
        default: throw new Error(`Pregunta desconocida: ${guion[i]}`);
      }
    },
  });
}

/* ---------- Helper: arma botones de alternativa y cierra la pregunta ---------- */
function armar(ctx, { cartas, esCorrecta, clase = 'lista', concepto, mensajeMal, pista }) {
  const opciones = el('div', `opciones ${clase}`);

  cartas.forEach((c, idx) => {
    const btn = el('button', 'opcion solo-texto', c.texto,
      { type: 'button', 'data-i': String(idx) });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = esCorrecta(c);
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        const iBuena = cartas.findIndex(esCorrecta);
        opciones.querySelector(`[data-i="${iBuena}"]`)?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: typeof concepto === 'function' ? concepto(c) : concepto,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: typeof mensajeMal === 'function' ? mensajeMal(c) : mensajeMal,
        pista: typeof pista === 'function' ? pista(c) : pista,
      });
    });
    opciones.append(btn);
  });

  ctx.zonaJuego.append(opciones);
}

/* ---------- 1. Identificar el estado ---------- */
function preguntaEstado(ctx) {
  // Mitad con objeto, mitad con particulas.
  const conParticulas = Math.random() < 0.4;

  if (conParticulas) {
    const e = uno(ESTADOS);
    ctx.pedir({ instruccion: 'Mira las partículas. ¿Qué estado del agua es?' });

    const t = el('div', 'tarjeta-dibujo');
    t.innerHTML = particulas(e.particulas, { color: e.colorOscuro });
    ctx.zonaJuego.append(t);

    armar(ctx, {
      cartas: ESTADOS.map((x) => ({ texto: x.nombre, id: x.id })),
      esCorrecta: (c) => c.id === e.id,
      clase: 'tres',
      concepto: e.id,
      mensajeMal: `Es estado ${e.nombre.toLowerCase()}.`,
      pista: null,
    });
    return;
  }

  const obj = uno(OBJETOS);
  ctx.pedir({ instruccion: `${obj.nombre}, ¿en qué estado está?` });

  const t = el('div', 'tarjeta-dibujo');
  t.innerHTML = dibujo(obj.dibujo);
  ctx.zonaJuego.append(t);

  armar(ctx, {
    cartas: ESTADOS.map((x) => ({ texto: x.nombre, id: x.id })),
    esCorrecta: (c) => c.id === obj.estado,
    clase: 'tres',
    concepto: obj.estado,
    mensajeMal: `Es estado ${estado(obj.estado).nombre.toLowerCase()}.`,
    pista: null,
  });
}

/* ---------- 2. Describir el estado ---------- */
const DESCRIPCIONES = [
  { texto: 'Es duro y tiene forma permanente', id: 'solido' },
  { texto: 'Se adapta a la forma del recipiente y puede fluir', id: 'liquido' },
  { texto: 'Se expande por el aire y es liviano', id: 'gaseoso' },
];

function preguntaDescribir(ctx) {
  const alReves = Math.random() < 0.5;
  const e = uno(ESTADOS);

  if (alReves) {
    ctx.pedir({ instruccion: `¿Cómo es el estado ${e.nombre.toLowerCase()}?` });
    armar(ctx, {
      cartas: barajar(DESCRIPCIONES).map((d) => ({ texto: d.texto, id: d.id })),
      esCorrecta: (c) => c.id === e.id,
      concepto: `prop-${e.id}`,
      mensajeMal: e.comoEs,
      pista: null,
    });
    return;
  }

  const d = uno(DESCRIPCIONES);
  ctx.pedir({ instruccion: `"${d.texto}". ¿De qué estado hablamos?` });
  armar(ctx, {
    cartas: ESTADOS.map((x) => ({ texto: x.nombre, id: x.id })),
    esCorrecta: (c) => c.id === d.id,
    clase: 'tres',
    concepto: `prop-${d.id}`,
    mensajeMal: `Es el estado ${estado(d.id).nombre.toLowerCase()}.`,
    pista: null,
  });
}

/* ---------- 3. Cambios de estado ---------- */
function preguntaCambio(ctx) {
  const c = uno(CAMBIOS);
  const formato = Math.random();

  // 3a: situacion → que le pasa
  if (formato < 0.5) {
    ctx.pedir({ instruccion: `${c.situacion}. ¿Qué le pasa al agua?` });

    const t = el('div', 'tarjeta-dibujo');
    t.innerHTML = dibujo(c.dibujo);
    ctx.zonaJuego.append(t);

    armar(ctx, {
      cartas: barajar(CAMBIOS).map((x) => ({ texto: x.verbo, id: x.id })),
      esCorrecta: (x) => x.id === c.id,
      concepto: c.id,
      mensajeMal: `${c.verbo}.`,
      pista: null,
    });
    return;
  }

  // 3b: de que estado a que estado
  const real = c.id === 'sin-cambio'
    ? uno(CAMBIOS.filter((x) => x.id !== 'sin-cambio'))
    : c;

  ctx.pedir({
    instruccion: `${real.verbo}: el agua pasa de estado `
               + `${estado(real.de).nombre.toLowerCase()} a…`,
  });

  armar(ctx, {
    cartas: ESTADOS.map((x) => ({ texto: x.nombre, id: x.id })),
    esCorrecta: (x) => x.id === real.a,
    clase: 'tres',
    concepto: real.id,
    mensajeMal: `Pasa a estado ${estado(real.a).nombre.toLowerCase()}.`,
    pista: null,
  });
}

/* ---------- 4. Propiedades ---------- */
function preguntaPropiedad(ctx) {
  const p = uno(PROPIEDADES);
  const alReves = Math.random() < 0.5;

  if (alReves) {
    ctx.pedir({ instruccion: `El agua es ${p.palabra.toLowerCase()}. ¿Qué significa?` });
    armar(ctx, {
      cartas: barajar(PROPIEDADES).map((x) => ({ texto: x.significa, id: x.id })),
      esCorrecta: (c) => c.id === p.id,
      concepto: p.id,
      mensajeMal: `${p.palabra}: ${p.significa.toLowerCase()}`,
      pista: null,
    });
    return;
  }

  const sin = { incolora: 'color', inodora: 'olor', insipida: 'sabor' }[p.id];
  ctx.pedir({ instruccion: `El agua no tiene ${sin}. ¿Cómo se dice?` });
  armar(ctx, {
    cartas: PROPIEDADES.map((x) => ({ texto: x.palabra, id: x.id })),
    esCorrecta: (c) => c.id === p.id,
    clase: 'tres',
    concepto: p.id,
    mensajeMal: `Se dice ${p.palabra.toLowerCase()}.`,
    pista: null,
  });
}

/* ---------- 5. Cuidar el agua ---------- */
function preguntaCuidar(ctx) {
  const buena = uno(CUIDADOS.filter((c) => c.cuida));
  const malas = barajar(CUIDADOS.filter((c) => !c.cuida)).slice(0, 2);
  const cartas = barajar([buena, ...malas]);

  ctx.pedir({ instruccion: '¿Cuál de estas cosas cuida el agua?' });

  armar(ctx, {
    cartas: cartas.map((c) => ({ texto: c.texto, cuida: c.cuida })),
    esCorrecta: (c) => c.cuida,
    concepto: 'cuidar-agua',
    mensajeMal: `La que cuida el agua es: ${buena.texto.toLowerCase()}.`,
    pista: null,
  });
}
