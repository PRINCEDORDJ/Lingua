export type ActivityType = 
  | 'multiple-choice' 
  | 'translation' 
  | 'listening' 
  | 'speaking' 
  | 'ai-tutor'
  | 'matching';

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  options?: string[]; // Used for multiple-choice and matching
  correctAnswer: string;
  audioUrl?: string;
  imageUrl?: string;
  explanation?: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  exampleSentence?: string;
  audioUrl?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  audioUrl?: string;
}

export interface LessonGoal {
  id: string;
  description: string;
}

export interface AITeacherPrompt {
  id: string;
  context: string;
  instructions: string;
  sampleDialogues: { 
    role: 'teacher' | 'student'; 
    text: string;
  }[];
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'review' | 'ai-lesson';
  xpReward: number;
  activities: Activity[];
  vocabulary?: Vocabulary[];
  phrases?: Phrase[];
  goals?: LessonGoal[];
  aiTeacherPrompt?: AITeacherPrompt;
}

export interface Unit {
  id: string;
  languageId: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Language {
  id: string;
  name: string;
  code: string;
  flag: string; // e.g., '🇪🇸' or 'fr'
  units: Unit[];
}
