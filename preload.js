const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startTimerWindow: () => ipcRenderer.send('start-timer-window'),
  stopTimerWindow: () => ipcRenderer.send('stop-timer-window'),
  submitTimerData: (data) => ipcRenderer.send('submit-timer-data', data),
  receiveTimerData: (callback) => ipcRenderer.on('timer-data-from-widget', callback)
});

