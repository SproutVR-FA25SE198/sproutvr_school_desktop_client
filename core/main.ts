import { app, BrowserWindow } from 'electron';
import path from 'path';

import { isDev } from './util.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js'),
    // },
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:7272');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
  mainWindow.webContents.openDevTools();
});
