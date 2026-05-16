import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { units } from '@/data/units';
import { UnitHeader } from '@/components/UnitHeader';
import { LessonTabs } from '@/components/LessonTabs';
import { LessonCard } from '@/components/LessonCard';
import { PracticeView } from '@/components/PracticeView';
import { getLessonVisualStatus, getInProgressLesson } from '@/lib/lessonStatus';
import { getLessonImage } from '@/lib/images';

export default function LearnScreen() {
  const { selectedLanguageId, completedLessonIds } = useUserStore();
  const [activeTab, setActiveTab] = useState<'lessons' | 'practice'>('lessons');
  const router = useRouter();

  const currentUnits = useMemo(() => {
    if (!selectedLanguageId) return [];
    return units[selectedLanguageId] || [];
  }, [selectedLanguageId]);

  if (!selectedLanguageId) {
    return <Redirect href="/language-selection" />;
  }

  if (currentUnits.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="h3 text-neutral-dark text-center">
            No lessons yet for this language.
          </Text>
          <Text className="body-sm mt-2 text-center text-neutral-gray400">
            Pick another language to keep learning.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeUnit = currentUnits[0];
  const unitLessons = activeUnit.lessons;
  const totalLessons = unitLessons.length;
  const completedLessonsCount = unitLessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;

  const headerTitle =
    activeUnit.headerTitle ??
    getInProgressLesson(unitLessons, completedLessonIds)?.title ??
    activeUnit.title;

  const unitNumber = activeUnit.unitNumber ?? 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <UnitHeader
          title={headerTitle}
          unitNumber={unitNumber}
          completedLessons={completedLessonsCount}
          totalLessons={totalLessons}
          imageKey={activeUnit.imageUrl}
        />

        <LessonTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'lessons' ? (
          <View className="px-4 pb-12">
            {unitLessons.map((lesson, index) => {
              const status = getLessonVisualStatus(
                lesson,
                index,
                unitLessons,
                completedLessonIds
              );

              return (
                <LessonCard
                  key={lesson.id}
                  number={index + 1}
                  title={lesson.title}
                  subtitle={lesson.description}
                  progressLabel={`0 / ${totalLessons} lessons`}
                  status={status}
                  imageSource={getLessonImage(lesson)}
                  onPress={() =>
                    router.push({
                      pathname: '/lesson/[id]',
                      params: { id: lesson.id },
                    } as never)
                  }
                />
              );
            })}
          </View>
        ) : (
          <PracticeView />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
