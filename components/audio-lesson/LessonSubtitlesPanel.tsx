import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { Language, Lesson } from '@/types/learning';
import { useCallStateHooks } from '@stream-io/video-react-native-sdk';

interface LessonSubtitlesPanelProps {
  lesson: Lesson;
  language: Language;
}

export const LessonSubtitlesPanel: React.FC<LessonSubtitlesPanelProps> = ({
  lesson,
  language,
}) => {
  const { useCallClosedCaptions } = useCallStateHooks();
  const captions = useCallClosedCaptions();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new captions arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [captions]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="mx-4 mt-3 max-h-32 rounded-2xl border-2 border-neutral-gray200 bg-neutral-gray100 px-4 py-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="caption text-neutral-gray400">{language.name}</Text>
      <Text className="h4 mt-1 text-neutral-dark">{lesson.title}</Text>

      {captions && captions.length > 0 ? (
        <View className="mt-3">
          {captions.map((caption, index) => {
            // Stream captions usually have user or speaker_id
            const isTeacher =
              caption.user?.id === 'ai-language-teacher' ||
              (caption as any).speaker_id === 'ai-language-teacher' ||
              (caption as any).user_id === 'ai-language-teacher';

            return (
              <View key={`${caption.start_time}-${index}`} className="mb-2">
                <Text
                  className={`body-sm font-semibold ${
                    isTeacher ? 'text-purple-brand' : 'text-neutral-dark'
                  }`}
                >
                  {isTeacher ? 'Teacher' : 'You'}
                </Text>
                <Text className="body-sm text-neutral-gray600">{caption.text}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <>
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
        </>
      )}
    </ScrollView>
  );
};
