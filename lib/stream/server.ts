import { verifyToken } from '@clerk/backend';
import { StreamClient } from '@stream-io/node-sdk';
import { getLessonContext } from '@/lib/lessonContext';
import { buildLessonCallId } from '@/lib/stream/callId';

const CALL_TYPE = 'default';

function getStreamSecret(): string | undefined {
  return process.env.STREAM_API_SECRET ?? process.env.STREAM_SECRET_KEY;
}

function getStreamClient(): StreamClient {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = getStreamSecret();

  if (!apiKey || !apiSecret) {
    throw new Error(
      'Stream credentials are not configured. Set STREAM_API_KEY and STREAM_API_SECRET (or STREAM_SECRET_KEY).'
    );
  }

  return new StreamClient(apiKey, apiSecret);
}

export async function requireClerkUserId(request: Request): Promise<string> {
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Clerk secret key is not configured on the server.');
  }

  const authorization = request.headers.get('Authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (!token) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await verifyToken(token, { secretKey });
    if (!payload.sub) {
      throw new Error('Missing user id in token');
    }
    return payload.sub;
  } catch {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function createStreamUserToken(
  userId: string,
  profile?: { name?: string | null; imageUrl?: string | null }
): Promise<{ apiKey: string; userId: string; token: string }> {
  const client = getStreamClient();
  const apiKey = process.env.STREAM_API_KEY!;

  await client.upsertUsers([
    {
      id: userId,
      name: profile?.name ?? userId,
      image: profile?.imageUrl ?? undefined,
    },
  ]);

  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: 60 * 60,
  });

  return { apiKey, userId, token };
}

export async function getOrCreateLessonCall(params: {
  userId: string;
  lessonId: string;
  languageId: string;
}) {
  const context = getLessonContext(params.lessonId, params.languageId);

  if (!context) {
    throw new Response(JSON.stringify({ error: 'Lesson not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { lesson, language } = context;
  const callId = buildLessonCallId(language.id, lesson.id);
  const client = getStreamClient();
  const call = client.video.call(CALL_TYPE, callId);

  await call.getOrCreate({
    data: {
      created_by_id: params.userId,
      members: [
        { user_id: params.userId, role: 'admin' },
        { user_id: 'ai-language-teacher', role: 'admin' },
      ],
      custom: {
        lessonId: lesson.id,
        languageId: language.id,
        lessonTitle: lesson.title,
        languageName: language.name,
        lessonGoal: lesson.goals?.[0]?.description ?? lesson.description,
        vocabulary: lesson.vocabulary,
        phrases: lesson.phrases,
        teacherInstructions: lesson.aiTeacherPrompt?.instructions,
        teacherContext: lesson.aiTeacherPrompt?.context,
      },
      settings_override: {
        audio: {
          default_device: 'speaker',
          mic_default_on: true,
        },
        video: {
          camera_default_on: false,
        },
      },
    },
  });

  return {
    callType: CALL_TYPE,
    callId,
    callCid: call.cid,
  };
}

export function jsonError(message: string, status = 500): Response {
  return Response.json({ error: message }, { status });
}
