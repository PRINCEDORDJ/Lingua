import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { LessonVisualStatus } from '@/types/learning';

interface LessonCardProps {
  lessonId: string;
  number: number;
  title: string;
  subtitle?: string;
  progressLabel?: string;
  status: LessonVisualStatus;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lessonId,
  number,
  title,
  subtitle,
  progressLabel,
  status,
  imageSource,
  onPress,
}) => {
  const router = useRouter();
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    router.push(`/lesson/${lessonId}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`mb-3 w-full rounded-2xl border-2 p-4 ${
        isInProgress
          ? 'border-purple bg-purple/10'
          : 'border-neutral-gray200 bg-neutral-white'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text
            className={`body-sm mb-1 ${
              isInProgress ? 'text-purple-dark' : 'text-neutral-gray400'
            }`}
          >
            Lesson {number}
          </Text>
          <Text className="h4 text-neutral-dark">{title}</Text>
          {isInProgress && (
            <Text className="body-sm mt-1 font-semibold text-purple-dark">
              In progress
            </Text>
          )}
          {!isInProgress && !isCompleted && progressLabel && (
            <Text className="body-sm mt-1 text-neutral-gray400">
              {progressLabel}
            </Text>
          )}
        </View>

        <View className="h-12 w-12 items-center justify-center">
          {isCompleted ? (
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Ionicons name="checkmark" size={22} color="#FFFFFF" />
            </View>
          ) : isInProgress ? (
            <Image
              source={imageSource}
              className="h-12 w-12 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="ellipse-outline" size={24} color="#AFB6BB" />
          )}
        </View>
      </View>

      {isInProgress && subtitle && (
        <View className="mt-3 border-t border-neutral-light pt-3">
          <Text className="body-sm text-neutral-gray400">{subtitle}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
