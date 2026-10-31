# Wi-Fi Lab · BETA 6 + mejoras visuales (proyecto dividido)

Simulador de propagación, reflexión y atenuación de ondas Wi-Fi.
Es el mismo simulador del archivo único `BETA_6.html`, ahora repartido en carpetas para
trabajarlo desde Visual Studio Code. **Funciona sin internet** (no usa ninguna librería externa).

---

## ▶ Cómo ejecutarlo

### Opción recomendada: Live Server (VS Code)
1. Abre VS Code → **Archivo → Abrir carpeta…** y elige la carpeta `wifi-lab`.
2. Instala la extensión **Live Server** (autor *Ritwick Dey*). VS Code te la sugerirá solo al abrir la carpeta.
3. Clic derecho sobre `index.html` → **Open with Live Server**
   (o el botón **Go Live** abajo a la derecha).
4. Se abre el navegador. Cada vez que guardes un archivo, la página se recarga sola.

### Alternativas
- **Doble clic en `index.html`**: también funciona (el proyecto no necesita servidor), pero no se recarga solo
  y algunos navegadores limitan funciones como exportar imágenes si usas texturas PNG propias.
- **Con Python** (si lo tienes instalado), en una terminal dentro de la carpeta:
  `python -m http.server 8000` y abre <http://localhost:8000>.

### Libro de estilo (`galeria.html`)
Abre `galeria.html` de la misma forma (Live Server). Muestra los 5 temas, la tipografía, los componentes,
todas las texturas (a 128/256/512 px y sobre una pared 3D), los suelos y todos los iconos, con una **auditoría
automática de iconos**. Editas un archivo, guardas y ves el resultado **sin abrir el simulador**.

---

## 📁 Estructura

```
wifi-lab/
├── index.html              Página principal (estructura HTML + lista de archivos que se cargan)
├── galeria.html            Previsualizador de texturas e iconos
├── css/                    Estilos, uno por zona (tokens/colores, cabecera, paneles, modales, móvil, iconos)
├── js/
│   ├── data/
│   │   ├── materials.js    ★ Materiales y sus propiedades FÍSICAS (pérdida en dB, reflexión…)
│   │   └── presets.js      Escenarios predefinidos (departamento, oficina, hotel…)
│   ├── core/
│   │   ├── physics.js      Motor de física (funciones puras; no toca la pantalla)
│   │   ├── state.js        Estado único del simulador (objeto S), tema, utilidades
│   │   └── scene-io.js     Guardar/cargar escenarios, deshacer/rehacer, versiones, bitácora
│   ├── engine/             Mapa de calor (Web Worker) y curvas de nivel
│   ├── render/
│   │   ├── textures.js     ★ Motor de texturas (genera y reparte las texturas con canvas)
│   │   ├── icons.js        ★ Motor de iconos
│   │   ├── fx.js           ★ Calidad/movimiento, habitaciones, uniones de paredes, tipo de abertura, paletas del mapa
│   │   ├── draw2d.js       Dibujo del plano 2D (suelo, paredes con sombra, puertas/ventanas, dispositivos, ondas)
│   │   ├── draw3d.js       Vista 3D (paredes con grosor, aberturas, superficie de señal, cámara con inercia)
│   │   └── …               vista/zoom, pintura del mapa de calor, minimapa y leyenda
│   ├── ui/                 Paneles, menús, resultados, gráficos, acciones y eventos; viz.js (medidor, KPI) y polish.js (temas, sliders)
│   ├── features/           Laboratorio, mediciones, optimizador de AP, costos e informe, exportar, comparador…
│   ├── education/          Tour, misiones, quiz, mitos, experimentos, glosario, modo presentador
│   ├── interaction/        Ratón/tacto/teclado, bucle principal, modo atracción, modo feria, arranque
│   └── tests/tests.js      Pruebas automáticas del motor (botón «Pruebas del motor» en Física)
└── assets/
    ├── textures/           ★ UNA textura por material (brick.js…), suelos (floor_*.js) + _plantilla.js + _ejemplo_png.md
    ├── fonts/              (opcional) Inter-Variable.woff2 — ver LEEME.txt
    └── icons/
        ├── ui/             Iconos de botones y menús (+ _emoji-map.js)
        ├── devices/        Iconos de routers, repetidores y equipos cliente (se ven en el plano 2D/3D)
        └── materials/      Un icono por material
```

> **Importante:** los `.js` son scripts normales que comparten las mismas variables globales
> (igual que cuando era un solo archivo). **El orden de los `<script>` en `index.html` importa**
> — no lo reordenes. Si agregas un archivo nuevo, ponlo en el bloque que le corresponde.

