import type { ImageSourcePropType } from 'react-native';
import { images } from '@/constants/images';
import { getPicsumThumbnailUri, getTeacherMascotImage } from '@/lib/images';

export function getTeacherImage(): ImageSourcePropType {
  return getTeacherMascotImage();
}

export function getPreviewBackgroundImage(): ImageSourcePropType {
  if (images.unitHeroCafe) return images.unitHeroCafe;
  return { uri: getPicsumThumbnailUri('audio-lesson-room', 800) };
}

export function getUserInsetImage(seed: string): ImageSourcePropType {
  return { uri: getPicsumThumbnailUri(`user-${seed}`, 120) };
}
