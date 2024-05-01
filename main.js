const { app, BrowserWindow, ipcMain } = require('electron');
const { updateElectronApp } = require('update-electron-app');
const path = require('path');
const packageJson = require('./package.json');

updateElectronApp();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  const handlePingChannel = () => ({
    appVersion: packageJson.version
  });
  ipcMain.handle('ping', handlePingChannel);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});