# Plantas Satélite de GNL · Certificación Sedigas

Web de práctica para los dos exámenes de Técnico de Plantas Satélite de GNL: el teórico (tipo test) y el visual (fotos).

- **97 preguntas teóricas**: todas las de los bancos oficiales Tipo A y Tipo B (enero de 2021), por tema, con la respuesta correcta y una explicación breve.
- **46 preguntas visuales**: las fotos de las diapositivas del curso con los rótulos tapados; hay que decir qué elemento señala cada número.
- **Simulacro teórico** (20 preguntas repartidas por tema) y **simulacro visual** (10 elementos), con nota al final.
- **Práctica** por tema o todas mezcladas, con corrección inmediata, y repaso solo de los fallos.
- **Guía de estudio** en la carpeta `guia/`: esquema y resumen de los 13 temas, chuleta de cifras y las fotos con sus nombres (con un botón para ocultarlos y ponerte a prueba).
- No necesita servidor ni instalar nada. El progreso se guarda en el navegador de cada dispositivo.

> El material no dice cuántas preguntas tiene cada examen ni la nota de corte. El simulacro usa 20 teóricas y 10 visuales con un corte orientativo del 80 %. Para cambiarlo, edita `SIMULACRO` y `CORTE` al principio de `app.js`.

## Probarla en tu ordenador

Descomprime la carpeta y abre `index.html` con el navegador.

## Publicarla en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `Sedigas-GNL`).
2. Sube **todo el contenido** de esta carpeta a la raíz del repositorio: `index.html`, `app.js`, `styles.css`, `preguntas.js` y las carpetas `img/` y `guia/`.
   Desde la web: *Add file → Upload files*, arrastra los archivos y las carpetas, y pulsa *Commit changes*.
3. Ve a *Settings → Pages*. En *Build and deployment*, elige *Deploy from a branch*, la rama `main` y la carpeta `/ (root)`, y pulsa *Save*.
4. En uno o dos minutos la web estará en `https://TU-USUARIO.github.io/Sedigas-GNL/`.

> **Ojo con la privacidad.** Las fotos proceden de material de Sedigas. En un repositorio público cualquiera podría verlas.

## Añadir preguntas

Edita `preguntas.js`. Cada pregunta es un bloque como este:

```js
{
 "id": "Q999",
 "bloque": "T4",               // T1…T12 para teóricas, VIS para visuales
 "tipo": "MC",
 "img": null,                  // o "img/foto.jpg" en las visuales
 "pregunta": "Texto de la pregunta…",
 "opciones": ["Respuesta buena", "Mala 1", "Mala 2", "Mala 3"],
 "correcta": "Respuesta buena",
 "solucion": "Explicación que se muestra al corregir."
}
```

- `correcta` tiene que ser exactamente igual que una de las `opciones`. El orden de las opciones se mezcla solo cada vez.
- Cada `id` tiene que ser distinto de los demás.

## Atajos de teclado

- Teclas `1` a `5`: elegir respuesta.
- `Enter`: pasar a la siguiente pregunta en el modo práctica.
