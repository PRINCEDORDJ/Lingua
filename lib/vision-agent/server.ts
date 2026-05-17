import { jsonError } from '@/lib/stream/server';

const VISION_AGENT_URL = process.env.VISION_AGENT_URL || 'http://localhost:8080';

export async function startAgentSession(params: {
  callId: string;
  callType: string;
  [key: string]: any;
}) {
  try {
    const response = await fetch(`${VISION_AGENT_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Vision Agent server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[vision-agent/start]', error);
    throw error;
  }
}

export async function stopAgentSession(sessionId: string) {
  try {
    const response = await fetch(`${VISION_AGENT_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Vision Agent server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[vision-agent/stop]', error);
    throw error;
  }
}
