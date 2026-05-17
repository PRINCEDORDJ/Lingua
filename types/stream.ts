export type AudioCallStatus =
  | 'idle'
  | 'loading'
  | 'connecting'
  | 'joined'
  | 'error'
  | 'ended';

export type AgentStatus = 'idle' | 'connecting' | 'connected' | 'failed';

export interface StreamCredentials {
  apiKey: string;
  userId: string;
  token: string;
}

export interface LessonCallInfo {
  callType: string;
  callId: string;
  callCid: string;
}

export interface AgentSessionInfo {
  session_id: string;
  call_id: string;
  session_started_at?: string;
}
