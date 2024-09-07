import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    await this.firebaseAuthService.initialize();
  }
}
