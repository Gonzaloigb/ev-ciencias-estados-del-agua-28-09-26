/**
 * agua.js — los dibujos del juego, en SVG generado.
 *
 * Equivalente de `animales.js` (ingles) y `figuras.js` (matematica).
 *
 * La pieza central son las PARTICULAS. Un cubito de hielo y un vaso de agua se
 * parecen demasiado dibujados; lo que de verdad distingue un estado de otro es
 * como estan ordenadas las particulas adentro:
 *
 *   solido   → juntas y ordenadas, en rejilla    (no se mueven de su lugar)
 *   liquido  → sueltas, pegadas pero desordenadas (resbalan unas sobre otras)
 *   gaseoso  → dispersas por todo el espacio      (se expanden)
 *
 * Eso es lo que hace visible la diferencia sin escribir una sola palabra, y es
 * justo lo que la prueba pide describir.
 *
 * Todos los dibujos comparten un lienzo de 100x100 para alinearse en rejillas.
 */

/* ============================================================
   PARTICULAS — el corazon del modulo
   ============================================================ */

/**
 * Genera las posiciones de las particulas de un estado.
 * Deterministas: la misma semilla da siempre el mismo dibujo, asi una pregunta
 * no cambia de aspecto si se repinta.
 */
function posiciones(tipo, semilla = 1) {
  // Generador pseudoaleatorio simple y estable (no se usa Math.random para que
  // el dibujo no baile entre repintados).
  let s = semilla * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const pts = [];

  if (tipo === 'juntas') {
    // Rejilla regular: orden, contacto, sin espacio. Es un solido.
    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 4; c++) {
        pts.push({ x: 32 + c * 12, y: 32 + f * 12, r: 4.5 });
      }
    }
  } else if (tipo === 'sueltas') {
    // Pegadas pero desordenadas, y solo en la mitad de abajo: el liquido se
    // acumula en el fondo del recipiente.
    for (let i = 0; i < 16; i++) {
      const f = Math.floor(i / 4);
      const c = i % 4;
      pts.push({
        x: 30 + c * 13 + (rnd() - 0.5) * 7,
        y: 46 + f * 11 + (rnd() - 0.5) * 6,
        r: 4.5,
      });
    }
  } else {
    // Dispersas por todo el lienzo: el gas se expande y ocupa todo el espacio.
    for (let i = 0; i < 14; i++) {
      pts.push({
        x: 14 + rnd() * 72,
        y: 12 + rnd() * 74,
        r: 3.5,
      });
    }
  }

  return pts;
}

/**
 * Dibuja las particulas de un estado.
 * @param {string} tipo  'juntas' | 'sueltas' | 'dispersas'
 */
export function particulas(tipo, { color = '#0EA5E9', semilla = 1 } = {}) {
  const pts = posiciones(tipo, semilla);
  const circulos = pts
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r}" fill="${color}"/>`)
    .join('');
  return svg(`<g class="particulas p-${tipo}">${circulos}</g>`);
}

/* ============================================================
   ENVOLTORIO
   ============================================================ */

function svg(interior, clase = '') {
  return `<svg viewBox="0 0 100 100" class="dib ${clase}" role="img" aria-hidden="true">${interior}</svg>`;
}

/* ============================================================
   CATALOGO DE DIBUJOS
   ============================================================ */

