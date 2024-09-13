import 'ts-node/register'; // Add this to import TypeScript files
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  userInterfaceStyle: 'automatic',
  name: 'jibli-dz',
  slug: 'jibli-dz',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'myapp',
  splash: {
    image: './src/assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    googleServicesFile: './GoogleService-Info.plist',
    supportsTablet: true,
    bundleIdentifier: 'com.ochentero.jiblidz'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.ochentero.jiblidz',
    googleServicesFile: './google-services.json'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png'
  },
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/crashlytics',
    'expo-router',
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static'
        }
      }
    ],
    [
      'expo-dev-launcher',
      {
        launchMode: 'most-recent'
      }
    ],
    'expo-font',
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share them with your collaborators.'
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'f1b0c2df-ba3e-4efe-91ee-01c4ca5331f4'
    }
  },
  owner: 'ochentero'
};

export default config;
