import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

function InitialLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#5D3FD3" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST;

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );

  if (posthogKey) {
    return (
      <PostHogProvider
        apiKey={posthogKey}
        options={posthogHost ? { host: posthogHost } : {}}
      >
        {content}
      </PostHogProvider>
    );
  }

  return content;
}

