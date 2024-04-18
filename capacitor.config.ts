import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'language-interpreter',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;
