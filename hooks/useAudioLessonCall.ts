import { useAuth } from '@clerk/expo';
import {
  StreamVideoClient,
  type Call,
  type User,
} from '@stream-io/video-react-native-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createLessonCall, fetchStreamCredentials } from '@/lib/stream/api';
import type { AudioCallStatus } from '@/types/stream';

interface UseAudioLessonCallParams {
  lessonId: string;
  languageId: string;
  userName?: string | null;
  userImageUrl?: string | null;
  enabled?: boolean;
}

interface UseAudioLessonCallResult {
  status: AudioCallStatus;
  errorMessage: string | null;
  micMuted: boolean;
  client: StreamVideoClient | null;
  call: Call | null;
  toggleMic: () => Promise<void>;
  endCall: () => Promise<void>;
  retry: () => void;
}

export function useAudioLessonCall({
  lessonId,
  languageId,
  userName,
  userImageUrl,
  enabled = true,
}: UseAudioLessonCallParams): UseAudioLessonCallResult {
  const { getToken, isSignedIn } = useAuth();
  const [status, setStatus] = useState<AudioCallStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);

  const retry = useCallback(() => {
    setErrorMessage(null);
    setStatus('idle');
    setRetryKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !isSignedIn) {
      return;
    }

    let mounted = true;
    let activeCall: Call | null = null;
    let activeClient: StreamVideoClient | null = null;

    const timer = setTimeout(async () => {
      if (!mounted) {
        return;
      }

      try {
        setStatus('loading');
        setErrorMessage(null);

        const getClerkToken = () => getToken();
        const credentials = await fetchStreamCredentials(getClerkToken, {
          name: userName,
          imageUrl: userImageUrl,
        });

        if (!mounted) {
          return;
        }

        const lessonCall = await createLessonCall(getClerkToken, {
          lessonId,
          languageId,
        });

        if (!mounted) {
          return;
        }

        const streamUser: User = {
          id: credentials.userId,
          name: userName ?? undefined,
          image: userImageUrl ?? undefined,
        };

        const tokenProvider = async () => {
          const refreshed = await fetchStreamCredentials(getClerkToken, {
            name: userName,
            imageUrl: userImageUrl,
          });
          return refreshed.token;
        };

        activeClient = StreamVideoClient.getOrCreateInstance({
          apiKey: credentials.apiKey,
          user: streamUser,
          token: credentials.token,
          tokenProvider,
        });

        activeCall = activeClient.call(lessonCall.callType, lessonCall.callId);
        callRef.current = activeCall;
        clientRef.current = activeClient;

        setClient(activeClient);
        setCall(activeCall);
        setStatus('connecting');

        await activeCall.join();

        if (!mounted) {
          await activeCall.leave().catch(() => undefined);
          await activeClient.disconnectUser().catch(() => undefined);
          return;
        }

        await activeCall.camera.disable();
        await activeCall.microphone.enable();
        setMicMuted(false);
        setStatus('joined');
      } catch (error) {
        if (!mounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Could not start audio lesson';

        if (activeCall) {
          await activeCall.leave().catch(() => undefined);
        }
        if (activeClient) {
          await activeClient.disconnectUser().catch(() => undefined);
        }

        callRef.current = null;
        clientRef.current = null;
        setCall(null);
        setClient(null);
        setErrorMessage(message);
        setStatus('error');
      }
    }, 50);

    return () => {
      mounted = false;
      clearTimeout(timer);

      const cleanup = async () => {
        const currentCall = callRef.current;
        const currentClient = clientRef.current;

        callRef.current = null;
        clientRef.current = null;

        if (currentCall) {
          await currentCall.leave().catch(() => undefined);
        }
        if (currentClient) {
          await currentClient.disconnectUser().catch(() => undefined);
        }
      };

      void cleanup();
    };
  }, [
    enabled,
    getToken,
    isSignedIn,
    languageId,
    lessonId,
    retryKey,
    userImageUrl,
    userName,
  ]);

  const toggleMic = useCallback(async () => {
    const activeCall = callRef.current;
    if (!activeCall || status !== 'joined') {
      return;
    }

    if (micMuted) {
      await activeCall.microphone.enable();
      setMicMuted(false);
    } else {
      await activeCall.microphone.disable();
      setMicMuted(true);
    }
  }, [micMuted, status]);

  const endCall = useCallback(async () => {
    const activeCall = callRef.current;
    const activeClient = clientRef.current;

    setStatus('ended');

    if (activeCall) {
      try {
        await activeCall.leave();
      } catch {
        // ignore leave errors during teardown
      }
    }

    if (activeClient) {
      await activeClient.disconnectUser().catch(() => undefined);
    }

    callRef.current = null;
    clientRef.current = null;
    setCall(null);
    setClient(null);
  }, []);

  return {
    status,
    errorMessage,
    micMuted,
    client,
    call,
    toggleMic,
    endCall,
    retry,
  };
}
