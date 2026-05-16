import type { Lesson, LessonVisualStatus } from '@/types/learning';

export function getLessonVisualStatus(
  lesson: Lesson,
  lessonIndex: number,
  lessons: Lesson[],
  completedLessonIds: string[]
): LessonVisualStatus {
  if (completedLessonIds.includes(lesson.id)) {
    return 'completed';
  }

  const firstIncompleteIndex = lessons.findIndex(
    (l) => !completedLessonIds.includes(l.id)
  );

  if (lessonIndex === firstIncompleteIndex) {
    return 'in-progress';
  }

  return 'available';
}

export function getInProgressLesson(
  lessons: Lesson[],
  completedLessonIds: string[]
): Lesson | undefined {
  return lessons.find((l) => !completedLessonIds.includes(l.id));
}