---

## 🧩 Cómo modificar cada parte

### Agregar un material nuevo (ej. «mármol») con su textura
1. **Propiedades físicas** — en `js/data/materials.js` añade una línea:
   ```js
   marmol: { n: 'Mármol', l: 14, g: .55, e: 8, th: 3, c: '#e9e4f0', sg: .001 },
   ```
   (el archivo explica cada campo). Con esto ya aparece en el menú de materiales y participa en la simulación.
2. **Textura** — copia `assets/textures/_plantilla.js` como `assets/textures/marmol.js`,
   cambia `'MI_ID'` por `'marmol'` y dibuja lo que quieras con canvas (la plantilla lista las ayudas disponibles).
3. **Cárgala** — en `index.html` (bloque «TEXTURAS») y en `galeria.html` agrega:
   ```html
   <script src="assets/textures/marmol.js"></script>
   ```
4. *(Opcional)* **Icono** — en `assets/icons/materials/materiales.js` añade
   `Icons.add('materials', 'marmol', '<path …/>');`

Si te saltas el paso 2, el material funciona igual con una textura genérica de su color.

### Usar una imagen tuya (PNG/JPG) en vez de dibujar la textura
Guarda la imagen (cuadrada, que se repita bien) en `assets/textures/` y escribe el archivo así:
```js
Textures.define('marmol', { image: 'assets/textures/marmol.png', tile: 1, alpha: .95 });
```

### Cambiar el aspecto de una textura existente
Edita su archivo en `assets/textures/` (por ejemplo `brick.js`), guarda y mira `galeria.html`.
`tile` = cuántos metros cubre la textura; `alpha` = opacidad en 3D (vidrio ≈ .55).

### Cambiar o agregar iconos
- **Botones y menús**: `assets/icons/ui/`. El simulador original usaba emojis; `_emoji-map.js` indica por
  qué icono se reemplaza cada uno. Para cambiar el icono de un botón, cambia el nombre a la derecha del emoji.
- **Dispositivos en el plano**: `assets/icons/devices/`. El router principal usa `router`, un AP de techo usa
  `ap_ceiling`, un nodo mesh `mesh`, un repetidor `repeater`, un interferente `interferer`;
  el receptor cambia según el perfil de cliente (`laptop`, `phone`, `iot`, `usb`, `cam`).
  La tabla equipo → icono está en `js/render/draw2d.js` (`DEV_ICON`).
- Los iconos son SVG de 24×24 (`viewBox`) con trazo `currentColor`. Edítalos en VS Code y recarga.

### Agregar un escenario predefinido (plano)
`js/data/presets.js` — copia uno de los existentes y cambia paredes, posición del router (`tx`) y del receptor (`rx`).
Después añade su nombre donde se listan los escenarios (menú «Tipo de recinto» en `js/ui/controls.js`
se llena a partir de `PRE`).

### ¿Dónde está…?
| Quiero cambiar…                              | Archivo                                  |
|----------------------------------------------|------------------------------------------|
| Fórmulas de propagación, pérdidas, KPIs       | `js/core/physics.js`                     |
| Colores / tema oscuro-claro                   | `css/01-tokens.css`                      |
| Cómo se dibujan las paredes en 2D             | `js/render/draw2d.js`                    |
| Cómo se ve la vista 3D                        | `js/render/draw3d.js`                    |
| Botones y menús de la barra superior          | `js/ui/menus.js` y `index.html`          |
| Paneles laterales (controles)                 | `js/ui/controls.js`                      |
| Panel de resultados                           | `js/ui/results.js`                       |
| Costos e informe ejecutivo                    | `js/features/costs-report.js`            |
| Misiones, quiz, tour                          | `js/education/`                          |
| Arrastrar, zoom, teclado                      | `js/interaction/input.js`                |

---

## 🎨 Mejoras visuales (resumen; detalle en `docs/CAMBIOS_VISUALES.md`)
- **Interfaz:** 5 temas (oscuro, claro, alto contraste, **neón**, **plano/blueprint**) con selector de miniaturas; paneles con
  profundidad y vidrio; botones, sliders (con burbuja de valor), casillas y selects uniformes; iconos en cada sección;
  indicador de pestaña deslizante y estado «Listo / Calculando…».
- **Plano 2D:** suelo con textura según el recinto, habitaciones coloreadas, cuadrícula de puntos, paredes con grosor, sombra y
  remates en esquinas, **puertas / ventanas / pasos** como símbolos de arquitectura, dispositivos con halo según potencia e
  insignias (★ principal, ϟ interferente, apagado), ondas con brillo e impactos, mapa de calor suavizado con 3 paletas,
  isolíneas legibles, anillos de alcance, leyenda con degradado y flecha que sigue al cursor.
