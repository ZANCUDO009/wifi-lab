/* Wi-Fi Lab · Service worker
   Estrategia: RED PRIMERO, caché de respaldo.
   - Con internet: siempre carga la versión más reciente (y la guarda).
   - Sin internet: usa lo guardado, así que la app funciona offline.
   Si cambias la lista de archivos, sube también VERSION para limpiar cachés viejas. */
const VERSION = 'wifilab-v3';
const PRECACHE = [
  "./",
  "assets/icons/devices/clients.js",
  "assets/icons/devices/equipos_v2.js",
  "assets/icons/devices/routers.js",
  "assets/icons/materials/materiales.js",
  "assets/icons/ui/_emoji-map.js",
  "assets/icons/ui/acciones.js",
  "assets/icons/ui/educacion.js",
  "assets/icons/ui/estado.js",
  "assets/icons/ui/fisica.js",
  "assets/icons/ui/medios.js",
  "assets/pwa/apple-touch-icon.png",
  "assets/pwa/icon-192.png",
  "assets/pwa/icon-512.png",
  "assets/pwa/icon-maskable-512.png",
  "assets/textures/_plantilla.js",
  "assets/textures/body.js",
  "assets/textures/brick.js",
  "assets/textures/brick_white.js",
  "assets/textures/concrete.js",
  "assets/textures/drywall.js",
  "assets/textures/false_ceiling.js",
  "assets/textures/floor_carpet.js",
  "assets/textures/floor_concrete.js",
  "assets/textures/floor_tile.js",
  "assets/textures/floor_wood.js",
  "assets/textures/glass.js",
  "assets/textures/glass_film.js",
  "assets/textures/glass_tempered.js",
  "assets/textures/green_wall.js",
  "assets/textures/marble.js",
  "assets/textures/mesh.js",
  "assets/textures/metal.js",
  "assets/textures/plaster.js",
  "assets/textures/wood.js",
  "assets/textures/wood_dark.js",
  "assets/textures/wood_glass.js",
  "css/01-tokens.css",
  "css/02-base.css",
  "css/03-header.css",
  "css/04-layout.css",
  "css/05-results.css",
  "css/06-overlays.css",
  "css/07-modals.css",
  "css/08-responsive.css",
  "css/09-icons.css",
  "css/10-pro.css",
  "css/11-mobile.css",
  "index.html",
  "js/core/physics.js",
  "js/core/scene-io.js",
  "js/core/state.js",
  "js/data/materials.js",
  "js/data/presets.js",
  "js/education/experiments.js",
  "js/education/glossary.js",
  "js/education/logbook.js",
  "js/education/missions.js",
  "js/education/myths.js",
  "js/education/predict.js",
  "js/education/presenter.js",
  "js/education/quiz.js",
  "js/education/scripts-demos-survey.js",
  "js/education/tour.js",
  "js/education/welcome.js",
  "js/engine/contours.js",
  "js/engine/heatmap-engine.js",
  "js/features/comparator.js",
  "js/features/costs-report.js",
  "js/features/exports.js",
  "js/features/imported-plan.js",
  "js/features/lab.js",
  "js/features/limits-and-tests.js",
  "js/features/measurements.js",
  "js/features/optimizer.js",
  "js/features/physics-inspector.js",
  "js/features/sonification.js",
  "js/features/versions-help.js",
  "js/interaction/attract-mode.js",
  "js/interaction/boot.js",
  "js/interaction/feria-mode.js",
  "js/interaction/input.js",
  "js/interaction/main-loop.js",
  "js/interaction/recompute.js",
  "js/render/draw2d.js",
  "js/render/draw3d.js",
  "js/render/fx.js",
  "js/render/heatmap-paint.js",
  "js/render/icons.js",
  "js/render/minimap-legend.js",
  "js/render/textures.js",
  "js/render/view.js",
  "js/tests/tests.js",
  "js/ui/actions.js",
  "js/ui/changes.js",
  "js/ui/charts.js",
  "js/ui/controls.js",
  "js/ui/menus.js",
  "js/ui/mobile.js",
  "js/ui/modal-help.js",
  "js/ui/polish.js",
  "js/ui/results.js",
  "js/ui/viz.js",
  "manifest.webmanifest"
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
