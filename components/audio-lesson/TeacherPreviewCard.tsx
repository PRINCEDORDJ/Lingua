import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';

interface TeacherPreviewCardProps {
  teacherImage: ImageSourcePropType;
  backgroundImage: ImageSourcePropType;
}

const CARD_HEIGHT = Math.min(Dimensions.get('window').height * 0.42, 320);

export const TeacherPreviewCard: React.FC<TeacherPreviewCardProps> = ({
  teacherImage,
  backgroundImage,
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

      <View className="flex-1 items-center justify-center px-4">
        <Image
          source={teacherImage}
          style={styles.teacherImage}
          resizeMode="contain"
          accessibilityLabel="AI teacher mascot"
        />
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
    width: '100%',
    height: '100%',
    minHeight: '80%',
    maxHeight: 250,
    position: 'absolute',
    bottom: -45,
  },
});
