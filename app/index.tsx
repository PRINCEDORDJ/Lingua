import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while Clerk resolves auth
  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5D3FD3" />
        </View>
      </SafeAreaView>
    );
  }

  // If the user is already authenticated, redirect to the home tabs
  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 px-6 pb-10">
        {/* Mascot Center Image */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={images.mascotWelcome}
            className="w-[85%] h-[45%]"
            resizeMode="contain"
          />
          <View className="mt-8">
            <Text className="text-4xl font-bold text-purple-800 text-center">
              Linguo
            </Text>
            <Text className="mt-2 text-lg text-neutral-gray400 text-center px-4">
              Learn a language for free. Forever.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-y-4">
          <Link href="/onboarding" asChild>
            <TouchableOpacity className="flex-row justify-center items-center bg-[#5D3FD3] h-14 rounded-lg">
              <Text className="text-white font-bold text-lg uppercase">
                Get Started
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="white"
                className="absolute right-5"
              />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            className="secondary-btn h-14 rounded-lg"
            onPress={() => {
              router.push("/(auth)/sign-in");
            }}
          >
            <Text className="text-white font-bold text-lg uppercase">
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

