import {
  createStreamUserToken,
  jsonError,
  requireClerkUserId,
} from '@/lib/stream/server';

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json().catch(() => ({}))) as {
      name?: string | null;
      imageUrl?: string | null;
    };

    const credentials = await createStreamUserToken(userId, {
      name: body.name,
      imageUrl: body.imageUrl,
    });

    return Response.json(credentials);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error('[stream/token]', error);
    return jsonError(
      error instanceof Error ? error.message : 'Failed to create Stream token'
    );
  }
}
