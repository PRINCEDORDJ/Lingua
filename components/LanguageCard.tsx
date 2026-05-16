import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";
import { Language } from "@/types/learning";
import { Ionicons } from "@expo/vector-icons";

interface LanguageCardProps {
  language: Language;
  isSelected: boolean;
  onSelect: () => void;
}

export const LanguageCard = ({
  language,
  isSelected,
  onSelect,
}: LanguageCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onSelect}
      className={`w-full flex-row items-center p-4 mb-3 rounded-2xl border-2 ${
        isSelected
          ? "bg-white border-purple-400"
          : "bg-white border-neutral-gray100"
      }`}
    >
      {/* Flag Image */}
      <View className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
        <Image
          source={{ uri: language.flag }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Language Info */}
      <View className="flex-1 ml-4">
        <Text
          className={`text-lg font-bold ${
            isSelected ? "text-neutral-gray500" : "text-neutral-gray500"
          }`}
        >
          {language.name}
        </Text>
        {language.learnerCount && (
          <Text className="text-neutral-gray300 text-sm font-medium">
            {language.learnerCount}
          </Text>
        )}
      </View>

      {/* Selection Indicator or Chevron */}
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${
          isSelected ? "bg-purple-500" : ""
        }`}
      >
        {isSelected ? (
          <Ionicons name="checkmark" size={18} color="white" />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        )}
      </View>
    </TouchableOpacity>
  );
};

