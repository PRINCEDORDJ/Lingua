import React from 'react';
import { View, Text } from 'react-native';
import { useCallStateHooks } from '@stream-io/video-react-native-sdk';

type CaptionWithSpeaker = {
  speaker_id?: string;
  user_id?: string;
};

export function LessonSubtitlesLive() {
  const { useCallClosedCaptions } = useCallStateHooks();
  const captions = useCallClosedCaptions();

  if (!captions || captions.length === 0) {
    return null;
  }

  return (
    <View className="mt-3">
      {captions.map((caption, index) => {
        const speakerCaption = caption as CaptionWithSpeaker;
        const isTeacher =
          caption.user?.id === 'ai-language-teacher' ||
          speakerCaption.speaker_id === 'ai-language-teacher' ||
          speakerCaption.user_id === 'ai-language-teacher';

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
  );
}
