import {Injectable} from '@angular/core';  
import { ToastController } from 'ionic-angular';

@Injectable()
export class Toast {  

    constructor(public toastCtrl: ToastController) { }
     
   showToast(msg: string, position: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  showToastWithCloseButton(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  showLongToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
//<ion-content padding>
//  <button ion-button block (click)="showToast('top')">Show Toast Top Position</button>
//  <button ion-button block (click)="showToast('middle')">Show Toast Middle Position</button>
//  <button ion-button block (click)="showToast('bottom')">Show Toast Bottom Position</button>
//  <button ion-button block (click)="showLongToast()">Show Long Toast</button>
//  <button ion-button block (click)="showToastWithCloseButton()">Show Toast W/ Close Button</button>
//</ion-content>