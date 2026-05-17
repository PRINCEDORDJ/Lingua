import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { Language, Lesson } from '@/types/learning';
import { isExpoGo } from '@/lib/stream/loadStreamSdk';

interface LessonSubtitlesPanelProps {
  lesson: Lesson;
  language: Language;
}

export const LessonSubtitlesPanel: React.FC<LessonSubtitlesPanelProps> = ({
  lesson,
  language,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [LiveCaptions, setLiveCaptions] = useState<React.ComponentType | null>(
    null,
  );

  useEffect(() => {
    if (isExpoGo()) return;

    let mounted = true;

    import('./LessonSubtitlesLive')
      .then((mod) => {
        if (mounted) {
          setLiveCaptions(() => mod.LessonSubtitlesLive);
        }
      })
      .catch(() => {
        // Stream native module unavailable — static subtitles only.
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="mx-4 mt-3 max-h-32 rounded-2xl border-2 border-neutral-gray200 bg-neutral-gray100 px-4 py-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="caption text-neutral-gray400">{language.name}</Text>
      <Text className="h4 mt-1 text-neutral-dark">{lesson.title}</Text>

      {LiveCaptions ? <LiveCaptions /> : null}

      {lesson.aiTeacherPrompt?.context ? (
        <>
          <Text className="caption mt-3 text-neutral-gray400">Lesson focus</Text>
          <Text className="body-sm mt-1 text-neutral-gray500">
            {lesson.aiTeacherPrompt.context}
          </Text>
        </>
      ) : null}

      {lesson.goals && lesson.goals.length > 0 ? (
        <>
          <Text className="caption mt-3 text-neutral-gray400">Goals</Text>
          {lesson.goals.map((goal) => (
            <Text key={goal.id} className="body-sm mt-1 text-neutral-gray500">
              • {goal.description}
            </Text>
          ))}
        </>
      ) : null}

      {lesson.phrases && lesson.phrases.length > 0 ? (
        <>
          <Text className="caption mt-3 text-neutral-gray400">Phrases</Text>
          {lesson.phrases.map((phrase) => (
            <View key={phrase.id} className="mt-1">
              <Text className="body-sm font-semibold text-neutral-dark">
                {phrase.text}
              </Text>
              <Text className="body-sm text-neutral-gray400">
                {phrase.translation}
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
};
