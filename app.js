/* Técnico de Plantas Satélite de GNL · Práctica de examen Sedigas
   Funciona sin servidor: abre index.html o publícalo en GitHub Pages. */
const App = (() => {
  const P = window.PREGUNTAS || [];
  // Formato orientativo del simulacro: el material no dice cuántas preguntas caen. Cámbialo aquí.
  const SIMULACRO = { teorico: 20, visual: 10 };
  const CORTE = 0.8; // nota de corte orientativa (80 %)
  const TEMAS = {
    T1: 'Tema 1 · Las PS y el GNL', T2: 'Tema 2 · Reglamentación', T4: 'Tema 4 · Composición y funcionamiento',
    T5: 'Tema 5 · Montaje y pruebas', T6: 'Tema 6 · Documentación', T7: 'Tema 7 · Operación',
    T8: 'Tema 8 · Mantenimiento', T9: 'Tema 9 · Incidencias', T10: 'Tema 10 · Seguridad y emergencias',
    T11: 'Tema 11 · Transporte', T12: 'Tema 12 · Medioambiente', VIS: 'Visual'
  };
  const KEY = 'sedigas_gnl_v1';
  const $app = document.getElementById('app');
  const TEO = P.filter(q => q.bloque !== 'VIS'), VIS = P.filter(q => q.bloque === 'VIS');
  let est = {};
  try { est = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { est = {}; }
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(est)); } catch (e) {} };
  const marcar = (id, ok) => {
    const s = est[id] || { ok: 0, mal: 0 };
    ok ? s.ok++ : s.mal++; s.ultima = ok ? 'ok' : 'mal'; est[id] = s; guardar(); progreso();
  };
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mezclar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const preparar = qs => qs.map(q => Object.assign({}, q, { opciones: mezclar(q.opciones) }));
  const fallada = q => est[q.id] && est[q.id].ultima === 'mal';
  const ICO = {
    libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M8 7h8M8 11h6"/></svg>',
    ojo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    mezcla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
    repaso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/></svg>',
    papelera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
  };
  let ses = null;

  function progreso() {
    const vistas = P.filter(q => est[q.id]).length;
    const fallos = P.filter(fallada).length;
    document.getElementById('progreso').textContent = `${vistas}/${P.length} vistas · ${fallos} por repasar`;
  }

  function home() {
    ses = null;
    const ok = Object.values(est).reduce((a, s) => a + s.ok, 0), mal = Object.values(est).reduce((a, s) => a + s.mal, 0);
    const pct = ok + mal ? Math.round(100 * ok / (ok + mal)) : 0;
    const fT = TEO.filter(fallada).length, fV = VIS.filter(fallada).length;
    const tarjeta = (onclick, color, ico, titulo, texto, dis) => `<button class="card ${color}" onclick="${onclick}" ${dis ? 'disabled' : ''}><span class="ico">${ico}</span><b>${titulo}</b><small>${texto}</small></button>`;
    const chips = Object.keys(TEMAS).filter(t => t !== 'VIS').map(t => `<button class="chip" onclick="App.practica('${t}')">${esc(TEMAS[t])} · ${TEO.filter(q => q.bloque === t).length}</button>`).join('');
    $app.innerHTML = `
      <section class="hero">
        <span class="kicker">Certificación Sedigas · Técnico de Plantas Satélite de GNL</span>
        <h1>Practica los dos exámenes</h1>
        <p class="sub">${TEO.length} preguntas teóricas de los bancos oficiales (Tipo A y B) y ${VIS.length} preguntas visuales con las fotos del curso, con los rótulos tapados.</p>
        <div class="stats">
          <div class="stat"><strong>${ok}</strong>aciertos</div>
          <div class="stat"><strong>${mal}</strong>fallos</div>
          <div class="stat"><strong>${pct}%</strong>acierto</div>
        </div>
        <div class="acciones">
          <button class="btn" onclick="App.examen('teorico')">Simulacro teórico · ${SIMULACRO.teorico} preguntas</button>
          <button class="btn" onclick="App.examen('visual')">Simulacro visual · ${SIMULACRO.visual} fotos</button>
        </div>
      </section>
      <h2>Examen teórico (tipo test)</h2>
      <div class="grid">
        ${tarjeta("App.practica('teorico')", '', ICO.mezcla, 'Todas las teóricas', TEO.length + ' preguntas mezcladas')}
        ${tarjeta("App.practica('fallosT')", 'c-rosa', ICO.repaso, 'Repasar mis fallos', fT ? fT + ' que fallaste la última vez' : 'Aún no hay fallos', !fT)}
      </div>
      <p class="sub" style="margin:14px 0 8px">O practica un tema:</p>
      <div class="filtros">${chips}</div>
      <h2>Examen visual (fotos)</h2>
      <div class="grid">
        ${tarjeta("App.practica('VIS')", 'c-verde', ICO.ojo, 'Todas las fotos', VIS.length + ' elementos para nombrar')}
        ${tarjeta("App.practica('fallosV')", 'c-rosa', ICO.repaso, 'Repasar mis fallos', fV ? fV + ' que fallaste la última vez' : 'Aún no hay fallos', !fV)}
      </div>
      <h2>Estudio y consulta</h2>
      <div class="grid">
        <a class="card c-naranja" href="guia/"><span class="ico">${ICO.libro}</span><b>Guía de estudio</b><small>Esquema y resumen de los 13 temas, chuleta de cifras y fotos con sus nombres</small></a>
        ${tarjeta('App.lista()', 'c-violeta', ICO.lista, 'Todas con su solución', 'Para repasar con calma')}
        ${tarjeta('App.borrar()', 'c-gris', ICO.papelera, 'Borrar mi progreso', 'Se guarda solo en este navegador')}
      </div>
      <p class="aviso">El material no dice cuántas preguntas tiene cada examen ni la nota de corte: el simulacro usa ${SIMULACRO.teorico} teóricas y ${SIMULACRO.visual} visuales con un corte orientativo del ${CORTE * 100} %. El progreso se guarda en este navegador. Las fotos proceden de material de Sedigas: úsalas solo para estudio personal.</p>`;
    progreso(); scrollTo(0, 0);
  }

  function examen(tipo) {
    let sel;
    if (tipo === 'visual') sel = mezclar(VIS).slice(0, SIMULACRO.visual);
    else {
      // reparto proporcional al peso de cada tema en el banco
      const n = SIMULACRO.teorico, temas = Object.keys(TEMAS).filter(t => t !== 'VIS');
      sel = [];
      temas.forEach(t => { const qs = TEO.filter(q => q.bloque === t); sel = sel.concat(mezclar(qs).slice(0, Math.floor(n * qs.length / TEO.length))); });
      sel = sel.concat(mezclar(TEO.filter(q => !sel.includes(q))).slice(0, n - sel.length));
      sel = mezclar(sel);
    }
    ses = { modo: 'examen', tipo, qs: preparar(sel), i: 0, resp: {} };
    pregunta();
  }

  function practica(f) {
    const qs = f === 'teorico' ? TEO : f === 'fallosT' ? TEO.filter(fallada) : f === 'fallosV' ? VIS.filter(fallada) : P.filter(q => q.bloque === f);
    if (!qs.length) return home();
    ses = { modo: 'practica', qs: preparar(mezclar(qs)), i: 0, resp: {}, aciertos: 0 };
    pregunta();
  }

  function pregunta() {
    const q = ses.qs[ses.i], n = ses.qs.length, r = ses.resp[q.id];
    const corregir = ses.modo === 'practica' && r !== undefined;
    const ops = '<div class="ops">' + q.opciones.map((o, k) => {
      let cls = '';
      if (corregir) { if (o === q.correcta) cls = 'ok'; else if (o === r) cls = 'mal'; }
      else if (ses.modo === 'examen' && r === o) cls = 'ok';
      return `<button class="op ${cls}" ${corregir ? 'disabled' : ''} onclick="App.responder(${k})"><b>${k + 1}.</b> ${esc(o)}</button>`;
    }).join('') + '</div>';
    let sol = '';
    if (corregir) {
      const ok = r === q.correcta;
      sol = `<div class="sol ${ok ? '' : 'mal'}"><b>${ok ? '¡Correcto!' : 'Respuesta correcta: ' + esc(q.correcta)}</b>${esc(q.solucion || '')}</div>`;
    }
    let acciones;
    if (ses.modo === 'practica') acciones = r !== undefined ? `<button class="btn" onclick="App.siguiente()">${ses.i + 1 < n ? 'Siguiente' : 'Ver resumen'}</button>` : '';
    else acciones = `<button class="btn sec" onclick="App.mover(-1)" ${ses.i ? '' : 'disabled'}>Anterior</button>` +
      (ses.i + 1 < n ? `<button class="btn" onclick="App.mover(1)">Siguiente</button>` : `<button class="btn ok" onclick="App.terminar()">Terminar y corregir</button>`);
    const etiqueta = TEMAS[q.bloque] || q.bloque;
    $app.innerHTML = `
      <div class="barra"><i style="width:${100 * (ses.i + (corregir ? 1 : 0)) / n}%"></i></div>
      <div class="q ${q.img ? '' : 'sinimg'}">
        ${q.img ? `<div class="foto" onclick="App.zoom('${q.img}')"><img src="${q.img}" alt="Foto del caso"></div>` : ''}
        <div>
          <div class="meta"><span class="tag">${esc(etiqueta)}</span><span class="num">${ses.i + 1} / ${n}${ses.modo === 'examen' ? ' · simulacro' : ''}</span></div>
          <p class="enunciado">${esc(q.pregunta)}</p>
          ${ops}
          ${sol}
          <div class="acciones">${acciones}<button class="btn sec" onclick="App.salir()">Salir</button></div>
        </div>
      </div>`;
    scrollTo(0, 0);
  }

  function responder(k) {
    const q = ses.qs[ses.i];
    if (ses.modo === 'practica' && ses.resp[q.id] !== undefined) return;
    ses.resp[q.id] = q.opciones[k];
    if (ses.modo === 'practica') { const ok = q.opciones[k] === q.correcta; marcar(q.id, ok); if (ok) ses.aciertos++; }
    pregunta();
  }
  function siguiente() { if (ses.i + 1 < ses.qs.length) { ses.i++; pregunta(); } else resumen(); }
  function mover(d) { ses.i += d; pregunta(); }
  function salir() { if (!ses || ses.modo !== 'examen' || confirm('¿Salir del simulacro? Se perderán las respuestas.')) home(); }

  function terminar() {
    const sinResp = ses.qs.filter(q => ses.resp[q.id] === undefined).length;
    if (sinResp && !confirm(`Te quedan ${sinResp} sin contestar y contarán como fallo. ¿Corregir igualmente?`)) return;
    ses.qs.forEach(q => marcar(q.id, ses.resp[q.id] === q.correcta));
    const qs = ses.qs, nota = qs.filter(q => ses.resp[q.id] === q.correcta).length;
    const apto = nota >= Math.ceil(CORTE * qs.length);
    $app.innerHTML = `
      <div class="resultado ${apto ? 'aprobado' : 'suspenso'}">
        <div class="nota">${nota} / ${qs.length}</div>
        <p>${Math.round(100 * nota / qs.length)} % · ${apto ? 'Por encima' : 'Por debajo'} del corte orientativo (${Math.ceil(CORTE * qs.length)} de ${qs.length}).</p>
        <div class="acciones" style="justify-content:center"><button class="btn" onclick="App.examen('${ses.tipo}')">Otro simulacro</button><button class="btn sec" onclick="App.home()">Inicio</button></div>
      </div>
      <h2>Corrección</h2>
      <ul class="lista">${qs.map((q, k) => {
        const r = ses.resp[q.id], ok = r === q.correcta;
        return `<li>${q.img ? `<img src="${q.img}" alt="" onclick="App.zoom('${q.img}')">` : ''}<div><b>${k + 1}. [${esc(TEMAS[q.bloque] || q.bloque)}]</b> ${esc(q.pregunta)}<div><span class="r ${ok ? 'ok' : 'mal'}">${ok ? 'Bien' : 'Mal'}</span> · Tu respuesta: ${esc(r || 'en blanco')}${ok ? '' : ' · Correcta: <b>' + esc(q.correcta) + '</b>'}</div>${q.solucion ? `<div class="sol" style="margin-top:6px">${esc(q.solucion)}</div>` : ''}</div></li>`;
      }).join('')}</ul>`;
    ses.modo = 'revision';
    scrollTo(0, 0);
  }

  function resumen() {
    const n = ses.qs.length;
    $app.innerHTML = `<div class="resultado ${ses.aciertos / n >= CORTE ? 'aprobado' : 'suspenso'}">
      <div class="nota">${ses.aciertos} / ${n}</div><p>${Math.round(100 * ses.aciertos / n)} % de acierto.</p>
      <div class="acciones" style="justify-content:center"><button class="btn sec" onclick="App.home()">Inicio</button></div></div>`;
  }

  function lista(filtro) {
    filtro = filtro || 'todas';
    const qs = filtro === 'todas' ? P : P.filter(q => q.bloque === filtro);
    const chips = ['todas', ...Object.keys(TEMAS)].map(f => `<button class="chip ${f === filtro ? 'on' : ''}" onclick="App.lista('${f}')">${f === 'todas' ? 'Todas' : esc(TEMAS[f])}</button>`).join('');
    $app.innerHTML = `<h1>Todas las preguntas</h1><div class="filtros">${chips}</div>
      <ul class="lista">${qs.map(q => `<li>${q.img ? `<img src="${q.img}" alt="" onclick="App.zoom('${q.img}')">` : ''}<div><span class="tag">${esc(TEMAS[q.bloque] || q.bloque)}</span> <b>${esc(q.pregunta)}</b><div class="r ok">${esc(q.correcta)}</div>${q.solucion ? `<div>${esc(q.solucion)}</div>` : ''}</div></li>`).join('')}</ul>
      <div class="acciones"><button class="btn sec" onclick="App.home()">Inicio</button></div>`;
    scrollTo(0, 0);
  }

  function borrar() { if (confirm('¿Borrar todo tu progreso guardado en este navegador?')) { est = {}; guardar(); home(); } }
  function zoom(src) { const z = document.getElementById('zoom'); z.querySelector('img').src = src; z.classList.add('on'); }

  document.addEventListener('keydown', e => {
    if (!ses || ses.modo === 'revision') return;
    const q = ses.qs[ses.i];
    if (q && /^[1-9]$/.test(e.key) && +e.key <= q.opciones.length) responder(+e.key - 1);
    else if (e.key === 'Enter' && ses.modo === 'practica' && ses.resp[q.id] !== undefined) siguiente();
  });

  home();
  return { home, examen, practica, responder, siguiente, mover, salir, terminar, lista, borrar, zoom };
})();
