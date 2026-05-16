import Constants from 'expo-constants';

export type StreamVideoSdk = typeof import('@stream-io/video-react-native-sdk');

let sdkPromise: Promise<StreamVideoSdk | null> | null = null;

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === 'storeClient';
}

/**
 * Loads Stream Video SDK only when native WebRTC is available (dev build).
 * Returns null in Expo Go or when the native module is missing.
 */
export function loadStreamSdk(): Promise<StreamVideoSdk | null> {
  if (isExpoGo()) {
    return Promise.resolve(null);
  }

  if (!sdkPromise) {
    sdkPromise = import('@stream-io/video-react-native-sdk').catch(() => null);
  }

  return sdkPromise;
}
