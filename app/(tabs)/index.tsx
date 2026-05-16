import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center items-center">
        <Text className="text-3xl font-bold text-gray-800">Welcome back!</Text>
        <Text className="text-lg text-gray-500 mt-2">{user?.primaryEmailAddress?.emailAddress}</Text>
        
        <TouchableOpacity 
          onPress={() => signOut()}
          className="mt-10 bg-red-100 px-8 py-3 rounded-xl"
        >
          <Text className="text-red-600 font-bold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
