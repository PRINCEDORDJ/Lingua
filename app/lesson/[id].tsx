import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import {
  StreamCall,
  StreamVideo,
} from '@stream-io/video-react-native-sdk';
import { useUserStore } from '@/store/useUserStore';
import { getLessonContext, getTeacherBubbleLines } from '@/lib/lessonContext';
import {
  getTeacherImage,
  getPreviewBackgroundImage,
  getUserInsetImage,
} from '@/lib/audioLessonImages';
import { useAudioLessonCall } from '@/hooks/useAudioLessonCall';
import { AudioLessonHeader } from '@/components/audio-lesson/AudioLessonHeader';
import { TeacherPreviewCard } from '@/components/audio-lesson/TeacherPreviewCard';
import { AudioCallControls } from '@/components/audio-lesson/AudioCallControls';
import { LessonFeedbackMetrics } from '@/components/audio-lesson/LessonFeedbackMetrics';
import { LessonSubtitlesPanel } from '@/components/audio-lesson/LessonSubtitlesPanel';
import { AudioSessionStatus } from '@/components/audio-lesson/AudioSessionStatus';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { selectedLanguageId } = useUserStore();

  const [subtitlesVisible, setSubtitlesVisible] = useState(false);
  const [cameraPreviewVisible, setCameraPreviewVisible] = useState(true);

  const context = useMemo(
    () => (id ? getLessonContext(id, selectedLanguageId) : null),
    [id, selectedLanguageId]
  );

  const bubbleLines = useMemo(
    () => (context ? getTeacherBubbleLines(context.lesson) : null),
    [context]
  );

  const {
    status,
    errorMessage,
    micMuted,
    client,
    call,
    toggleMic,
    endCall,
    retry,
  } = useAudioLessonCall({
    lessonId: id ?? '',
    languageId: context?.language.id ?? selectedLanguageId ?? '',
    userName: user?.fullName ?? user?.firstName,
    userImageUrl: user?.imageUrl,
    enabled: Boolean(context && isSignedIn && id && context.language.id),
  });

  const handleEndCall = async () => {
    await endCall();
    router.back();
  };

  if (!context || !bubbleLines) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View className="flex-1 items-center justify-center px-6">
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
        <View className="flex-1 items-center justify-center px-6">
          <Text className="h3 text-center text-neutral-dark">
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
  const userSeed = user?.id ?? lesson.id;
  const controlsDisabled = status !== 'joined';
  const isBusy = status === 'loading' || status === 'connecting';

  const lessonBody = (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <AudioLessonHeader
        onBack={handleEndCall}
        callStatus={status}
        micMuted={micMuted}
      />

      <AudioSessionStatus
        status={status}
        languageName={language.name}
        userName={user?.fullName ?? user?.firstName}
        errorMessage={errorMessage}
        micMuted={micMuted}
        onRetry={retry}
      />

      {isBusy ? (
        <View className="items-center py-6">
          <ActivityIndicator size="large" color="#5D3FD3" />
        </View>
      ) : null}

      <TeacherPreviewCard
        teacherImage={getTeacherImage()}
        backgroundImage={getPreviewBackgroundImage()}
        userInsetImage={getUserInsetImage(userSeed)}
        showUserInset={cameraPreviewVisible}
        primaryLine={bubbleLines.primary}
        secondaryLine={bubbleLines.secondary}
      />

      {subtitlesVisible ? (
        <LessonSubtitlesPanel lesson={lesson} language={language} />
      ) : null}

      <AudioCallControls
        micMuted={micMuted}
        subtitlesOn={subtitlesVisible}
        disabled={controlsDisabled}
        onToggleMic={() => {
          void toggleMic();
        }}
        onToggleSubtitles={() => setSubtitlesVisible((value) => !value)}
        onToggleCamera={() => setCameraPreviewVisible((value) => !value)}
        onEndCall={() => {
          void handleEndCall();
        }}
      />

      <LessonFeedbackMetrics />
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>{lessonBody}</StreamCall>
        </StreamVideo>
      ) : (
        lessonBody
      )}
    </SafeAreaView>
  );
}
