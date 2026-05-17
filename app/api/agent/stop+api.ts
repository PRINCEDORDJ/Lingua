import { jsonError, requireClerkUserId } from '@/lib/stream/server';
import { stopAgentSession } from '@/lib/vision-agent/server';

export async function DELETE(request: Request) {
  try {
    await requireClerkUserId(request);
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('callId');
    const sessionId = searchParams.get('sessionId');

    if (!callId || !sessionId) {
      return jsonError('callId and sessionId are required', 400);
    }

    await stopAgentSession({ callId, sessionId });
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return jsonError(error instanceof Error ? error.message : 'Failed to stop agent');
  }
}
