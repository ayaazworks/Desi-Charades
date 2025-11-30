import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.indiacharadespartygame.app',
  appName: 'Indian Charades: Party Game',
  webDir: 'build',

  plugins: {
    AdMob: {
      /**
       * DO NOT use real ad unit IDs here.
       * These are plugin configurations, not ad IDs.
       */
      appId: {
        android: "ca-app-pub-4060071785789817~2887358108",
        ios: "ca-app-pub-4060071785789817~7213615920"
      },
      // Optional defaults for banners
      adSize: 'BANNER',
      position: 'BOTTOM_CENTER',
      margin: 0,
      isTesting: false
    }
  }
};

export default config;
