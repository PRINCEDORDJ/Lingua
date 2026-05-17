import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import { posthog } from '@/lib/posthog';
import { useUserStore } from '@/store/useUserStore';
import { getLessonContext } from '@/lib/lessonContext';
import { isExpoGo } from '@/lib/stream/loadStreamSdk';
import { getTeacherImage, getPreviewBackgroundImage } from '@/lib/audioLessonImages';
import { useAudioLessonCall } from '@/hooks/useAudioLessonCall';
import { AudioLessonHeader } from '@/components/audio-lesson/AudioLessonHeader';
import { TeacherPreviewCard } from '@/components/audio-lesson/TeacherPreviewCard';
import { AudioMicButton } from '@/components/audio-lesson/AudioMicButton';
import { LessonFeedbackMetrics } from '@/components/audio-lesson/LessonFeedbackMetrics';
import { AudioSessionStatus } from '@/components/audio-lesson/AudioSessionStatus';
import { StreamCallProvider } from '@/components/audio-lesson/StreamCallProvider';
import { LessonLiveCaptionsPanel } from '@/components/audio-lesson/LessonLiveCaptionsPanel';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { selectedLanguageId } = useUserStore();

  const lessonStartTimeRef = useRef<number | null>(null);
  const lastQuestionIndexRef = useRef(0);
  const lessonStartedRef = useRef(false);
  const lessonCompletedRef = useRef(false);
  const lessonAbandonedRef = useRef(false);

  const context = useMemo(
    () => (id ? getLessonContext(id, selectedLanguageId) : null),
    [id, selectedLanguageId]
  );

  const {
    status,
    agentStatus,
    errorMessage,
    isSpeaking,
    streamAvailable,
    client,
    call,
    startSpeaking,
    stopSpeaking,
    endCall,
    retry,
  } = useAudioLessonCall({
    lessonId: id ?? '',
    languageId: context?.language.id ?? selectedLanguageId ?? '',
    userName: user?.fullName ?? user?.firstName,
    userImageUrl: user?.imageUrl,
    enabled: Boolean(context && isSignedIn && id && context.language.id),
  });

  const lessonNumber = useMemo(() => {
    if (!context?.unit) return 0;

    const lessonIndex = context.unit.lessons.findIndex(
      (unitLesson) => unitLesson.id === context.lesson.id
    );

    return lessonIndex >= 0 ? lessonIndex + 1 : 0;
  }, [context]);

  const captureLessonAbandoned = useCallback(() => {
    if (
      !posthog ||
      !context ||
      !lessonStartedRef.current ||
      lessonCompletedRef.current ||
      lessonAbandonedRef.current ||
      lessonStartTimeRef.current === null
    ) {
      return;
    }

    lessonAbandonedRef.current = true;

    posthog.capture('lesson_abandoned', {
      lesson_id: context.lesson.id,
      time_into_lesson_seconds: Math.max(
        0,
        Math.round((Date.now() - lessonStartTimeRef.current) / 1000)
      ),
      last_question_index: lastQuestionIndexRef.current,
    });
  }, [context, posthog]);

  useEffect(() => {
    if (!posthog || !context || !isSignedIn || lessonStartedRef.current) return;

    lessonStartedRef.current = true;
    lessonStartTimeRef.current = Date.now();

    posthog.capture('lesson_started', {
      lesson_id: context.lesson.id,
      language: context.language.code,
      lesson_number: lessonNumber,
    });
  }, [context, isSignedIn, lessonNumber, posthog]);

  useEffect(() => {
    return () => {
      captureLessonAbandoned();
    };
  }, [captureLessonAbandoned]);

  const handleEndCall = async () => {
    if (isSpeaking) {
      await stopSpeaking();
    }
    captureLessonAbandoned();
    await endCall();
    router.back();
  };

  if (!context) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View className="items-center justify-center flex-1 px-6">
          <Text className="h3 text-neutral-dark">Lesson not found</Text>
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Text className="h4 text-purple-brand">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View className="items-center justify-center flex-1 px-6">
          <Text className="text-center h3 text-neutral-dark">
            Sign in to start your audio lesson
          </Text>
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Text className="h4 text-purple-brand">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { lesson, language } = context;
  const inPreviewMode = isExpoGo() || !streamAvailable;
  const micDisabled = !inPreviewMode && status !== 'joined';
  const isBusy = status === 'loading' || status === 'connecting';
  const headerStatus = inPreviewMode && status === 'idle' ? 'joined' : status;

  const lessonBody = (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <AudioLessonHeader
        onBack={handleEndCall}
        onEndCall={handleEndCall}
        callStatus={headerStatus}
        isSpeaking={isSpeaking}
      />

      {isExpoGo() ? (
        <View className="px-4 py-3 mx-4 mt-2 border rounded-2xl border-yellow bg-yellow/10">
          <Text className="body-sm text-neutral-dark">
            Preview mode: live audio needs a dev build (`npx expo run:android`).
          </Text>
        </View>
      ) : null}

      {!inPreviewMode ? (
        <AudioSessionStatus
          status={status}
          agentStatus={agentStatus}
          languageName={language.name}
          lessonTitle={lesson.title}
          lessonGoal={lesson.goals?.[0]?.description ?? lesson.description}
          userName={user?.fullName ?? user?.firstName}
          errorMessage={errorMessage}
          isSpeaking={isSpeaking}
          onRetry={retry}
        />
      ) : null}

      {isBusy ? (
        <View className="items-center py-6">
          <ActivityIndicator size="large" color="#5D3FD3" />
        </View>
      ) : null}

      <TeacherPreviewCard
        teacherImage={getTeacherImage()}
        backgroundImage={getPreviewBackgroundImage()}
      />

      {(!inPreviewMode && status === 'joined') || isExpoGo() ? <LessonLiveCaptionsPanel /> : null}

      <AudioMicButton
        isSpeaking={isSpeaking}
        disabled={micDisabled}
        onPressIn={() => {
          void startSpeaking();
        }}
        onPressOut={() => {
          void stopSpeaking();
        }}
      />

      <LessonFeedbackMetrics />
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StreamCallProvider client={client} call={call}>
        {lessonBody}
      </StreamCallProvider>
    </SafeAreaView>
  );
}
