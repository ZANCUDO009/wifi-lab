// Wi-Fi Lab · ventana de escritorio (Electron). Sirve los archivos con un protocolo propio (app://)
// para que la política de seguridad (CSP 'self'), los Web Workers y localStorage funcionen igual que en el navegador.
const { app, BrowserWindow, protocol, net, shell } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function crear() {
  win = new BrowserWindow({
    width: 1400, height: 880, minWidth: 900, minHeight: 600,
    backgroundColor: '#0a111d', autoHideMenuBar: true, title: 'Wi-Fi Lab',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  win.loadURL('app://wifilab/index.html');
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('app://')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); } });
}

app.whenReady().then(() => {
  const raiz = path.resolve(__dirname, '..');
  protocol.handle('app', req => {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p === '/' || p === '') p = '/index.html';
    const f = path.normalize(path.join(raiz, p));
    if (!f.startsWith(raiz)) return new Response('Prohibido', { status: 403 });
    return net.fetch(pathToFileURL(f).toString());
  });
  crear();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) crear(); });
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => app.quit());
