import type { Language, Lesson } from '@/types/learning';

const LANGUAGE_TEACHER_LABEL: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
  en: 'English',
  de: 'German',
  it: 'Italian',
  ko: 'Korean',
  zh: 'Chinese',
};

export function enrichLesson(lesson: Lesson, language: Language): Lesson {
  if (lesson.goals && lesson.phrases && lesson.aiTeacherPrompt) {
    return lesson;
  }

  const langLabel =
    LANGUAGE_TEACHER_LABEL[language.id] ?? language.name;

  const goals = lesson.goals ?? [
    { id: `${lesson.id}-g1`, description: `Learn key ${lesson.title} vocabulary` },
    {
      id: `${lesson.id}-g2`,
      description: `Practice ${lesson.title.toLowerCase()} in conversation`,
    },
  ];

  const phrases = lesson.phrases ?? [
    {
      id: `${lesson.id}-p1`,
      text: lesson.title,
      translation: lesson.description,
    },
    {
      id: `${lesson.id}-p2`,
      text: lesson.description,
      translation: `Practice for ${lesson.title}`,
    },
  ];

  const aiTeacherPrompt = lesson.aiTeacherPrompt ?? {
    id: `${lesson.id}-tp`,
    context: `You are a friendly ${langLabel} teacher helping a beginner with "${lesson.title}". ${lesson.description}`,
    instructions: `Guide the student through ${lesson.title}. Stay encouraging and keep responses short.`,
    sampleDialogues: [
      {
        role: 'teacher',
        text: getDefaultTeacherLine(language.id, lesson.type),
      },
      {
        role: 'student',
        text: getDefaultStudentLine(language.id),
      },
    ],
  };

  return {
    ...lesson,
    goals,
    phrases,
    aiTeacherPrompt,
  };
}

function getDefaultTeacherLine(
  languageId: string,
  type: Lesson['type']
): string {
  const lines: Record<string, string> = {
    es: type === 'conversation' ? '¡Muy bien!' : '¡Excelente trabajo!',
    fr: type === 'conversation' ? 'Très bien !' : 'Excellent travail !',
    ja: type === 'conversation' ? 'よくできました！' : '素晴らしい！',
    en: type === 'conversation' ? 'Great job!' : 'Well done!',
    de: type === 'conversation' ? 'Sehr gut!' : 'Ausgezeichnet!',
    it: type === 'conversation' ? 'Molto bene!' : 'Ottimo lavoro!',
  };
  return lines[languageId] ?? 'Great work!';
}

function getDefaultStudentLine(languageId: string): string {
  const lines: Record<string, string> = {
    es: 'Gracias, profesor.',
    fr: 'Merci, professeur.',
    ja: 'ありがとう、先生。',
    en: 'Thank you, teacher.',
    de: 'Danke, Lehrer.',
    it: 'Grazie, insegnante.',
  };
  return lines[languageId] ?? 'Thank you!';
}
