import type { ImageSourcePropType } from 'react-native';
import { images } from '@/constants/images';
import type { Lesson } from '@/types/learning';

const UNIT_HERO_MAP: Record<string, keyof typeof images> = {
  unit_hero_cafe: 'unitHeroCafe',
  palace: 'palace',
  treasure: 'treasure',
};

export function getPicsumThumbnailUri(seed: string, size = 96): string {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}

export function getLessonImage(lesson: Lesson): ImageSourcePropType {
  if (lesson.imageKey && lesson.imageKey in images) {
    return images[lesson.imageKey as keyof typeof images];
  }

  if (lesson.imageUrl) {
    return { uri: lesson.imageUrl };
  }

  return { uri: getPicsumThumbnailUri(lesson.id) };
}

export function getTeacherMascotImage(): ImageSourcePropType {
  if (images.mascotAuth) return images.mascotAuth;
  if (images.mascotWelcome) return images.mascotWelcome;
  if (images.mascotLogo) return images.mascotLogo;
  return images.unitHeroCafe;
}

export function getUnitHeroImage(imageKey?: string): ImageSourcePropType {
  if (!imageKey) {
    return images.unitHeroCafe;
  }

  const mapped = UNIT_HERO_MAP[imageKey];
  if (mapped && images[mapped]) {
    return images[mapped];
  }

  return { uri: getPicsumThumbnailUri(`unit-${imageKey}`, 400) };
}
