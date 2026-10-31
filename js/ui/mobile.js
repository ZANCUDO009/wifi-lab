/* Móvil: fondo que cierra la hoja inferior al tocar fuera, y botón de tema en la botonera. */
(function () {
  var L = document.getElementById('L'), R = document.getElementById('R'), dock = document.getElementById('dock');
  if (!L || !R) return;
  var scrim = document.createElement('div'); scrim.id = 'scrim'; scrim.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scrim);
  function sync() { scrim.classList.toggle('show', L.classList.contains('open') || R.classList.contains('open')); }
  var mo = new MutationObserver(sync);
  mo.observe(L, { attributes: true, attributeFilter: ['class'] });
  mo.observe(R, { attributes: true, attributeFilter: ['class'] });
  scrim.addEventListener('click', function () { L.classList.remove('open'); R.classList.remove('open'); sync(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && scrim.classList.contains('show')) scrim.click(); });
  if (dock && !dock.querySelector('[data-a="theme"]')) {
    var b = document.createElement('button'); b.setAttribute('data-a', 'theme'); b.setAttribute('aria-label', 'Elegir tema visual'); b.textContent = '◐ Tema';
    dock.appendChild(b);
  }
})();
