import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FEEDBACK = {
  speaking: { label: 'Speaking', value: 'Excellent', color: 'text-primary' },
  pronunciation: { label: 'Pronunciation', value: 'Great', color: 'text-secondary' },
  grammar: { label: 'Grammar', value: 'Good', color: 'text-purple-dark' },
} as const;

export const LessonFeedbackMetrics: React.FC = () => {
  return (
    <View style={styles.card} className="mx-4 mt-5 flex-row rounded-2xl border-2 border-neutral-gray200 bg-neutral-white py-4">
      <MetricColumn {...FEEDBACK.speaking} />
      <View className="w-px self-stretch bg-neutral-gray200" />
      <MetricColumn {...FEEDBACK.pronunciation} />
      <View className="w-px self-stretch bg-neutral-gray200" />
      <MetricColumn {...FEEDBACK.grammar} />
    </View>
  );
};

function MetricColumn({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View className="flex-1 items-center px-2">
      <Text className="caption text-neutral-gray400">{label}</Text>
      <Text className={`mt-1 text-base font-bold ${color}`}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
});
