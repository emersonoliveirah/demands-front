const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let timerWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const indexPath = url.format({
    pathname: path.join(__dirname, 'dist', 'login-page', 'browser', 'index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(indexPath);
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTimerWindow() {
  timerWindow = new BrowserWindow({
    width: 200,
    height: 100,
    alwaysOnTop: true, // Keeps the window on top
    focusable: false, // Prevents stealing focus
    frame: false, // Frameless window
    resizable: false,
    movable: true,
    skipTaskbar: true, // Removes from taskbar
    fullscreenable: false, // Prevents fullscreen
    hasShadow: false, // Removes shadow
    backgroundColor: '#00000000', // Transparent background
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const timerPath = url.format({
    pathname: path.join(__dirname, 'dist', 'login-page', 'browser', 'timer.html'),
    protocol: 'file:',
    slashes: true,
  });

  timerWindow.loadURL(timerPath);

  // Ensure the window is visible on all workspaces
  timerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Center the window on the screen
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
  if (!timerWindow) {
    createTimerWindow();
  }
});

ipcMain.on('stop-timer-window', () => {
  if (timerWindow) {
    timerWindow.close();
  }
});

ipcMain.on('submit-timer-data', (event, data) => {
  console.log('Dados do timer recebidos:', data);

  // Repassa os dados para o renderer principal (formulário)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('timer-data-from-widget', data);
  }
});


// Prevent multiple instances
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
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
