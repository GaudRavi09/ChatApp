import {
  IonText,
  IonItem,
  IonIcon,
  IonTitle,
  IonInput,
  IonHeader,
  IonButton,
  IonFooter,
  IonContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [
    IonBackButton,
    IonIcon,
    IonItem,
    IonText,
    IonInput,
    IonTitle,
    IonButton,
    IonFooter,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
  ],
})
export class ChatPage implements OnInit {
  constructor() {
    addIcons({ send });
  }

  ngOnInit() {}
}