- **Vista 3D:** paredes con volumen y sombreado por cara, puertas con hoja entreabierta, ventanas con vidrio, suelo con losa y
  textura, sombras de contacto, fondo de estudio, mapa de calor como **plano o superficie con relieve** (control de exageración),
  modelos de routers/laptops, ondas esféricas, cámara con **inercia**, zoom suave, vistas Isométrica/Cenital/Frontal y órbita.
- **Resultados:** medidor semicircular con aguja animada, insignia de calidad con icono, tarjetas KPI con flecha de tendencia,
  barra apilada de cobertura, línea de tiempo del proceso físico, gráficos con degradados y marcadores al pasar el ratón.
- **Texturas v2:** relieve simulado (bump), variantes por pared, 3 resoluciones, 8 materiales nuevos y 4 suelos.
- **Rendimiento y accesibilidad:** capas en caché (2D y 3D), modo rápido al girar, ~20 fps con la animación en pausa,
  *Capas → Reducir movimiento* (también respeta `prefers-reduced-motion`), foco visible, tamaños táctiles.

Todo efecto se apaga solo con calidad **Baja** o «Reducir movimiento». Ajustes nuevos: *Capas* (suelo, habitaciones, anillos,
brillo, partículas, estela), *Mapa de calor → Paleta de color*, panel *Escenario → Suelo del recinto*,
panel *Paredes → Material de las paredes nuevas*.

## 🔧 Qué cambió respecto al archivo original
- El código se dividió **sin alterar su lógica** (el contenido de los `.js` es el mismo, solo repartido).
- `physics.js` ahora es una *fábrica* (`PhysFactory`) y los materiales salen de `js/data/materials.js`;
  así el Web Worker del mapa de calor recibe también los materiales que tú añadas.
- Paredes 2D/3D con texturas; dispositivos con iconos (2D y 3D); emojis de la interfaz → iconos SVG.
- La política de seguridad (CSP) de `index.html` ahora permite cargar los archivos propios del proyecto
  (`script-src 'self'`) y sigue bloqueando cualquier conexión externa.

## 🧪 Pruebas
Menú **Física → Pruebas del motor** ejecuta las 55 pruebas automáticas (deben salir todas en verde; los 8 materiales nuevos también las cumplen).
También puedes escribir `WifiSim.Tests.run()` en la consola del navegador (F12).

---

## 📲 Instalar como aplicación (PWA)

El simulador es una PWA: se puede instalar en PC (y más adelante en móvil) y funciona **sin internet** después de la primera visita.

**Requisito:** debe servirse por **HTTPS** (o `localhost`). No funciona abriendo el archivo con doble clic (`file://`).

### Publicarla gratis (elige una)
- **GitHub Pages**: sube la carpeta a un repositorio → Settings → Pages → rama `main`, carpeta `/ (root)`.
- **Netlify Drop** (<https://app.netlify.com/drop>): arrastra la carpeta `wifi-lab` y te da un enlace HTTPS.
- **Cloudflare Pages**: conecta el repositorio o sube la carpeta.

### Instalar (usuarios)
- **Chrome / Edge (PC):** icono de instalar en la barra de direcciones (o menú ⋮ → *Instalar Wi-Fi Lab*).
- **Android (Chrome):** menú ⋮ → *Instalar aplicación*.
- **iPhone/iPad (Safari):** Compartir → *Añadir a pantalla de inicio*.

### Instalarla solo para ti (sin publicar)
1. Abre la carpeta con Live Server (o `python -m http.server 8000`).
2. Entra una vez a `http://127.0.0.1:5500/index.html?pwa=1` (o `http://localhost:8000/index.html?pwa=1`). Esto activa la PWA en tu equipo y queda recordado.
3. En Chrome/Edge pulsa el icono de instalar de la barra de direcciones y acepta crear el acceso directo en el escritorio.
Después la app abre sola, sin servidor y sin internet. Para desactivarla: `?pwa=0`.

### Archivos de la PWA
`manifest.webmanifest` (nombre, colores, iconos) · `sw.js` (funcionamiento offline) · `js/pwa-register.js` · `assets/pwa/` (iconos).
Estrategia: **red primero, caché de respaldo** → con internet siempre ves la última versión; sin internet usa la guardada.
Si agregas o quitas archivos, actualiza la lista `PRECACHE` en `sw.js` y sube `VERSION` (`wifilab-v2`…).
