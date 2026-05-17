import React from 'react';
import { View, Text } from 'react-native';
import { useCallStateHooks } from '@stream-io/video-react-native-sdk';

const AGENT_USER_ID = 'ai-language-teacher';

type CaptionWithSpeaker = {
  speaker_id?: string;
  user_id?: string;
};

export function LessonSubtitlesLive({
  onCaptionsChange,
}: {
  onCaptionsChange?: () => void;
}) {
  const { useCallClosedCaptions } = useCallStateHooks();
  const captions = useCallClosedCaptions();

  React.useEffect(() => {
    if (captions && captions.length > 0) {
      onCaptionsChange?.();
    }
  }, [captions?.length, onCaptionsChange]);

  if (!captions || captions.length === 0) {
    return (
      <View className="mt-3">
        <Text className="body-sm text-neutral-gray600 italic">Waiting for speech...</Text>
      </View>
    );
  }

  return (
    <View className="mt-3">
      {captions.map((caption, index) => {
        const speakerCaption = caption as CaptionWithSpeaker;
        const isTeacher =
          caption.user?.id === AGENT_USER_ID ||
          speakerCaption.speaker_id === AGENT_USER_ID ||
          speakerCaption.user_id === AGENT_USER_ID;

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
