import { themes } from '@/constants/themes';
import { config } from '@tamagui/config/v3';

import { createTamagui } from 'tamagui'; // or '@tamagui/core'
const appConfig = createTamagui({ ...config, themes: themes });
export type AppConfig = typeof appConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
export default appConfig;
