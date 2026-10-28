import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.herlife.app',
  appName: 'HER LIFE',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_launcher_round',
      iconColor: '#C26D5C',
      sound: 'sound_default.wav'
    }
  }
};

export default config;
