/* Registro del service worker (PWA). Va en archivo aparte porque la CSP no permite scripts en línea.
   En localhost (Live Server) NO se registra por defecto, para que los cambios se vean siempre al recargar.
   - Abre  ...index.html?pwa=1  una vez para activar la PWA en este equipo (queda recordado).
   - Abre  ...index.html?pwa=0  para desactivarla y borrar el service worker.
   La app ya instalada (ventana propia) siempre mantiene el service worker activo. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  var KEY = 'wifilab-pwa', local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var on = !local;
  try {
    if (/[?&]pwa=1/.test(location.search)) localStorage.setItem(KEY, '1');
    if (/[?&]pwa=0/.test(location.search)) localStorage.removeItem(KEY);
    if (local && (localStorage.getItem(KEY) === '1' || (window.matchMedia && matchMedia('(display-mode: standalone)').matches))) on = true;
  } catch (e) { if (local && /[?&]pwa=1/.test(location.search)) on = true; }
  if (!on) {
    navigator.serviceWorker.getRegistrations().then(function (rs) { rs.forEach(function (r) { r.unregister(); }); });
    return;
  }
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('PWA: no se pudo registrar', e); });
  });
})();
