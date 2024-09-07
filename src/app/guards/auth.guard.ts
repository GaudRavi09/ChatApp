import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject(FirebaseService);
  const navCtrl = inject(NavController);

  // Return a promise to handle async check for authentication
  const user = await new Promise((resolve) => {
    firebaseService.firebaseAuth.onAuthStateChanged((value) => {
      resolve(value);
    });
  });

  if (user) {
    return true; // User is authenticated, allow access to the route
  } else {
    navCtrl.navigateForward('/login', { replaceUrl: true });
    return false; // User not authenticated, redirect to login
  }
};
