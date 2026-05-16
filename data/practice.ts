import { Ionicons } from "@expo/vector-icons";

export interface PracticeSession {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  type: 'mistakes' | 'pronunciation' | 'listening' | 'unit-review';
}

export const practiceSessions: PracticeSession[] = [
  {
    id: 'mistakes',
    title: 'Mistakes Review',
    description: 'Review the words you missed recently',
    icon: 'alert-circle',
    color: '#FF4B4B',
    type: 'mistakes',
  },
  {
    id: 'pronunciation',
    title: 'Pronunciation',
    description: 'Speak out loud with AI assistance',
    icon: 'mic',
    color: '#1CB0F6',
    type: 'pronunciation',
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Listen to native speakers and respond',
    icon: 'headset',
    color: '#CE82FF',
    type: 'listening',
  },
  {
    id: 'unit-review',
    title: 'Unit Review',
    description: 'Master everything from Unit 1',
    icon: 'ribbon',
    color: '#58CC02',
    type: 'unit-review',
  },
];
