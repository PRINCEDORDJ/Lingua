import { jsonError, requireClerkUserId } from '@/lib/stream/server';
import { stopAgentSession } from '@/lib/vision-agent/server';

export async function DELETE(request: Request) {
  try {
    await requireClerkUserId(request);
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return jsonError('sessionId is required', 400);
    }

    await stopAgentSession(sessionId);
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return jsonError(error instanceof Error ? error.message : 'Failed to stop agent');
  }
}
