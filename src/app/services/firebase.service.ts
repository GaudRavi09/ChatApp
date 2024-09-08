import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { UserData } from '../models/UserData';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom, Observable, ReplaySubject, take } from 'rxjs';
import { doc, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { AuthStateChange, FirebaseAuthentication, User } from '@capacitor-firebase/authentication';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  firebaseAuth: Auth;
  fireStore: Firestore;
  private currentUserSubject = new ReplaySubject<UserData | null>(1);

  constructor(private readonly ngZone: NgZone) {
    FirebaseAuthentication.removeAllListeners().then(() => {
      FirebaseAuthentication.addListener('authStateChange', (change: AuthStateChange) => {
        this.ngZone.run(async () => {
          if (change?.user) {
            const collectionRef = doc(this.fireStore, 'users', change.user.uid);
            const querySnapshot = await getDoc(collectionRef);
            const userData = querySnapshot.data() as UserData;
            this.currentUserSubject.next(userData);
          }
        });
      });
    });
  }

  public get currentUser$(): Observable<UserData | null> {
    return this.currentUserSubject.asObservable();
  }

  public getCurrentUser(): Promise<UserData | null> {
    return lastValueFrom(this.currentUser$.pipe(take(1)));
  }

  public async initialize(): Promise<void> {
    const app = initializeApp(environment.firebase);
    this.firebaseAuth = getAuth(app);
    this.fireStore = getFirestore(app);
  }
}
