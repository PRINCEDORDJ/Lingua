import { Unit } from '../types/learning';
import { lessons } from './lessons';

export const units: Record<string, Unit[]> = {
  'es': [
    {
      id: 'es-unit-1',
      languageId: 'es',
      title: 'Unit 1: Basics',
      description: 'Start your Spanish journey with common greetings and objects.',
      lessons: lessons['es-unit-1'] || [],
    }
  ],
  'fr': [
    {
      id: 'fr-unit-1',
      languageId: 'fr',
      title: 'Unit 1: Foundations',
      description: 'Learn the essentials of French conversation.',
      lessons: lessons['fr-unit-1'] || [],
    }
  ],
  'ja': [
    {
      id: 'ja-unit-1',
      languageId: 'ja',
      title: 'Unit 1: Characters',
      description: 'Introduction to Japanese writing systems.',
      lessons: lessons['ja-unit-1'] || [],
    }
  ],
  'en': [
    {
      id: 'en-unit-1',
      languageId: 'en',
      title: 'Unit 1: Essentials',
      description: 'Basic survival English for travelers.',
      lessons: lessons['en-unit-1'] || [],
    }
  ],
  'de': [
    {
      id: 'de-unit-1',
      languageId: 'de',
      title: 'Unit 1: Grundlagen',
      description: 'Start your German journey with basics.',
      lessons: lessons['de-unit-1'] || [],
    }
  ],
  'it': [
    {
      id: 'it-unit-1',
      languageId: 'it',
      title: 'Unit 1: Fondamenta',
      description: 'Start your Italian journey with basics.',
      lessons: lessons['it-unit-1'] || [],
    }
  ]
};
