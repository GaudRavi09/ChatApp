import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { doc, Firestore, getFirestore, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  firebaseAuth: Auth;
  fireStore: Firestore;

  constructor() {}
  public async initialize(): Promise<void> {
    const app = initializeApp(environment.firebase);
    this.firebaseAuth = getAuth(app);
    this.fireStore = getFirestore(app);
  }
}
