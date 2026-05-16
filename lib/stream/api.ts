import type { LessonCallInfo, StreamCredentials } from '@/types/stream';

type GetTokenFn = () => Promise<string | null>;

async function authorizedFetch(
  path: string,
  getToken: GetTokenFn,
  init?: RequestInit
): Promise<Response> {
  const token = await getToken();

  if (!token) {
    throw new Error('You must be signed in to start an audio lesson.');
  }

  return fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
}

export async function fetchStreamCredentials(
  getToken: GetTokenFn,
  profile?: { name?: string | null; imageUrl?: string | null }
): Promise<StreamCredentials> {
  const response = await authorizedFetch('/api/stream/token', getToken, {
    method: 'POST',
    body: JSON.stringify(profile ?? {}),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'Failed to fetch Stream credentials');
  }

  return response.json() as Promise<StreamCredentials>;
}

export async function createLessonCall(
  getToken: GetTokenFn,
  params: { lessonId: string; languageId: string }
): Promise<LessonCallInfo> {
  const response = await authorizedFetch('/api/stream/call', getToken, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'Failed to create lesson call');
  }

  return response.json() as Promise<LessonCallInfo>;
}
