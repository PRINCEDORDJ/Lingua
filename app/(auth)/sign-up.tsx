import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { VerificationModal } from "@/components/VerificationModal";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinue = () => {
    if (email) {
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>

          {/* Mascot Image */}
          <View className="items-center mt-6">
            <Image
              source={images.mascotAuth}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          {/* Title & Description */}
          <View className="mt-8">
            <Text className="text-3xl font-bold text-gray-800 text-center">
              Create your profile
            </Text>
            <Text className="mt-3 text-lg text-gray-500 text-center px-4">
              Create a profile to save your progress and access more features.
            </Text>
          </View>

          {/* Input Fields */}
          <View className="mt-10 gap-y-4">
            <View className="bg-gray-100 rounded-2xl px-5 h-16 flex-row items-center border-2 border-transparent focus:border-[#5D3FD3]">
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Email address"
                className="flex-1 ml-3 text-lg text-gray-800"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className={`h-16 rounded-2xl items-center justify-center shadow-lg ${
                email ? "bg-[#5D3FD3] shadow-purple-500/30" : "bg-gray-300 shadow-none"
              }`}
              onPress={handleContinue}
              disabled={!email}
            >
              <Text className="text-white font-bold text-lg uppercase tracking-wider">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-400 font-bold">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* Social Buttons */}
          <View className="gap-y-4">
            <TouchableOpacity 
              className="flex-row items-center justify-center h-16 rounded-2xl border-2 border-gray-100 bg-white"
              activeOpacity={0.7}
            >
              <GoogleIcon size={24} />
              <Text className="ml-3 text-lg font-bold text-gray-700">Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-center h-16 rounded-2xl border-2 border-gray-100 bg-white"
              activeOpacity={0.7}
            >
              <Ionicons name="logo-apple" size={24} color="black" />
              <Text className="ml-3 text-lg font-bold text-gray-700">Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-auto py-8 flex-row justify-center">
            <Text className="text-gray-500 text-lg">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-[#5D3FD3] text-lg font-bold">SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        email={email}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
