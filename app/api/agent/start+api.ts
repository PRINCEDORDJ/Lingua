import { jsonError, requireClerkUserId } from '@/lib/stream/server';
import { startAgentSession } from '@/lib/vision-agent/server';

export async function POST(request: Request) {
  try {
    await requireClerkUserId(request);
    const body = await request.json();

    if (!body.callId || !body.callType) {
      return jsonError('callId and callType are required', 400);
    }

    const session = await startAgentSession({
      callId: body.callId,
      callType: body.callType,
    });
    return Response.json(session);
  } catch (error) {
    if (error instanceof Response) return error;
    return jsonError(error instanceof Error ? error.message : 'Failed to start agent');
  }
}
