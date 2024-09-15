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
  IonButton,
  IonButtons,
  IonSearchbar,
  NavController,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { FireStore } from 'src/app/enums/enums';
import { Component, OnInit } from '@angular/core';
import { ellipsisVertical } from 'ionicons/icons';
import { UserData } from 'src/app/models/UserData';
import { collection, onSnapshot } from 'firebase/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonList,
    IonIcon,
    IonNote,
    IonItem,
    IonLabel,
    IonTitle,
    IonButton,
    IonAvatar,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonSearchbar,
    IonSkeletonText,
  ],
})
export class DashboardPage implements OnInit {
  users: UserData[];
  currentUser: UserData;
  isLoading: boolean = true;

  constructor(
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
  ) {
    addIcons({ ellipsisVertical });
  }

  async ngOnInit() {
    this.currentUser = await this.firebaseService.getCurrentUser();
    this.getUsers();
  }

  getUsers() {
    onSnapshot(collection(this.firebaseService.fireStore, FireStore.USERS), (querySnapshot) => {
      const allUsers: UserData[] = querySnapshot.docs.map((doc) => doc.data() as UserData);
      this.users = allUsers.filter((user: UserData) => user.uid !== this.currentUser.uid);
      this.isLoading = false;
    });
  }

  redirectToChat(userId: string) {
    this.navCtrl.navigateForward(`chat/${userId}`);
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('query: ', query);
  }
}
