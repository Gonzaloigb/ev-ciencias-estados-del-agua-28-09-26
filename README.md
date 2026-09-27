# Los estados del agua

Juego para practicar la prueba de ciencias de 2° básico: los estados del agua
(sólido, líquido y gaseoso), sus cambios y por qué hay que cuidarla.

**Jugar:** https://gonzaloigb.github.io/ev-ciencias-estados-del-agua-28-09-26/

## Qué trae

Seis zonas, cada una sobre un objetivo del temario:

| Zona | Contenido |
|---|---|
| 1 · Los tres estados | Reconocer el estado en objetos de la vida diaria |
| 2 · ¿Cómo es cada uno? | Duro, fluye, se expande |
| 3 · Frío y calor | Se congela, se derrite, se evapora |
| 4 · Incolora, inodora, insípida | Propiedades del agua y agua potable |
| 5 · Cuidemos el agua | Glaciar San Rafael, sistema Tohá |
| 6 · Ensayo de la prueba | Todo mezclado, sin ayudas |

## Dos modos

- **🌱 Normal** — tres alternativas y, al fallar, la explicación de la regla.
- **🔥 Difícil** — todas las alternativas, sin pistas y con 3 vidas.

El modo difícil nunca esconde materia nueva: solo quita ayudas.

## Desarrollo

```bash
npm install
npm run dev      # servidor con recarga en vivo
npm run build    # compila a dist/index.html, en UN solo archivo
python verificar.py --todos   # prueba de humo en WebKit y Chromium
```

El build produce un único HTML autocontenido a propósito, para que funcione al
abrirlo con doble clic (`file://`), donde los navegadores bloquean los módulos ES.

Se publica solo en cada push a `master`.
