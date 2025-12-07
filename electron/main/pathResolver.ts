import { app } from 'electron';
import path from 'path';
import { isDev } from './util.js';

export function getPreloadPath(): string {
  if (isDev()) {
    return path.join(app.getAppPath(), 'dist-electron', 'preload', 'preload.cjs');
  } else {
    // In production, app.getAppPath() points to the asar archive
    // The preload script is inside the asar at dist-electron/preload/preload.cjs
    return path.join(app.getAppPath(), 'dist-electron', 'preload', 'preload.cjs');
  }
}
