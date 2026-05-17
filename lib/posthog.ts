import PostHog from 'posthog-react-native';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export const isPostHogEnabled = Boolean(apiKey);

export const posthog = isPostHogEnabled
  ? new PostHog(apiKey!, { host })
  : null;
