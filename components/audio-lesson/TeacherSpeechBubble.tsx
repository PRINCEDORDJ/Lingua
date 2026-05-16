import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface TeacherSpeechBubbleProps {
  primary: string;
  secondary: string;
}

export const TeacherSpeechBubble: React.FC<TeacherSpeechBubbleProps> = ({
  primary,
  secondary,
}) => {
  const handleSpeakerPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.bubble} className="mx-4 flex-row items-center rounded-2xl bg-neutral-white px-4 py-3">
      <View className="flex-1 pr-2">
        <Text className="h4 text-neutral-dark">{primary}</Text>
        <Text className="body-sm mt-0.5 text-neutral-gray400">{secondary}</Text>
      </View>
      <TouchableOpacity
        onPress={handleSpeakerPress}
        accessibilityRole="button"
        accessibilityLabel="Play teacher audio"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="volume-high" size={22} color="#1CB0F6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
