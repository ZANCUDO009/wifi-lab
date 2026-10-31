# Generar el APK de Wi-Fi Lab (Android)

## Una sola vez: instalar herramientas
1. **Node.js LTS** → https://nodejs.org
2. **Android Studio** → https://developer.android.com/studio (incluye el JDK y el SDK de Android; acepta las licencias al abrirlo la primera vez).

## Generar el APK
Abre una terminal dentro de la carpeta `android-apk` y ejecuta:
```
npm install
npm run add        (solo la primera vez: crea la carpeta android/)
npm run sync       (copia el simulador al proyecto Android)
npm run abrir      (abre Android Studio)
```
En Android Studio: menú **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
Al terminar pulsa *locate*: el archivo es `android/app/build/outputs/apk/debug/app-debug.apk`.

(Alternativa por terminal, tras `npm run add`: `npm run apk`; en Windows necesita `JAVA_HOME` apuntando al JDK de Android Studio.)

## Instalarlo en tu teléfono
Pasa el `app-debug.apk` al teléfono (cable, Drive, WhatsApp…), ábrelo y permite «instalar apps de origen desconocido».
Es un APK de depuración: sirve para uso personal y pruebas. Para Play Store hace falta firmarlo (Build → Generate Signed Bundle).

## Cada vez que cambies el simulador
`npm run sync` y volver a construir el APK.

## Limitaciones conocidas del WebView
- Los botones de exportar/descargar archivos (`<a download>`) no funcionan dentro de la app; hay que usar los plugins Filesystem/Share de Capacitor (pendiente).
- El icono de la app es el de Android por defecto; para usar el tuyo, genera los recursos con `@capacitor/assets` a partir de `assets/pwa/icon-512.png`.
