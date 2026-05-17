import type { AgentSessionInfo } from '@/types/stream';

type GetTokenFn = () => Promise<string | null>;

async function authorizedFetch(
  path: string,
  getToken: GetTokenFn,
  init?: RequestInit
): Promise<Response> {
  const token = await getToken();

  if (!token) {
    throw new Error('You must be signed in.');
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

export async function startAgent(
  getToken: GetTokenFn,
  params: { callId: string; callType: string }
): Promise<AgentSessionInfo> {
  const response = await authorizedFetch('/api/agent/start', getToken, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'Failed to start AI teacher');
  }

  return response.json() as Promise<AgentSessionInfo>;
}

export async function stopAgent(
  getToken: GetTokenFn,
  params: { callId: string; sessionId: string }
): Promise<void> {
  const query = new URLSearchParams({
    callId: params.callId,
    sessionId: params.sessionId,
  });

  const response = await authorizedFetch(
    `/api/agent/stop?${query.toString()}`,
    getToken,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'Failed to stop AI teacher');
  }
}
