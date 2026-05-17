import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_SIGNUP_IDENTIFY_USER_ID = 'posthog-pending-signup-identify-user-id';

export async function markPendingSignupIdentify(userId?: string | null) {
  if (!userId) return;

  await AsyncStorage.setItem(PENDING_SIGNUP_IDENTIFY_USER_ID, userId);
}

export async function getPendingSignupIdentifyUserId() {
  return AsyncStorage.getItem(PENDING_SIGNUP_IDENTIFY_USER_ID);
}

export async function clearPendingSignupIdentify() {
  await AsyncStorage.removeItem(PENDING_SIGNUP_IDENTIFY_USER_ID);
}
