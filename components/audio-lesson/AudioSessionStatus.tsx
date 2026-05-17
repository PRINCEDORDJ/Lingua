import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { AudioCallStatus, AgentStatus } from '@/types/stream';

interface AudioSessionStatusProps {
  status: AudioCallStatus;
  agentStatus?: AgentStatus;
  languageName?: string;
  lessonTitle?: string;
  lessonGoal?: string;
  userName?: string | null;
  errorMessage?: string | null;
  isSpeaking?: boolean;
  onRetry?: () => void;
}

function getStatusCopy(
  status: AudioCallStatus,
  agentStatus: AgentStatus = 'idle',
  languageName?: string,
  lessonTitle?: string,
  lessonGoal?: string,
  userName?: string | null,
  isSpeaking?: boolean
): { label: string; detail?: string; dotClass: string } {
  if (status === 'joined') {
    if (agentStatus === 'connecting') {
      return {
        label: 'Teacher joining',
        detail: 'AI teacher is entering the call...',
        dotClass: 'bg-yellow',
      };
    }
    if (agentStatus === 'failed') {
      return {
        label: 'Teacher unavailable',
        detail: 'The AI teacher could not join. Tap end and retry.',
        dotClass: 'bg-red',
      };
    }
    if (isSpeaking) {
      return {
        label: 'Your turn',
        detail: 'Speaking… release the mic when you are done.',
        dotClass: 'bg-purple-brand',
      };
    }
    return {
      label: 'Listening',
      detail: [
        'Hold the mic when you want to answer.',
        lessonTitle,
        userName
          ? `${userName} - ${languageName ?? 'Audio lesson'}`
          : (languageName ?? 'Audio lesson'),
      ]
        .filter(Boolean)
        .join(' - '),
      dotClass: 'bg-primary',
    };
  }

  switch (status) {
    case 'loading':
      return {
        label: 'Preparing lesson',
        detail: 'Setting up your audio session...',
        dotClass: 'bg-neutral-gray400',
      };
    case 'connecting':
      return {
        label: 'Connecting',
        detail: lessonTitle
          ? `Joining ${lessonTitle}`
          : languageName
            ? `Joining your ${languageName} lesson`
            : 'Joining your lesson',
        dotClass: 'bg-yellow',
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
        detail: 'Hold the mic below when the call is live.',
        dotClass: 'bg-neutral-gray400',
      };
  }
}

export const AudioSessionStatus: React.FC<AudioSessionStatusProps> = ({
  status,
  agentStatus = 'idle',
  languageName,
  lessonTitle,
  lessonGoal: _lessonGoal,
  userName,
  errorMessage,
  isSpeaking = false,
  onRetry,
}) => {
  const copy = getStatusCopy(
    status,
    agentStatus,
    languageName,
    lessonTitle,
    _lessonGoal,
    userName,
    isSpeaking
  );

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
