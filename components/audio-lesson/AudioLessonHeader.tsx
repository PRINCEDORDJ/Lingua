import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AudioCallStatus } from '@/types/stream';

interface AudioLessonHeaderProps {
  onBack: () => void;
  streakCount?: number;
  callStatus?: AudioCallStatus;
  micMuted?: boolean;
}

function getPresenceLabel(status: AudioCallStatus = 'idle', micMuted = false) {
  switch (status) {
    case 'loading':
      return 'Preparing…';
    case 'connecting':
      return 'Connecting…';
    case 'joined':
      return micMuted ? 'Muted' : 'Online';
    case 'error':
      return 'Offline';
    case 'ended':
      return 'Ended';
    default:
      return 'Online';
  }
}

function getPresenceDotClass(status: AudioCallStatus = 'idle', micMuted = false) {
  switch (status) {
    case 'joined':
      return micMuted ? 'bg-neutral-gray400' : 'bg-primary';
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
  streakCount = 12,
  callStatus = 'idle',
  micMuted = false,
}) => {
  const presenceLabel = getPresenceLabel(callStatus, micMuted);
  const presenceDotClass = getPresenceDotClass(callStatus, micMuted);

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
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-gray200">
          <Ionicons name="videocam-outline" size={20} color="#4B4B4B" />
        </View>
        <View className="h-10 min-w-10 items-center justify-center rounded-full border-2 border-neutral-gray200 px-2">
          <Text className="text-sm font-bold text-neutral-dark">{streakCount}</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-gray200">
          <Ionicons name="notifications-outline" size={20} color="#4B4B4B" />
        </View>
      </View>
    </View>
  );
};
