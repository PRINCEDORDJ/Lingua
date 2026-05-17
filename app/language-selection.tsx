import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { LanguageCard } from "@/components/LanguageCard";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { posthog } from "@/lib/posthog";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { selectedLanguageId, setLanguage } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleConfirm = () => {
    const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageId);

    if (selectedLanguage) {
      posthog?.capture("language_selected", {
        language_code: selectedLanguage.code,
        language_name: selectedLanguage.name,
      });

      if (isSignedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/sign-up");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1">
        {/* Header (Fixed) */}
        <View className="px-6 py-4 flex-row items-center justify-between bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#4b5563" />
          </TouchableOpacity>
          <Text className="h3">Choose a language</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar (Fixed) */}
        <View className="px-6 pb-4 bg-white">
          <View className="flex-row items-center bg-neutral-gray50 rounded-full px-4 h-12 border border-neutral-gray100">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search languages"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base font-medium text-neutral-gray500"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Scrollable Language List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 }}
        >
          <Text className="h3 mb-4">Popular</Text>
          {filteredLanguages.map((lang) => (
            <LanguageCard
              key={lang.id}
              language={lang}
              isSelected={selectedLanguageId === lang.id}
              onSelect={() => setLanguage(lang.id)}
            />
          ))}
        </ScrollView>

        {/* Footer (Fixed) */}
        <View className="bg-white">
          <View className="px-6 py-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              disabled={!selectedLanguageId}
              className={`w-full h-14 items-center justify-center ${
                selectedLanguageId ? "purple-btn" : "ghost-btn opacity-50"
              }`}
            >
              <Text
                className={`font-bold text-base uppercase tracking-wider ${
                  selectedLanguageId ? "text-white" : "text-neutral-gray300"
                }`}
              >
                Confirm Selection
              </Text>
            </TouchableOpacity>
          </View>

          {/* Earth Illustration (Fixed) */}
          <View className="items-center overflow-hidden">
            <Image
              source={images.earth}
              style={{ width: "100%", height: 180, marginBottom: -10 }}
              resizeMode="contain"
            />
          </View>
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
});
