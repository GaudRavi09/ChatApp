import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private readonly firebaseService: FirebaseService) {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    await this.firebaseService.initialize();
  }
}
