import { useAuth, useUser } from "@clerk/expo";
import { useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const { user } = useUser();

  async function handleSignOut() {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="container pt-12">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full border-4 border-neutral-gray200 overflow-hidden mb-4">
            {user?.imageUrl ? (
              <Image 
                source={{ uri: user.imageUrl }} 
                className="w-full h-full"
              />
            ) : (
              <View className="w-full h-full bg-primary flex-center">
                <Text className="text-white text-3xl font-bold">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </Text>
              </View>
            )}
          </View>
          
          <Text className="h1">{user?.fullName || user?.username || "Learner"}</Text>
          <Text className="body text-neutral-gray300">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Placeholder Stats */}
        <View className="card mb-8">
          <Text className="h3 mb-4">Statistics</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="h2 lingua-purple">0</Text>
              <Text className="caption">Day Streak</Text>
            </View>
            <View className="items-center">
              <Text className="h2 lingua-purple">0</Text>
              <Text className="caption">Total XP</Text>
            </View>
            <View className="items-center">
              <Text className="h2 lingua-purple">Bronze</Text>
              <Text className="caption">League</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-auto mb-20">
          <TouchableOpacity
            onPress={handleSignOut}
            disabled={isLoading}
            className={`red-btn w-full h-14 ${isLoading ? "opacity-70" : ""}`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg uppercase">
                Logout
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
