const VISION_AGENT_URL = process.env.VISION_AGENT_URL || 'http://localhost:8080';

export async function startAgentSession(params: {
  callId: string;
  callType: string;
}) {
  try {
    const callId = encodeURIComponent(params.callId);
    const response = await fetch(`${VISION_AGENT_URL}/calls/${callId}/sessions`, {
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
    const response = await fetch(`${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}`, {
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
