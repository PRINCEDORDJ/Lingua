import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createLessonCall, fetchStreamCredentials } from '@/lib/stream/api';
import { isExpoGo, loadStreamSdk } from '@/lib/stream/loadStreamSdk';
import { startAgent, stopAgent } from '@/lib/agentApi';
import type { AgentSessionInfo, AudioCallStatus, AgentStatus } from '@/types/stream';

interface UseAudioLessonCallParams {
  lessonId: string;
  languageId: string;
  userName?: string | null;
  userImageUrl?: string | null;
  enabled?: boolean;
}

interface UseAudioLessonCallResult {
  status: AudioCallStatus;
  agentStatus: AgentStatus;
  errorMessage: string | null;
  micMuted: boolean;
  streamAvailable: boolean;
  client: unknown;
  call: unknown;
  toggleMic: () => Promise<void>;
  endCall: () => Promise<void>;
  retry: () => void;
}

const EXPO_GO_MESSAGE =
  'Live audio calls need a development build. Run npx expo run:android (or :ios). You can still use the lesson UI in Expo Go.';

export function useAudioLessonCall({
  lessonId,
  languageId,
  userName,
  userImageUrl,
  enabled = true,
}: UseAudioLessonCallParams): UseAudioLessonCallResult {
  const { getToken, isSignedIn } = useAuth();
  const [status, setStatus] = useState<AudioCallStatus>('idle');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [streamAvailable, setStreamAvailable] = useState(false);
  const [client, setClient] = useState<unknown>(null);
  const [call, setCall] = useState<unknown>(null);
  const [retryKey, setRetryKey] = useState(0);

  const callRef = useRef<unknown>(null);
  const clientRef = useRef<unknown>(null);
  const agentSessionRef = useRef<AgentSessionInfo | null>(null);
  const previewMicRef = useRef(false);

  const retry = useCallback(() => {
    setErrorMessage(null);
    setStatus('idle');
    setAgentStatus('idle');
    setRetryKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !isSignedIn) {
      return;
    }

    if (isExpoGo()) {
      setStreamAvailable(false);
      setStatus('idle');
      setErrorMessage(null);
      return;
    }

    let mounted = true;
    type LessonCall = {
      join: () => Promise<void>;
      leave: () => Promise<void>;
      camera: { disable: () => Promise<void> };
      microphone: { enable: () => Promise<void>; disable: () => Promise<void> };
    };

    type StreamClientInstance = {
      call: (type: string, id: string) => LessonCall;
      disconnectUser: () => Promise<void>;
    };

    let activeCall: LessonCall | null = null;
    let activeClient: StreamClientInstance | null = null;

    const timer = setTimeout(async () => {
      if (!mounted) {
        return;
      }

      try {
        setStatus('loading');
        setErrorMessage(null);

        const sdk = await loadStreamSdk();
        if (!sdk) {
          if (!mounted) return;
          setStreamAvailable(false);
          setStatus('error');
          setErrorMessage(EXPO_GO_MESSAGE);
          return;
        }

        setStreamAvailable(true);

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

        const streamUser = {
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

        activeClient = sdk.StreamVideoClient.getOrCreateInstance({
          apiKey: credentials.apiKey,
          user: streamUser,
          token: credentials.token,
          tokenProvider,
        }) as StreamClientInstance;

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

        // Start Vision Agent
        try {
          setAgentStatus('connecting');
          const session = await startAgent(getClerkToken, {
            callId: lessonCall.callId,
            callType: lessonCall.callType,
          });
          agentSessionRef.current = session;
          setAgentStatus('connected');
        } catch (agentError) {
          console.error('[agent/start] error', agentError);
          setAgentStatus('failed');
        }
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
        const currentCall = callRef.current as {
          leave: () => Promise<void>;
        } | null;
        const currentClient = clientRef.current as {
          disconnectUser: () => Promise<void>;
        } | null;
        const currentAgentSession = agentSessionRef.current;

        callRef.current = null;
        clientRef.current = null;
        agentSessionRef.current = null;

        if (currentAgentSession) {
          await stopAgent(getToken, {
            callId: currentAgentSession.call_id,
            sessionId: currentAgentSession.session_id,
          }).catch(() => undefined);
        }
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
    const activeCall = callRef.current as {
      microphone: { enable: () => Promise<void>; disable: () => Promise<void> };
    } | null;

    if (activeCall && status === 'joined') {
      if (micMuted) {
        await activeCall.microphone.enable();
        setMicMuted(false);
      } else {
        await activeCall.microphone.disable();
        setMicMuted(true);
      }
      return;
    }

    previewMicRef.current = !previewMicRef.current;
    setMicMuted(previewMicRef.current);
  }, [micMuted, status]);

  const endCall = useCallback(async () => {
    const activeCall = callRef.current as { leave: () => Promise<void> } | null;
    const activeClient = clientRef.current as {
      disconnectUser: () => Promise<void>;
    } | null;
    const currentAgentSession = agentSessionRef.current;

    if (activeCall || activeClient || currentAgentSession) {
      setStatus('ended');
      setAgentStatus('idle');

      if (currentAgentSession) {
        await stopAgent(getToken, {
          callId: currentAgentSession.call_id,
          sessionId: currentAgentSession.session_id,
        }).catch(() => undefined);
        agentSessionRef.current = null;
      }

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
    }

    previewMicRef.current = false;
    setMicMuted(false);
  }, [getToken]);

  return {
    status,
    agentStatus,
    errorMessage: isExpoGo() ? null : errorMessage,
    micMuted,
    streamAvailable,
    client,
    call,
    toggleMic,
    endCall,
    retry,
  };
}
