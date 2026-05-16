import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface LessonTabsProps {
  activeTab: 'lessons' | 'practice';
  onTabChange: (tab: 'lessons' | 'practice') => void;
}

export const LessonTabs = ({ activeTab, onTabChange }: LessonTabsProps) => {
  return (
    <View className="mx-4 my-4 flex-row rounded-2xl bg-[#F0EDF5] p-1">
      <TouchableOpacity
        onPress={() => onTabChange('lessons')}
        className={`flex-1 items-center rounded-xl py-3 ${
          activeTab === 'lessons' ? 'bg-neutral-white' : ''
        }`}
        style={
          activeTab === 'lessons'
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 2,
              }
            : undefined
        }
      >
        <Text
          className={`h4 ${
            activeTab === 'lessons' ? 'text-purple-brand' : 'text-neutral-gray400'
          }`}
        >
          Lessons
        </Text>
        {activeTab === 'lessons' && (
          <View className="absolute bottom-0 h-1 w-12 rounded-full bg-purple-brand" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabChange('practice')}
        className={`flex-1 items-center rounded-xl py-3 ${
          activeTab === 'practice' ? 'bg-neutral-white' : ''
        }`}
        style={
          activeTab === 'practice'
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 2,
              }
            : undefined
        }
      >
        <Text
          className={`h4 ${
            activeTab === 'practice' ? 'text-purple-brand' : 'text-neutral-gray400'
          }`}
        >
          Practice
        </Text>
        {activeTab === 'practice' && (
          <View className="absolute bottom-0 h-1 w-12 rounded-full bg-purple-brand" />
        )}
      </TouchableOpacity>
    </View>
  );
};
