import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { registerGrpcEvents, stopRoomStream } from './ipc/grpc-events.js';
import { loadConfig, getRuntimeConfig } from './config.js';

// Load runtime config from .env file before anything else
loadConfig();

// Handle uncaught exceptions - especially gRPC cancellation errors
process.on('uncaughtException', (error) => {
  // Ignore gRPC cancellation errors
  if (
    error.message?.includes('CANCELLED') ||
    error.message?.includes('Cancelled on client') ||
    (error as any).code === 1
  ) {
    console.log('[INFO] Ignored gRPC cancellation error');
    return;
  }

  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  const error = reason as any;
  // Ignore gRPC cancellation errors
  if (error?.message?.includes('CANCELLED') || error?.message?.includes('Cancelled on client') || error?.code === 1) {
    console.log('[INFO] Ignored gRPC cancellation rejection');
    return;
  }

  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.on('ready', () => {
  // Register IPC handler for runtime config
  ipcMain.handle('get-runtime-config', () => {
    return getRuntimeConfig();
  });

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  registerGrpcEvents(mainWindow);

  // Intercept close event and show confirmation dialog
  mainWindow.on('close', (event) => {
    event.preventDefault();

    dialog
      .showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Hủy', 'Thoát'],
        defaultId: 0,
        cancelId: 0,
        title: 'Xác nhận thoát',
        message: 'Bạn có chắc chắn muốn thoát ứng dụng?',
        detail: 'Mọi phiên học đang hoạt động sẽ bị kết thúc.',
      })
      .then(({ response }) => {
        if (response === 1) {
          // User clicked "Thoát"
          // Stop any active gRPC streams
          stopRoomStream();

          // Force close the window
          mainWindow.destroy();
        }
        // If response === 0 (Hủy), do nothing - window stays open
      });
  });

  if (isDev()) {
    mainWindow.loadURL(getRuntimeConfig().APP_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
});
