import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'KPDN_APPS',
  webDir: 'dist',
  server: {
    allowNavigation: [
      'localhost',            // Allow navigation to localhost for testing
      '203.142.6.113',        // Allow your local API IP (adjust as necessary)
    ],
  },
};

export default config;
