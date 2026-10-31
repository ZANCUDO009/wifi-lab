// Copia la web del simulador (carpeta superior) a android-apk/www, sin docs ni archivos de la PWA/servidor.
const fs = require('fs'), path = require('path');
const src = path.resolve(__dirname, '..', '..'), dst = path.resolve(__dirname, '..', 'www');
const skip = new Set(['android-apk', 'docs', '.vscode', 'sw.js', 'manifest.webmanifest', 'galeria.html', 'README.md', 'node_modules']);
fs.rmSync(dst, { recursive: true, force: true });
(function cp(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const f of fs.readdirSync(a)) {
    if (a === src && skip.has(f)) continue;
    const s = path.join(a, f), d = path.join(b, f);
    fs.statSync(s).isDirectory() ? cp(s, d) : fs.copyFileSync(s, d);
  }
})(src, dst);
console.log('Web copiada en', dst);
