import { Injectable } from '@angular/core';
import { FireStore } from '../enums/enums';
import { doc, setDoc } from 'firebase/firestore';
import { ToasterService } from './toaster.service';
import { FirebaseService } from './firebase.service';
import { LoginCredentials, SignUpData } from '../pages/login/login.model';
import { FirebaseAuthentication, SignInResult } from '@capacitor-firebase/authentication';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  constructor(
    private toasterService: ToasterService,
    private firebaseService: FirebaseService,
  ) {}

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
    const result: SignInResult = await FirebaseAuthentication.signInWithGoogle();
    await this.setUserData(result);
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

  private async setUserData(result: SignInResult) {
    if (result.additionalUserInfo.isNewUser) {
      const user = result.user;
      try {
        await setDoc(doc(this.firebaseService.fireStore, FireStore.USERS, user.uid), {
          uid: user.uid,
          email: user.email,
          photoUrl: user.photoUrl,
          lastName: user.displayName.split(' ')[1],
          firstName: user.displayName.split(' ')[0],
          loginMethod: result.additionalUserInfo.providerId,
        });
      } catch (error) {
        console.log('error: ', error);
      }
    }
  }
}
