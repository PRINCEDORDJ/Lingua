import { useEffect } from 'react';
import { useUser } from '@clerk/expo';
import { languages } from '@/data/languages';
import { posthog } from '@/lib/posthog';
import {
  clearPendingSignupIdentify,
  getPendingSignupIdentifyUserId,
} from '@/lib/analytics';
import { useUserStore } from '@/store/useUserStore';

export function PostHogIdentity() {
  const { isLoaded, isSignedIn, user } = useUser();
  const selectedLanguageId = useUserStore((state) => state.selectedLanguageId);

  useEffect(() => {
    if (!posthog || !isLoaded || !isSignedIn || !user?.id) return;

    const client = posthog;
    let isMounted = true;
    const userId = user.id;

    async function identifyUser() {
      const preferredLanguage =
        languages.find((language) => language.id === selectedLanguageId)?.code ??
        null;
      const pendingSignupUserId = await getPendingSignupIdentifyUserId();
      const shouldSetSignupDate = pendingSignupUserId === userId;

      if (!isMounted) return;

      client.identify(userId, {
        $set: {
          preferred_language: preferredLanguage,
        },
        ...(shouldSetSignupDate
          ? {
              $set_once: {
                signup_date: new Date().toISOString(),
              },
            }
          : {}),
      });

      if (shouldSetSignupDate) {
        await clearPendingSignupIdentify();
      }
    }

    void identifyUser();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, posthog, selectedLanguageId, user?.id]);

  return null;
}
