const VISION_AGENT_URL = process.env.VISION_AGENT_URL || 'http://localhost:8080';

const DEFAULT_FETCH_TIMEOUT_MS = 5000;

function getFetchTimeoutMs(): number {
  const raw = process.env.VISION_AGENT_FETCH_TIMEOUT_MS;
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_FETCH_TIMEOUT_MS;
}

async function fetchVisionAgent(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutMs = getFetchTimeoutMs();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Vision Agent request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function startAgentSession(params: {
  callId: string;
  callType: string;
}) {
  try {
    const callId = encodeURIComponent(params.callId);
    const response = await fetchVisionAgent(`${VISION_AGENT_URL}/calls/${callId}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call_type: params.callType,
      }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as {
        detail?: string;
        message?: string;
      };
      throw new Error(error.message || `Vision Agent server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[vision-agent/start]', error);
    throw error;
  }
}

export async function stopAgentSession(params: {
  callId: string;
  sessionId: string;
}) {
  try {
    const callId = encodeURIComponent(params.callId);
    const sessionId = encodeURIComponent(params.sessionId);
    const response = await fetchVisionAgent(`${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as {
        detail?: string;
        message?: string;
      };
      throw new Error(error.message || `Vision Agent server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[vision-agent/stop]', error);
    throw error;
  }
}
