import { Injectable } from '@angular/core';
import { FireStore } from '../enums/enums';
import { ChatRoom } from '../models/ChatRoom';
import { FirebaseService } from './firebase.service';
import { query, where, addDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private firebaseService: FirebaseService) {}

  // find or create 1v1 chat between two users
  findOrCreateOneToOneChat(currentUserId: string, otherUserId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // reference to the 'chats' collection in fireStore
        const collectionRef = collection(this.firebaseService.fireStore, FireStore.CHAT_ROOMS);

        // query to find existing 1v1 chats where the current user is a participant
        const collectionQuery = query(
          collectionRef,
          where('chatType', '==', '1v1'), // filter for 1-on-1 chat type
          where('participants', 'array-contains', currentUserId), // check if the current user is a participant
        );

        let chatId = ''; // variable to store the chat ID if found

        // execute the query to fetch all relevant documents
        const querySnapshot = await getDocs(collectionQuery);

        // loop through each document in the query result
        querySnapshot.forEach((doc) => {
          const participants = doc.data()['participants']; // get participants from the chat document

          // check if the other user is also a participant in this chat
          if (participants.includes(otherUserId)) {
            chatId = doc.id; // set the chat ID if the chat with both users exists
          }
        });

        // if no existing chat is found, create a new 1v1 chat room
        if (!chatId) {
          const data: ChatRoom = {
            chatType: '1v1', // set chat type to 1v1
            createdAt: serverTimestamp(), // timestamp for when the chat was created
            participants: [currentUserId, otherUserId], // both users as participants
            joiningData: [
              { userId: otherUserId, joinedAt: Date.now() }, // track when the other user joined
              { userId: currentUserId, joinedAt: Date.now() }, // track when the current user joined
            ],
          };

          // add the new chat document to the fireStore collection
          const newChatDocRef = await addDoc(collectionRef, data);

          // resolve the promise with the newly created chat ID
          resolve(newChatDocRef.id);
        } else {
          // if an existing chat is found, return its chat ID
          resolve(chatId);
        }
      } catch (error: any) {
        console.error('Error finding or creating 1v1 chat: ', error);
        // reject the promise with the error message
        reject(`Failed to find or create chat: ${error.message}`);
      }
    });
  }

  createGroupChat(creatorId: string, groupName: string, initialMembers: string[]): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const newChatRoomData: ChatRoom = {
        groupName,
        chatType: 'group',
        admins: [creatorId],
        createdAt: serverTimestamp(),
        participants: initialMembers,
        joiningData: [
          { userId: creatorId, joinedAt: Date.now(), role: 'admin' },
          ...initialMembers.map((userId) => ({
            userId: userId,
            joinedAt: Date.now(),
            role: 'member' as any,
          })),
        ],
      };

      try {
        const collectionRef = collection(this.firebaseService.fireStore, FireStore.CHAT_ROOMS);
        await addDoc(collectionRef, newChatRoomData);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // function to send a new message to a chat
  async sendMessage(chatId: string, senderId: string, content: string): Promise<void> {
    try {
      // data structure for the message to be sent
      const messageData = {
        chatId,
        content, // message content
        status: {}, // placeholder for message status (e.g., delivered, seen)
        senderId: senderId, // ID of the user sending the message
        sentAt: serverTimestamp(), // timestamp of when the message is sent
        messageType: 'text', // type of message (here it's a text message)
      };

      await addDoc(collection(this.firebaseService.fireStore, FireStore.CHAT_MESSAGES), { ...messageData });
    } catch (error: any) {
      // log the error for debugging purposes
      console.error('Error sending message: ', error);

      // throw a specific error message to the caller in case of failure
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
}
