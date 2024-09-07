import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';

export const loginRedirectGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject(FirebaseService);
  const navCtrl = inject(NavController);

  // Return a promise to handle async check for authentication
  const user = await new Promise((resolve) => {
    firebaseService.firebaseAuth.onAuthStateChanged((value) => {
      resolve(value);
    });
  });

  if (user) {
    navCtrl.navigateForward('/dashboard', { replaceUrl: true });
    return false; // Prevent access to login page, redirect to dashboard
  } else {
    return true; // Allow access to login page for non-authenticated users
  }
};
