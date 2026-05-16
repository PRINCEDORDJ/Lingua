import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { TeacherSpeechBubble } from './TeacherSpeechBubble';

interface TeacherPreviewCardProps {
  teacherImage: ImageSourcePropType;
  backgroundImage: ImageSourcePropType;
  userInsetImage: ImageSourcePropType;
  showUserInset: boolean;
  primaryLine: string;
  secondaryLine: string;
}

const CARD_HEIGHT = Math.min(Dimensions.get('window').height * 0.42, 320);

export const TeacherPreviewCard: React.FC<TeacherPreviewCardProps> = ({
  teacherImage,
  backgroundImage,
  userInsetImage,
  showUserInset,
  primaryLine,
  secondaryLine,
}) => {
  return (
    <View className="mx-4 mt-2 overflow-hidden rounded-2xl" style={{ height: CARD_HEIGHT }}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: 0.85 }}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View className="flex-1 items-center justify-center px-4 pb-16 pt-6">
        <Image
          source={teacherImage}
          style={styles.teacherImage}
          resizeMode="contain"
          accessibilityLabel="AI teacher mascot"
        />

        {showUserInset ? (
          <View style={styles.userInset} className="overflow-hidden rounded-xl border-2 border-neutral-white">
            <Image
              source={userInsetImage}
              className="h-full w-full"
              resizeMode="cover"
              accessibilityLabel="Your preview"
            />
          </View>
        ) : null}
      </View>

      <View style={styles.bubblePosition}>
        <TeacherSpeechBubble primary={primaryLine} secondary={secondaryLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 45, 45, 0.55)',
  },
  teacherImage: {
    marginTop: 120,
    width: '48%',
    height: '70%',
    maxHeight: 200,
  },
  userInset: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 72,
    height: 96,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bubblePosition: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
});
