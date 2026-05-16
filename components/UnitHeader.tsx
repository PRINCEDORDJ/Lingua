import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUnitHeroImage } from '@/lib/images';

interface UnitHeaderProps {
  title: string;
  unitNumber: number;
  completedLessons: number;
  totalLessons: number;
  imageKey?: string;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({
  title,
  unitNumber,
  completedLessons,
  totalLessons,
  imageKey,
}) => {
  const router = useRouter();
  const heroSource = getUnitHeroImage(imageKey);

  return (
    <View className="bg-neutral-white">
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={28} color="#4B4B4B" />
        </TouchableOpacity>

        <View className="flex-1 items-center px-2">
          <Text className="h3 text-neutral-dark">{title}</Text>
          <Text className="body-sm text-neutral-gray">
            Unit {unitNumber} • {completedLessons} / {totalLessons} lessons
          </Text>
        </View>

        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <View className="relative h-7 w-6 items-center justify-center">
            <Ionicons name="bookmark" size={26} color="#FF9600" />
            <View className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-secondary" />
          </View>
        </TouchableOpacity>
      </View>

      <View className="h-48 w-full overflow-hidden">
        <Image
          source={heroSource}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
    </View>
  );
};
