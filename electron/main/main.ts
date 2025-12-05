import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { registerGrpcEvents } from './ipc/grpc-events.js';

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
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  mainWindow.setFullScreen(true);

  registerGrpcEvents(mainWindow);

  if (isDev()) {
    mainWindow.loadURL('http://localhost:7272');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
});
