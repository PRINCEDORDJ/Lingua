import {
  getOrCreateLessonCall,
  jsonError,
  requireClerkUserId,
} from '@/lib/stream/server';

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as {
      lessonId?: string;
      languageId?: string;
    };

    if (!body.lessonId || !body.languageId) {
      return jsonError('lessonId and languageId are required', 400);
    }

    const call = await getOrCreateLessonCall({
      userId,
      lessonId: body.lessonId,
      languageId: body.languageId,
    });

    return Response.json(call);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error('[stream/call]', error);
    return jsonError(
      error instanceof Error ? error.message : 'Failed to create lesson call'
    );
  }
}
