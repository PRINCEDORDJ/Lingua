import React, { useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { isExpoGo } from '@/lib/stream/loadStreamSdk';

let LessonSubtitlesLive: any = null;
if (!isExpoGo()) {
  LessonSubtitlesLive = require('./LessonSubtitlesLive').LessonSubtitlesLive;
}

export function LessonLiveCaptionsPanel() {
  const scrollViewRef = useRef<ScrollView>(null);

  if (isExpoGo()) {
    return null;
  }

  return (
    <View className="px-4 mt-6 mb-4">
      <View className="p-4 bg-white border border-neutral-light rounded-2xl">
        <Text className="h4 text-neutral-dark mb-2">Live captions</Text>
        <ScrollView
          ref={scrollViewRef}
          className="max-h-40"
          showsVerticalScrollIndicator={true}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {LessonSubtitlesLive ? (
            <LessonSubtitlesLive
              onCaptionsChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            />
          ) : (
            <Text className="body-sm text-neutral-gray600">Loading captions...</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
