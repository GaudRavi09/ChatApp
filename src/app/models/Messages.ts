import { Timestamp } from 'firebase/firestore';

export interface Messages {
  status: string;
  content: string;
  senderId: string;
  sentAt: Timestamp;
  messageType: string;
}
