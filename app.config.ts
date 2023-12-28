import { ExpoConfig } from '@expo/config-types';
import { ConfigPlugin, withAppDelegate } from 'expo/config-plugins';

const config: ExpoConfig = {
  name: 'wewell',
  slug: 'wewell',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  plugins: [
    [
      'expo-media-library',
      {
        photosPermission: 'Allow wewell to access your photos.',
        savePhotosPermission: 'Allow wewell to save photos.',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'expo-contacts',
      {
        contactsPermission: 'Allow wewell to access your contacts.',
      },
    ],
  ],
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Allow wewell to access your photos.',
      NSPhotoLibraryAddUsageDescription: 'Allow wewell to save photos.',
      NSContactsUsageDescription: 'Allow wewell to access your contacts.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_MEDIA_LOCATION',
      'android.permission.READ_CONTACTS',
      'android.permission.WRITE_CONTACTS',
    ],
    package: 'wewell.com',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    mapKitApiKey: 'bla-bla-bla', // Add your Yandex Maps API key here
  },
};

const withYandexMaps: ConfigPlugin = (config) => {
  return withAppDelegate(config, async (config) => {
    const appDelegate = config.modResults;

    // Add import
    if (!appDelegate.contents.includes("#import <YandexMapsMobile/YMKMapKitFactory.h>")) {
      // Replace the first line with the intercom import
      appDelegate.contents = appDelegate.contents.replace(
        /#import "AppDelegate.h"/g,
        `#import "AppDelegate.h"\n#import <YandexMapsMobile/YMKMapKitFactory.h>`
      );
    }

    const mapKitMethodInvocations = [
      `[YMKMapKit setApiKey:@"${config.extra?.mapKitApiKey}"];`,
      `[YMKMapKit setLocale:@"ru_RU"];`,
      `[YMKMapKit mapKit];`,
    ]
      .map((line) => `\t${line}`)
      .join('\n');

    // Add invocation
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!appDelegate.contents.includes(mapKitMethodInvocations)) {
      appDelegate.contents = appDelegate.contents.replace(
        /\s+return YES;/g,
        `\n\n${mapKitMethodInvocations}\n\n\treturn YES;`
      );
    }

    return config;
  });
};

export default withYandexMaps(config);
