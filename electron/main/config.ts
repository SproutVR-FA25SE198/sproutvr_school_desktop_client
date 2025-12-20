import { app } from 'electron';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Runtime configuration loader for Electron.
 * Loads configuration from .env file in resources directory when packaged,
 * or from project root in development.
 *
 * This allows users to modify endpoints after the app is exported by editing
 * the .env file in the app's resources folder.
 */

// Determine the path to .env based on whether the app is packaged
export function getEnvPath(): string {
  return app.isPackaged ? path.join(process.resourcesPath, '.env') : path.join(process.cwd(), '.env');
}

// Load environment variables from .env file
export function loadConfig(): void {
  const envPath = getEnvPath();
  console.log('📁 Loading config from:', envPath);
  console.log('📦 Is packaged:', app.isPackaged);
  dotenv.config({ path: envPath });
}

// Runtime configuration interface
export interface RuntimeConfig {
  PROVIDER_URL: string;
  SCHOOL_URL: string;
  APK_DOWNLOAD_URL: string;
  BASE_URL: string;
  GRPC_SERVER_URL: string;
  AGENT_LOCATION: string;
  AGENT_LANGUAGE: string;
  PROJECT_ID: string;
  AGENT_ID: string;
  LOGO: string;
}

/**
 * Get the runtime configuration.
 * Call loadConfig() before calling this function.
 */
export function getRuntimeConfig(): RuntimeConfig {
  return {
    PROVIDER_URL: process.env.PROVIDER_URL || '',
    SCHOOL_URL: process.env.SCHOOL_URL || '',
    APK_DOWNLOAD_URL: process.env.APK_DOWNLOAD_URL || '',
    BASE_URL: process.env.SCHOOL_URL || '',
    GRPC_SERVER_URL: process.env.GRPC_SERVER_URL || '',
    AGENT_LOCATION: process.env.AGENT_LOCATION || 'global',
    AGENT_LANGUAGE: process.env.AGENT_LANGUAGE || 'en',
    PROJECT_ID: process.env.PROJECT_ID || '',
    AGENT_ID: process.env.AGENT_ID || '',
    LOGO: process.env.LOGO || '',
  };
}