const DIBUJOS = {
  /* ---------- Solidos ---------- */

  cubito: () => svg(`
    <rect x="24" y="30" width="52" height="46" rx="7" fill="#BAE6FD" stroke="#0284C7" stroke-width="3"/>
    <path d="M32 38 L44 38 L38 50 Z" fill="#E0F2FE" opacity=".9"/>
    <rect x="56" y="44" width="12" height="12" rx="3" fill="#E0F2FE" opacity=".7"/>
    <path d="M24 62 Q50 56 76 62" stroke="#7DD3FC" stroke-width="2.5" fill="none"/>
  `, 'd-cubito'),

  glaciar: () => svg(`
    <rect x="0" y="66" width="100" height="34" fill="#38BDF8"/>
    <path d="M6 66 L26 26 L44 66 Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="2.5"/>
    <path d="M38 66 L62 14 L86 66 Z" fill="#F0F9FF" stroke="#0284C7" stroke-width="2.5"/>
    <path d="M62 14 L70 30 L54 30 Z" fill="#BAE6FD"/>
    <path d="M0 74 Q14 70 28 74 T56 74 T84 74 T100 74" stroke="#0EA5E9" stroke-width="2" fill="none"/>
  `, 'd-glaciar'),

  nieve: () => svg(`
    <g stroke="#0284C7" stroke-width="3" stroke-linecap="round">
      <line x1="50" y1="18" x2="50" y2="82"/>
      <line x1="22" y1="34" x2="78" y2="66"/>
      <line x1="78" y1="34" x2="22" y2="66"/>
      <line x1="50" y1="26" x2="42" y2="34"/><line x1="50" y1="26" x2="58" y2="34"/>
      <line x1="50" y1="74" x2="42" y2="66"/><line x1="50" y1="74" x2="58" y2="66"/>
      <line x1="28" y1="38" x2="28" y2="48"/><line x1="72" y1="62" x2="72" y2="52"/>
      <line x1="72" y1="38" x2="72" y2="48"/><line x1="28" y1="62" x2="28" y2="52"/>
    </g>
  `, 'd-nieve'),

  /* ---------- Liquidos ---------- */

  vaso: () => svg(`
    <path d="M28 20 L34 84 L66 84 L72 20 Z" fill="#F8FAFC" stroke="#475569" stroke-width="3"/>
    <path d="M31 44 L34 84 L66 84 L69 44 Z" fill="#38BDF8" opacity=".85"/>
    <path d="M31 44 Q40 40 50 44 T69 44" fill="none" stroke="#0EA5E9" stroke-width="2.5"/>
    <ellipse cx="50" cy="20" rx="22" ry="5" fill="#F1F5F9" stroke="#475569" stroke-width="3"/>
  `, 'd-vaso'),

  rio: () => svg(`
    <rect x="0" y="0" width="100" height="100" fill="#DCFCE7"/>
    <path d="M0 40 Q25 30 50 44 T100 40 L100 72 Q75 62 50 76 T0 72 Z" fill="#38BDF8"/>
    <path d="M0 52 Q25 44 50 56 T100 52" stroke="#0EA5E9" stroke-width="2.5" fill="none"/>
    <path d="M0 64 Q25 56 50 68 T100 64" stroke="#7DD3FC" stroke-width="2" fill="none"/>
    <circle cx="16" cy="22" r="7" fill="#22C55E"/><circle cx="84" cy="86" r="8" fill="#16A34A"/>
  `, 'd-rio'),

  lluvia: () => svg(`
    <ellipse cx="50" cy="32" rx="30" ry="16" fill="#CBD5E1"/>
    <ellipse cx="32" cy="34" rx="16" ry="12" fill="#E2E8F0"/>
    <ellipse cx="68" cy="34" rx="18" ry="13" fill="#E2E8F0"/>
    <g fill="#38BDF8">
      <path d="M28 56 q4 8 0 10 q-4-2 0-10"/>
      <path d="M44 62 q4 8 0 10 q-4-2 0-10"/>
      <path d="M60 56 q4 8 0 10 q-4-2 0-10"/>
      <path d="M74 64 q4 8 0 10 q-4-2 0-10"/>
      <path d="M36 76 q4 8 0 10 q-4-2 0-10"/>
      <path d="M66 78 q4 8 0 10 q-4-2 0-10"/>
    </g>
  `, 'd-lluvia'),

  /* ---------- Gaseosos ---------- */

  hervidor: () => svg(`
    <g class="vapor" fill="none" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round" opacity=".95">
      <path d="M38 34 q-6-8 0-16 q6-8 0-14"/>
      <path d="M52 30 q-6-8 0-16 q6-8 0-12"/>
      <path d="M66 34 q-6-8 0-16 q6-8 0-14"/>
    </g>
    <path d="M28 46 L30 82 Q30 88 36 88 L64 88 Q70 88 70 82 L72 46 Z" fill="#E11D48" stroke="#9F1239" stroke-width="3"/>
    <rect x="24" y="40" width="52" height="8" rx="4" fill="#F43F5E" stroke="#9F1239" stroke-width="2.5"/>
    <path d="M70 56 q14 2 14 12 q0 8-10 8" fill="none" stroke="#9F1239" stroke-width="4"/>
    <rect x="42" y="30" width="16" height="10" rx="3" fill="#9F1239"/>
  `, 'd-hervidor'),

  ducha: () => svg(`
    <rect x="42" y="6" width="8" height="18" fill="#94A3B8"/>
    <path d="M28 24 L72 24 L66 34 L34 34 Z" fill="#64748B"/>
    <g class="vapor" fill="none" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" opacity=".9">
      <path d="M32 58 q-6-8 0-14 q6-6 0-10"/>
      <path d="M50 62 q-6-8 0-14 q6-6 0-10"/>
      <path d="M68 58 q-6-8 0-14 q6-6 0-10"/>
    </g>
    <g fill="#7DD3FC">
      <circle cx="38" cy="44" r="2.5"/><circle cx="50" cy="48" r="2.5"/><circle cx="62" cy="44" r="2.5"/>
    </g>
    <rect x="16" y="84" width="68" height="10" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  `, 'd-ducha'),

  /* ---------- Situaciones de cambio de estado ---------- */

  congelador: () => svg(`
    <rect x="18" y="14" width="64" height="74" rx="8" fill="#E0F2FE" stroke="#0284C7" stroke-width="3"/>
    <line x1="18" y1="40" x2="82" y2="40" stroke="#0284C7" stroke-width="3"/>
    <rect x="66" y="22" width="5" height="12" rx="2.5" fill="#0369A1"/>
    <rect x="66" y="48" width="5" height="14" rx="2.5" fill="#0369A1"/>
    <g stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round">
      <line x1="34" y1="54" x2="34" y2="72"/><line x1="26" y1="59" x2="42" y2="67"/><line x1="42" y1="59" x2="26" y2="67"/>
      <line x1="54" y1="58" x2="54" y2="72"/><line x1="48" y1="62" x2="60" y2="68"/><line x1="60" y1="62" x2="48" y2="68"/>
    </g>
  `, 'd-congelador'),

  'mano-hielo': () => svg(`
    <rect x="36" y="20" width="30" height="26" rx="5" fill="#BAE6FD" stroke="#0284C7" stroke-width="3"/>
    <path d="M42 26 L52 26 L47 36 Z" fill="#E0F2FE"/>
    <g fill="#38BDF8">
      <path d="M46 50 q3 6 0 8 q-3-2 0-8"/>
      <path d="M56 52 q3 6 0 8 q-3-2 0-8"/>
    </g>
    <path d="M22 70 q0-10 10-10 l36 0 q10 0 10 10 l0 6 q0 8-10 8 l-36 0 q-10 0-10-8 Z" fill="#FDBA74" stroke="#C2410C" stroke-width="3"/>
    <path d="M32 70 l0-8 M44 70 l0-10 M56 70 l0-10 M68 70 l0-8" stroke="#C2410C" stroke-width="2.5" stroke-linecap="round"/>
  `, 'd-mano'),

  /* ---------- Cuidar el agua ---------- */

  llave: () => svg(`
    <rect x="14" y="30" width="16" height="12" rx="3" fill="#94A3B8"/>
    <path d="M30 36 L64 36 L64 54 L56 54 L56 44 L30 44 Z" fill="#CBD5E1" stroke="#64748B" stroke-width="2.5"/>
    <rect x="36" y="20" width="8" height="16" rx="3" fill="#64748B"/>
    <ellipse cx="40" cy="20" rx="12" ry="5" fill="#94A3B8"/>
    <g fill="#38BDF8">
      <path d="M58 60 q4 8 0 10 q-4-2 0-10"/>
      <path d="M58 74 q3 6 0 8 q-3-2 0-8"/>
    </g>
    <ellipse cx="60" cy="90" rx="18" ry="5" fill="#7DD3FC" opacity=".6"/>
  `, 'd-llave'),

  lombriz: () => svg(`
    <rect x="0" y="52" width="100" height="48" fill="#92400E"/>
    <rect x="0" y="52" width="100" height="8" fill="#65A30D"/>
    <path d="M18 74 q10-12 22 0 t22 0 t20-4" fill="none" stroke="#F472B6" stroke-width="11" stroke-linecap="round"/>
    <circle cx="82" cy="70" r="2" fill="#831843"/>
    <g fill="#38BDF8" opacity=".8">
      <circle cx="30" cy="28" r="4"/><circle cx="50" cy="20" r="4"/><circle cx="70" cy="30" r="4"/>
      <circle cx="40" cy="40" r="3"/><circle cx="62" cy="42" r="3"/>
    </g>
  `, 'd-lombriz'),

  planeta: () => svg(`
    <circle cx="50" cy="50" r="36" fill="#38BDF8" stroke="#0369A1" stroke-width="3"/>
    <path d="M22 38 q10-6 18 0 t14 4 q-6 8-16 6 t-16-10 Z" fill="#22C55E"/>
    <path d="M56 62 q10-8 20-2 q-4 12-16 12 q-8 0-4-10 Z" fill="#16A34A"/>
    <path d="M60 28 q10 2 14 10 q-10 4-16-2 Z" fill="#22C55E"/>
  `, 'd-planeta'),

  /* ---------- Termometro: apoyo de la zona de cambios ---------- */

  termometro: (nivel = 'media') => {
    const alturas = { baja: 16, media: 34, alta: 54 };
    const colores = { baja: '#38BDF8', media: '#22C55E', alta: '#EF4444' };
    const h = alturas[nivel] || alturas.media;
    const c = colores[nivel] || colores.media;
    return svg(`
      <rect x="42" y="12" width="16" height="58" rx="8" fill="#F1F5F9" stroke="#475569" stroke-width="3"/>
      <circle cx="50" cy="76" r="14" fill="#F1F5F9" stroke="#475569" stroke-width="3"/>
      <rect x="46" y="${70 - h}" width="8" height="${h}" fill="${c}"/>
      <circle cx="50" cy="76" r="9" fill="${c}"/>
      <g stroke="#94A3B8" stroke-width="2" stroke-linecap="round">
        <line x1="62" y1="24" x2="68" y2="24"/><line x1="62" y1="38" x2="68" y2="38"/><line x1="62" y1="52" x2="68" y2="52"/>
      </g>
    `, 'd-termometro');
  },
};

/**
 * Devuelve el SVG de un dibujo.
 * Lanza si no existe: un dibujo que falta debe verse al primer intento, no
 * dejar un hueco silencioso en la pantalla.
 */
export function dibujo(id, ...args) {
  const f = DIBUJOS[id];
  if (!f) throw new Error(`Dibujo desconocido: ${id}`);
  return f(...args);
}

/** Los dibujos disponibles, para las hojas de prueba. */
export function catalogo() {
  return Object.keys(DIBUJOS);
}

/** Una gota — se usa como vineta y en la portada. */
export function gota(color = '#38BDF8') {
  return svg(`<path d="M50 12 q26 32 26 48 a26 26 0 0 1-52 0 q0-16 26-48 Z" fill="${color}"/>`, 'd-gota');
}
