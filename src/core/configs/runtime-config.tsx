import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RuntimeConfig } from './electron.d';

/**
 * Runtime Configuration Context
 * 
 * This context provides access to configuration values that can be modified
 * after the app is exported. The configuration is loaded from .env file
 * in the app's resources folder (when packaged) or project root (in dev).
 * 
 * Usage:
 * 1. Wrap your app with <RuntimeConfigProvider>
 * 2. Use the useRuntimeConfig() hook to access config values
 * 
 * Example:
 *   const { config, isLoading } = useRuntimeConfig();
 *   if (!isLoading) {
 *     console.log(config.BASE_URL);
 *   }
 */

// Default fallback values (used during loading or in browser environment)
const defaultConfig: RuntimeConfig = {
  PROVIDER_URL: import.meta.env.VITE_PROVIDER_URL || '',
  SCHOOL_URL: import.meta.env.VITE_SCHOOL_URL || '',
  APK_DOWNLOAD_URL: import.meta.env.VITE_APK_DOWNLOAD_URL || '',
  BASE_URL: import.meta.env.VITE_BASE_URL || '',
  GRPC_SERVER_URL: import.meta.env.VITE_GRPC_SERVER_URL || '',
  AGENT_LOCATION: import.meta.env.VITE_AGENT_LOCATION || 'global',
  AGENT_LANGUAGE: import.meta.env.VITE_AGENT_LANGUAGE || 'en',
  PROJECT_ID: import.meta.env.VITE_PROJECT_ID || '',
  AGENT_ID: import.meta.env.VITE_AGENT_ID || '',
  LOGO: import.meta.env.VITE_LOGO || '',
};

interface RuntimeConfigContextValue {
  config: RuntimeConfig;
  isLoading: boolean;
  error: Error | null;
  reloadConfig: () => Promise<void>;
}

const RuntimeConfigContext = createContext<RuntimeConfigContextValue>({
  config: defaultConfig,
  isLoading: true,
  error: null,
  reloadConfig: async () => {},
});

interface RuntimeConfigProviderProps {
  children: ReactNode;
}

export function RuntimeConfigProvider({ children }: RuntimeConfigProviderProps) {
  const [config, setConfig] = useState<RuntimeConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if running in Electron environment
      if (window.electron?.getRuntimeConfig) {
        const runtimeConfig = await window.electron.getRuntimeConfig();
        console.log('[RuntimeConfig] Loaded from Electron:', runtimeConfig);
        setConfig(runtimeConfig);
      } else {
        // Fallback to build-time env vars (for browser development)
        console.log('[RuntimeConfig] Using build-time env vars (not in Electron)');
        setConfig(defaultConfig);
      }
    } catch (err) {
      console.error('[RuntimeConfig] Failed to load config:', err);
      setError(err instanceof Error ? err : new Error('Failed to load config'));
      // Keep using default config on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const value: RuntimeConfigContextValue = {
    config,
    isLoading,
    error,
    reloadConfig: loadConfig,
  };

  return (
    <RuntimeConfigContext.Provider value={value}>
      {children}
    </RuntimeConfigContext.Provider>
  );
}

/**
 * Hook to access runtime configuration.
 * 
 * @returns {RuntimeConfigContextValue} The config object, loading state, and error if any
 * 
 * @example
 * const { config, isLoading } = useRuntimeConfig();
 * 
 * if (isLoading) return <Loading />;
 * 
 * // Use config.BASE_URL, config.SCHOOL_URL, etc.
 */
export function useRuntimeConfig(): RuntimeConfigContextValue {
  const context = useContext(RuntimeConfigContext);
  if (!context) {
    throw new Error('useRuntimeConfig must be used within a RuntimeConfigProvider');
  }
  return context;
}

/**
 * Get the current runtime config synchronously.
 * WARNING: This may return default values if config hasn't loaded yet.
 * Prefer using useRuntimeConfig() hook for reactive updates.
 */
let cachedConfig: RuntimeConfig = defaultConfig;

export async function initializeRuntimeConfig(): Promise<RuntimeConfig> {
  if (window.electron?.getRuntimeConfig) {
    try {
      cachedConfig = await window.electron.getRuntimeConfig();
      console.log('[RuntimeConfig] Initialized:', cachedConfig);
    } catch (err) {
      console.error('[RuntimeConfig] Failed to initialize:', err);
    }
  }
  return cachedConfig;
}

export function getRuntimeConfigSync(): RuntimeConfig {
  return cachedConfig;
}

export { defaultConfig };
