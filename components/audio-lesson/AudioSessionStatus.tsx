import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { AudioCallStatus } from '@/types/stream';

interface AudioSessionStatusProps {
  status: AudioCallStatus;
  languageName?: string;
  userName?: string | null;
  errorMessage?: string | null;
  micMuted?: boolean;
  onRetry?: () => void;
}

function getStatusCopy(
  status: AudioCallStatus,
  languageName?: string,
  userName?: string | null,
  micMuted?: boolean
): { label: string; detail?: string; dotClass: string } {
  switch (status) {
    case 'loading':
      return {
        label: 'Preparing lesson',
        detail: 'Setting up your audio session…',
        dotClass: 'bg-neutral-gray400',
      };
    case 'connecting':
      return {
        label: 'Connecting',
        detail: languageName
          ? `Joining your ${languageName} lesson`
          : 'Joining your lesson',
        dotClass: 'bg-yellow',
      };
    case 'joined':
      return {
        label: micMuted ? 'Muted' : 'Live',
        detail: userName
          ? `${userName} · ${languageName ?? 'Audio lesson'}`
          : (languageName ?? 'Audio lesson'),
        dotClass: micMuted ? 'bg-neutral-gray400' : 'bg-primary',
      };
    case 'error':
      return {
        label: 'Connection issue',
        detail: 'We could not connect to the lesson call.',
        dotClass: 'bg-red',
      };
    case 'ended':
      return {
        label: 'Call ended',
        detail: 'Thanks for practicing today.',
        dotClass: 'bg-neutral-gray400',
      };
    default:
      return {
        label: 'Ready',
        detail: 'Tap controls below when the call is live.',
        dotClass: 'bg-neutral-gray400',
      };
  }
}

export const AudioSessionStatus: React.FC<AudioSessionStatusProps> = ({
  status,
  languageName,
  userName,
  errorMessage,
  micMuted = false,
  onRetry,
}) => {
  const copy = getStatusCopy(status, languageName, userName, micMuted);

  return (
    <View className="mx-4 mt-3 rounded-2xl border border-neutral-gray200 bg-neutral-white px-4 py-3">
      <View className="flex-row items-center">
        <View className={`mr-2 h-2.5 w-2.5 rounded-full ${copy.dotClass}`} />
        <Text className="body-sm font-semibold text-neutral-dark">{copy.label}</Text>
      </View>

      {copy.detail ? (
        <Text className="body-sm mt-1 text-neutral-gray400">{copy.detail}</Text>
      ) : null}

      {status === 'error' && errorMessage ? (
        <Text className="body-sm mt-1 text-red">{errorMessage}</Text>
      ) : null}

      {status === 'error' && onRetry ? (
        <TouchableOpacity className="mt-3 self-start" onPress={onRetry}>
          <Text className="body-sm font-semibold text-purple-brand">Try again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
