import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioMicButtonProps {
  isSpeaking: boolean;
  disabled?: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const AudioMicButton: React.FC<AudioMicButtonProps> = ({
  isSpeaking,
  disabled = false,
  onPressIn,
  onPressOut,
}) => {
  return (
    <View className="mt-6 items-center px-4">
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Hold to speak"
        accessibilityHint="Press and hold while you answer the teacher"
        className="items-center"
      >
        {({ pressed }) => (
          <>
            <View
              style={styles.circle}
              className={`h-20 w-20 items-center justify-center rounded-full ${
                disabled
                  ? 'border-2 border-neutral-gray200 bg-neutral-gray100 opacity-50'
                  : isSpeaking || pressed
                    ? 'border-2 border-purple-brand bg-purple/10'
                    : 'border-2 border-neutral-gray200 bg-neutral-white'
              }`}
            >
              <Ionicons
                name={isSpeaking || pressed ? 'mic' : 'mic-outline'}
                size={32}
                color={disabled ? '#AFAFAF' : isSpeaking || pressed ? '#5D3FD3' : '#4B4B4B'}
              />
            </View>
            <Text className="caption mt-2 text-neutral-gray400">Hold to speak</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
