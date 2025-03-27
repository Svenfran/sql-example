import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.svenfran.sqliteexample',
  appName: 'Todo-App',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false
    }
  }
};

export default config;
