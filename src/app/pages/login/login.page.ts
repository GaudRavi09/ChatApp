import {
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonContent,
  IonSpinner,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Component, OnInit } from '@angular/core';
import { eye, eyeOff, logoGoogle } from 'ionicons/icons';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonItem, IonIcon, IonInput, IonLabel, IonButton, IonContent, IonSpinner, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  isLoading: boolean;
  loginForm: FormGroup;
  showPassword: boolean;
  formSubmitted: boolean;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private firebaseAuthService: FirebaseAuthService,
  ) {
    addIcons({ eye, eyeOff, logoGoogle });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        await this.firebaseAuthService.signIn(this.loginForm.value);
        this.isLoading = false;
        this.navCtrl.navigateForward('/dashboard', { replaceUrl: true });
      } catch (error: any) {
        this.isLoading = false;
        this.firebaseAuthService.handleLoginError(error.code);
      }
    }
  }

  async signInWithGoogle() {
    try {
      this.isLoading = true;
      await this.firebaseAuthService.signInWithGoogle();
      this.isLoading = false;
    } catch (error: any) {
      this.isLoading = false;
      this.firebaseAuthService.handleLoginError(error.code);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
