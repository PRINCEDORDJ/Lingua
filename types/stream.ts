export type AudioCallStatus =
  | 'idle'
  | 'loading'
  | 'connecting'
  | 'joined'
  | 'error'
  | 'ended';

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
