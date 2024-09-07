import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private toastController: ToastController) {}

  async toast(message: string, type: 'success' | 'warning' | 'failed', duration: number = 2000) {
    const iconMap = {
      warning: 'warning',
      failed: 'close-circle',
      success: 'checkmark-circle',
    };

    const cssClassMap = {
      failed: 'error-toast',
      success: 'success-toast',
      warning: 'warning-toast',
    };

    const toaster = await this.toastController.create({
      message,
      duration,
      color: 'dark',
      icon: iconMap[type],
      cssClass: cssClassMap[type],
      buttons: [{ icon: 'close-outline' }],
    });

    toaster.present();
  }
}
