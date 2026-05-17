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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { VerificationModal } from "@/components/VerificationModal";
import { GoogleIcon } from "@/components/GoogleIcon";
import { useSignUp } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import { markPendingSignupIdentify } from "@/lib/analytics";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";


export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      // Start the sign-up process using the email address and password
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send the verification code to the user's email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Open the verification modal
      setModalVisible(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const clerkError = err.errors?.[0];
      if (clerkError?.code === "form_identifier_exists") {
        setError("This email is already registered. Try signing in instead.");
      } else {
        setError(clerkError?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async (code: string) => {
    if (!isLoaded) return;

    setVerificationError("");
    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await markPendingSignupIdentify(completeSignUp.createdUserId);
        await setActive({ session: completeSignUp.createdSessionId });
        setModalVisible(false);
        // Let (auth)/_layout.tsx handle the redirect reactively
        // New users (no selectedLanguageId) → /language-selection
        // Returning users → /(tabs)
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setVerificationError(err.errors?.[0]?.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onSelectAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      const redirectUrl = Linking.createURL("/language-selection");
      const { createdSessionId, setActive: setSessionActive, signUp: completedSignUp } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId) {
        await markPendingSignupIdentify(completedSignUp?.createdUserId);
        await setSessionActive!({ session: createdSessionId });
        // Let (auth)/_layout.tsx handle the redirect reactively
      }
    } catch (err) {
      console.error(err);
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
            {error ? (
              <View className="bg-red-50 p-4 rounded-2xl border-2 border-red-100 flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#ef4444" />
                <Text className="ml-2 text-red-600 font-medium flex-1">{error}</Text>
              </View>
            ) : null}

            <View className="bg-gray-100 rounded-2xl px-5 h-16 flex-row items-center border-2 border-transparent focus:border-[#5D3FD3]">
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Email address"
                className="flex-1 ml-3 text-lg text-gray-800"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View className="bg-gray-100 rounded-2xl px-5 h-16 flex-row items-center border-2 border-transparent focus:border-[#5D3FD3]">
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Password"
                className="flex-1 ml-3 text-lg text-gray-800"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className={`h-16 rounded-2xl items-center justify-center shadow-lg ${
                email && password ? "bg-[#5D3FD3] shadow-purple-500/30" : "bg-gray-300 shadow-none"
              }`}
              onPress={onSignUpPress}
              disabled={!email || !password || isLoading}
            >
              {isLoading && !modalVisible ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg uppercase tracking-wider">
                  Continue
                </Text>
              )}
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
              onPress={() => onSelectAuth("oauth_google")}
            >
              <GoogleIcon size={24} />
              <Text className="ml-3 text-lg font-bold text-gray-700">Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-center h-16 rounded-2xl border-2 border-gray-100 bg-white"
              activeOpacity={0.7}
              onPress={() => onSelectAuth("oauth_apple")}
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
        onVerify={onVerify}
        onResend={onResend}
        isLoading={isLoading}
        error={verificationError}
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
