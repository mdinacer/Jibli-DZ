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
    bundleIdentifier: 'com.ochentero.jiblidz',
    entitlements: {
      'aps-environment': 'production'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    icon: './src/assets/images/icon.png',
    package: 'com.ochentero.jiblidz',
    googleServicesFile: './google-services.json'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png'
  },
  plugins: [
    'expo-localization',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/messaging',
    '@react-native-firebase/crashlytics',
    'expo-router',
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme:
          'com.googleusercontent.apps.870726891421-2mudv1jjq6coatqr9aeu236536oo7q9g'
      }
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '17.5'
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
    supportsRTL: true,
    router: {
      origin: false
    },
    eas: {
      projectId: 'f1b0c2df-ba3e-4efe-91ee-01c4ca5331f4'
    }
  },
  owner: 'ochentero',
  assetBundlePatterns: ['assets/fonts/*']
};

export default config;
