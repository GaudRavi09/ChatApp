import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { ToasterService } from './toaster.service';
import { environment } from 'src/environments/environment';
import { LoginCredentials, SignUpData } from '../pages/login/login.model';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  constructor(private toasterService: ToasterService) {}

  public async initialize(): Promise<void> {
    initializeApp(environment.firebase);
  }

  async signIn({ email, password }: LoginCredentials) {
    const result = await FirebaseAuthentication.signInWithEmailAndPassword({
      email,
      password,
    });
    return result.user;
  }

  async signUp({ email, password }: SignUpData) {
    const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email,
      password,
    });
    return result.user;
  }

  async signInWithGoogle() {
    const result = await FirebaseAuthentication.signInWithGoogle();
    return result.user;
  }

  async signOut() {
    await FirebaseAuthentication.signOut();
  }

  handleLoginError(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        this.toasterService.toast('Incorrect email or password.', 'failed');
        break;
      case 'auth/network-request-failed':
        this.toasterService.toast('Please check your connection and try again.', 'failed');
        break;
      case 'auth/configuration-not-found':
        this.toasterService.toast('Please enable google login from firebase.', 'failed');
        break;
      default:
        this.toasterService.toast('An error occurred during login. Please try again later.', 'failed');
    }
  }
}
