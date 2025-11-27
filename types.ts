export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  grade?: string;
  goal?: string;
}

export interface Feedback {
  isHelpful: boolean;
  comment?: string;
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  feedback?: Feedback;
  attachment?: Attachment;
}

export interface ChatSession {
  id: string;
  type: 'tutor' | 'counsellor';
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export interface PYQAnalysis {
  id: string;
  subject: string;
  topics: {
    topic: string;
    importance: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  predictedQuestions: {
    question: string;
    answer: string;
    explanation: string;
    probabilityScore: number;
  }[];
  timestamp: number;
}

export interface RoutineItem {
  time: string;
  activity: string;
  category: 'academic' | 'personal' | 'health';
  completed: boolean;
}

export interface Routine {
  id: string;
  date: string;
  items: RoutineItem[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}