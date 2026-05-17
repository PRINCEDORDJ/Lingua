import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AudioCallStatus } from '@/types/stream';

interface AudioLessonHeaderProps {
  onBack: () => void;
  onEndCall: () => void;
  streakCount?: number;
  callStatus?: AudioCallStatus;
  isSpeaking?: boolean;
}

function getPresenceLabel(
  status: AudioCallStatus = 'idle',
  isSpeaking = false
) {
  switch (status) {
    case 'loading':
      return 'Preparing…';
    case 'connecting':
      return 'Connecting…';
    case 'joined':
      return isSpeaking ? 'Speaking' : 'Online';
    case 'error':
      return 'Offline';
    case 'ended':
      return 'Ended';
    default:
      return 'Online';
  }
}

function getPresenceDotClass(
  status: AudioCallStatus = 'idle',
  isSpeaking = false
) {
  switch (status) {
    case 'joined':
      return isSpeaking ? 'bg-purple-brand' : 'bg-primary';
    case 'connecting':
    case 'loading':
      return 'bg-yellow';
    case 'error':
      return 'bg-red';
    default:
      return 'bg-neutral-gray400';
  }
}

export const AudioLessonHeader: React.FC<AudioLessonHeaderProps> = ({
  onBack,
  onEndCall,
  streakCount = 12,
  callStatus = 'idle',
  isSpeaking = false,
}) => {
  const presenceLabel = getPresenceLabel(callStatus, isSpeaking);
  const presenceDotClass = getPresenceDotClass(callStatus, isSpeaking);

  return (
    <View className="flex-row items-center px-4 py-3">
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={28} color="#4B4B4B" />
      </TouchableOpacity>

      <View className="ml-2 flex-1">
        <Text className="h3 text-neutral-dark">AI Teacher</Text>
        <View className="mt-0.5 flex-row items-center">
          <View className={`mr-1.5 h-2 w-2 rounded-full ${presenceDotClass}`} />
          <Text className="body-sm text-neutral-gray400">{presenceLabel}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="h-10 min-w-10 items-center justify-center rounded-full border-2 border-neutral-gray200 px-2">
          <Text className="text-sm font-bold text-neutral-dark">{streakCount}</Text>
        </View>
        <TouchableOpacity
          onPress={onEndCall}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="End call"
          activeOpacity={0.8}
        >
          <View
            style={styles.endCallCircle}
            className="h-10 w-10 items-center justify-center rounded-full bg-red"
          >
            <Ionicons
              name="call"
              size={20}
              color="#FFFFFF"
              style={{ transform: [{ rotate: '135deg' }] }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  endCallCircle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
