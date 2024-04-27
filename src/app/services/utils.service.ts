import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrol = inject(LoadingController)
  toastCtrol = inject(ToastController)
  router = inject(Router)

  loading() {
    return this.loadingCtrol.create({ spinner: "crescent" })
  }

  async presentToast(options: ToastOptions) {
    const toast = await this.toastCtrol.create(options);
    toast.present();
  }

  routetLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, data: any) {
    return localStorage.setItem(key, JSON.stringify(data))
  }

  getFrontLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

}
