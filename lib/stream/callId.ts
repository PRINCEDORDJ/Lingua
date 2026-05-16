export function buildLessonCallId(languageId: string, lessonId: string): string {
  return `lesson-${languageId}-${lessonId}`;
}
