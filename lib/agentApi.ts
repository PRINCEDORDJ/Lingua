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
): Promise<{ session_id: string }> {
  const response = await authorizedFetch('/api/agent/start', getToken, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'Failed to start AI teacher');
  }

  return response.json() as Promise<{ session_id: string }>;
}

export async function stopAgent(
  getToken: GetTokenFn,
  sessionId: string
): Promise<void> {
  const response = await authorizedFetch(
    `/api/agent/stop?sessionId=${sessionId}`,
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
