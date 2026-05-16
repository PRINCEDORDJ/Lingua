import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 px-6 justify-between py-10">
        {/* Header Section */}
        <View className="items-center mt-10">
          <View className="bg-purple-100 p-4 rounded-full mb-6">
            <Image 
              source={images.mascotLogo} 
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
          <Text className="text-5xl font-black text-[#5D3FD3] tracking-tighter">
            Lingua
          </Text>
          <Text className="text-xl text-gray-500 mt-2 font-medium">
            Master languages with AI
          </Text>
        </View>

        {/* User Info Card */}
        <View className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 items-center">
          <Text className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-3">
            Logged in as
          </Text>
          <Text className="text-xl font-bold text-gray-800">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="bg-red-50 border-2 border-red-100 h-16 rounded-2xl flex-row items-center justify-center px-6"
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text className="text-red-500 font-bold text-lg uppercase tracking-wider ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

