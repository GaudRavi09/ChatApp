import { FieldValue, Timestamp } from 'firebase/firestore';

export interface ChatRoom {
  joiningData: {
    userId: string;
    joinedAt: number;
    role?: 'admin' | 'member';
  }[];
  admins?: string[];
  groupName?: string;
  participants: string[];
  chatType: '1v1' | 'group';
  createdAt: Date | Timestamp | FieldValue;
}
