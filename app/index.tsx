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
import { useUserStore } from "@/store/useUserStore";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedLanguageId } = useUserStore();


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

          <Link href="/language-selection" asChild>
            <TouchableOpacity className="items-center py-2">
              <Text className="text-purple-600 font-bold text-base">
                Change Language
              </Text>
            </TouchableOpacity>
          </Link>
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

