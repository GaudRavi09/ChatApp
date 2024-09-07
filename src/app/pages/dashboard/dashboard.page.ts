import {
  IonNote,
  IonItem,
  IonList,
  IonIcon,
  IonTitle,
  IonLabel,
  IonAvatar,
  IonHeader,
  IonToolbar,
  IonContent,
  NavController,
} from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/UserData';
import { collection, onSnapshot } from 'firebase/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonList, IonIcon, IonNote, IonItem, IonLabel, IonTitle, IonAvatar, IonHeader, IonToolbar, IonContent],
})
export class DashboardPage implements OnInit {
  users: UserData[];
  currentUser: UserData;

  constructor(
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
  ) {}

  async ngOnInit() {
    this.currentUser = await this.firebaseService.getCurrentUser();
    this.getUsers();
  }

  getUsers() {
    onSnapshot(collection(this.firebaseService.fireStore, 'users'), (querySnapshot) => {
      const allUsers: UserData[] = querySnapshot.docs.map((doc) => doc.data() as UserData);
      this.users = allUsers.filter((user: UserData) => user.uid !== this.currentUser.uid);
    });
  }

  redirectToChat(userId: string) {
    this.navCtrl.navigateForward(`chat/${userId}`);
  }
}
