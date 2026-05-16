import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { practiceSessions, PracticeSession } from '@/data/practice';

export const PracticeView = () => {
  return (
    <View className="px-4 pb-10">
      <Text className="h3 text-neutral-dark mb-4">Focus on your goals</Text>
      
      <View className="gap-y-3">
        {practiceSessions.map((session) => (
          <PracticeCard key={session.id} session={session} />
        ))}
      </View>
      
      {/* Daily Goal Progress */}
      <View className="mt-8 p-4 rounded-2xl border-2 border-neutral-light bg-neutral-white">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="h4 text-neutral-dark">Daily Goal</Text>
          <Text className="body-sm text-neutral-gray">35 / 50 XP</Text>
        </View>
        <View className="h-3 w-full bg-neutral-light rounded-full overflow-hidden">
          <View className="h-full bg-primary" style={{ width: '70%' }} />
        </View>
        <Text className="body-sm text-neutral-gray mt-3">
          Complete 1 more practice session to hit your streak!
        </Text>
      </View>
    </View>
  );
};

const PracticeCard = ({ session }: { session: PracticeSession }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      className="flex-row items-center p-4 rounded-2xl border-2 border-neutral-light bg-neutral-white"
    >
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: `${session.color}20` }}
      >
        <Ionicons name={session.icon} size={26} color={session.color} />
      </View>
      
      <View className="flex-1 ml-4">
        <Text className="h4 text-neutral-dark">{session.title}</Text>
        <Text className="body-sm text-neutral-gray">{session.description}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
    </TouchableOpacity>
  );
};
