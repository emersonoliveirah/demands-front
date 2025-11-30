// File: `main.js` (improved)
// Language: javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

const isDev = process.env.ELECTRON_DEV === 'true' || process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let timerWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  if (isDev) {
    // Dev: load angular dev server
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    // Prod: load the compiled Angular app; adjust folder names if build output differs
    const indexPath = url.format({
      pathname: path.join(__dirname, 'dist', 'login-page', 'browser', 'index.html'),
      protocol: 'file:',
      slashes: true,
    });
    mainWindow.loadURL(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTimerWindow() {
  timerWindow = new BrowserWindow({
    width: 200,
    height: 100,
    alwaysOnTop: true,
    focusable: false,
    frame: false,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    fullscreenable: false,
    hasShadow: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
    },
  });

  if (isDev) {
    timerWindow.loadURL('http://localhost:4200/timer'); // ensure route exists in dev
    timerWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const timerPath = url.format({
      pathname: path.join(__dirname, 'dist', 'login-page', 'browser', 'timer.html'),
      protocol: 'file:',
      slashes: true,
    });
    timerWindow.loadURL(timerPath);
  }

  timerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  timerWindow.setBounds({
    x: Math.round((width - 200) / 2),
    y: Math.round((height - 100) / 2),
    width: 200,
    height: 100,
  });

  timerWindow.on('closed', () => {
    timerWindow = null;
  });
}

// IPC handlers
ipcMain.on('start-timer-window', () => {
  if (!timerWindow) createTimerWindow();
});

ipcMain.on('stop-timer-window', () => {
  if (timerWindow) timerWindow.close();
});

ipcMain.on('submit-timer-data', (event, data) => {
  console.log('Dados do timer recebidos:', data);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('timer-data-from-widget', data);
  }
});

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
