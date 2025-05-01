const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  const indexPath = url.format({
    pathname: path.join(__dirname, 'dist', 'login-page', 'browser', 'index.html'),
    protocol: 'file:',
    slashes: true,
  });

  win.loadURL(indexPath);

  // Abre o DevTools para debug
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
