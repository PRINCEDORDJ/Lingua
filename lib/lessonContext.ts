import { lessons } from '@/data/lessons';
import { languages } from '@/data/languages';
import type { Language, Lesson, Unit } from '@/types/learning';
import { enrichLesson } from '@/lib/enrichLesson';

export interface LessonContext {
  lesson: Lesson;
  language: Language;
  unit: Unit | null;
}

export function getLessonById(id: string): Lesson | undefined {
  for (const unitLessons of Object.values(lessons)) {
    const found = unitLessons.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}

function findUnitForLesson(lesson: Lesson, languageId?: string | null): Unit | null {
  const language = languages.find(
    (l) => l.id === languageId || lesson.unitId.startsWith(l.id)
  );
  if (!language) return null;

  return language.units.find((u) => u.id === lesson.unitId) ?? null;
}

export function getLessonContext(
  lessonId: string,
  selectedLanguageId?: string | null
): LessonContext | null {
  const rawLesson = getLessonById(lessonId);
  if (!rawLesson) return null;

  const languageId =
    selectedLanguageId ?? rawLesson.unitId.split('-')[0] ?? null;

  const language =
    languages.find((l) => l.id === languageId) ??
    languages.find((l) => rawLesson.unitId.startsWith(l.id));

  if (!language) return null;

  const unit = findUnitForLesson(rawLesson, language.id);
  const lesson = enrichLesson(rawLesson, language);

  return { lesson, language, unit };
}

export function getTeacherBubbleLines(lesson: Lesson): {
  primary: string;
  secondary: string;
} {
  const teacherDialogue = lesson.aiTeacherPrompt?.sampleDialogues.find(
    (d) => d.role === 'teacher'
  );

  const primary =
    teacherDialogue?.text ??
    lesson.phrases?.[0]?.text ??
    `Let's practice ${lesson.title}!`;

  const encouragement =
    lesson.aiTeacherPrompt?.sampleDialogues.find((d) => d.role === 'teacher')
      ?.text === '¡Muy bien!'
      ? 'That was great! 👏'
      : undefined;

  const secondary =
    encouragement ?? lesson.phrases?.[0]?.translation ?? 'That was great!';

  return { primary, secondary };
}
