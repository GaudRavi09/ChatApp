import {
  IonCol,
  IonRow,
  IonText,
  IonItem,
  IonIcon,
  IonGrid,
  IonTitle,
  IonInput,
  IonLabel,
  IonHeader,
  IonButton,
  IonAvatar,
  IonFooter,
  IonContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FireStore } from 'src/app/enums/enums';
import { ActivatedRoute } from '@angular/router';
import { Messages } from 'src/app/models/Messages';
import { UserData } from 'src/app/models/UserData';
import { ChatService } from 'src/app/services/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonItem,
    IonText,
    IonLabel,
    IonInput,
    IonTitle,
    IonButton,
    IonAvatar,
    IonFooter,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    FormsModule,
    CommonModule,
    IonBackButton,
  ],
})
export class ChatPage implements OnInit {
  chatId: string;
  otherUser: UserData;
  typedMessage: string;
  allMessages: Messages[];
  currentUser: UserData;
  hasFirstScroll: boolean = true;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private firebaseService: FirebaseService,
  ) {
    addIcons({ send });
    const otherUserId = this.route.snapshot.params['id'];
    this.getUserData(otherUserId);
  }

  ngOnInit() {}

  async getUserData(userId: string) {
    const collectionRef = doc(this.firebaseService.fireStore, FireStore.USERS, userId);
    const querySnapshot = await getDoc(collectionRef);
    this.otherUser = querySnapshot.data() as UserData;
    this.currentUser = await this.firebaseService.getCurrentUser();
    this.chatId = await this.chatService.findOrCreateOneToOneChat(this.currentUser.uid, this.otherUser.uid);
    this.getMessages();
  }

  async sendMessage() {
    if (this.typedMessage) {
      await this.chatService.sendMessage(this.chatId, this.currentUser.uid, this.typedMessage);
      this.content.scrollToBottom(0);
      this.typedMessage = null;
    }
  }

  getMessages() {
    const messageQuery = query(
      collection(this.firebaseService.fireStore, FireStore.CHAT_MESSAGES),
      where('chatId', '==', this.chatId),
      orderBy('sentAt', 'asc'),
    );

    onSnapshot(messageQuery, (querySnapshot) => {
      this.allMessages = querySnapshot.docs.map((d) => d.data() as Messages);
      if (this.hasFirstScroll) {
        setTimeout(() => {
          this.content.scrollToBottom();
          this.hasFirstScroll = false;
        }, 100);
      }
    });
  }
}
