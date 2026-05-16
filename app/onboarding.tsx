import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 px-8 pb-10">
        {/* Header with Logo */}
        <View className="flex-row items-center justify-center gap-x-1 mt-1">
          <Image
            source={images.mascotLogo}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="ml-2 text-3xl font-bold text-[#1f2937] tracking-tight">
            lingua
          </Text>
        </View>

        {/* Text Content */}
        <View className="mt-8">
          <Text className="text-[40px] leading-[48px] font-bold text-[#1f2937]">
            Your AI language{"\n"}
            <Text className="text-[#5D3FD3]">teacher.</Text>
          </Text>
          <Text className="mt-4 text-[18px] leading-7 text-[#6b7280] font-medium">
            Real conversations, personalized{"\n"}
            lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot Area with Speech Bubbles */}
        <View className="flex-1 items-center justify-center mt-8">
          <View className="relative w-full items-center">
            {/* Speech Bubble: Hello! */}
            <View 
              className="absolute top-8 left-2 bg-[#eff6ff] px-4 py-2 rounded-2xl"
              style={styles.bubbleShadow}
            >
              <Text className="text-[#1e3a8a] font-bold text-lg">Hello!</Text>
            </View>

            {/* Speech Bubble: ¡Hola! */}
            <View 
              className="absolute -top-7 right-4 bg-[#f5f3ff] px-4 py-2 rounded-2xl "
              style={styles.bubbleShadow}
            >
              <Text className="text-[#6d28d9] font-bold text-lg">¡Hola!</Text>
            </View>

            {/* Speech Bubble: 你好! */}
            <View 
              className="absolute top-1/2 -right-2 bg-[#fef2f2] px-4 py-2 rounded-2xl"
              style={styles.bubbleShadow}
            >
              <Text className="text-[#991b1b] font-bold text-lg">你好!</Text>
            </View>

            <Image
              source={images.mascotWelcome}
              className="w-full h-[320px]"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Action Button */}
        <View className="mt-auto">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#5D3FD3] h-[50px] rounded-lg flex-row items-center justify-center px-8 shadow-lg shadow-purple-500/30"
            onPress={() => {
              console.log("Get Started");
            }}
          >
            <Text className="text-white font-bold text-xl flex-1 text-center ml-6">
              Get Started
            </Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
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
  bubbleShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});

