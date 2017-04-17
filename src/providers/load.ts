import {Injectable} from '@angular/core';  
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class Load {  
loading: Loading;
    constructor( private loadingCtrl: LoadingController) {
    }

   showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
   }
   showLoadingMsg(msg : string) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
   }
   dismissLoading() {
    setTimeout(() => {
      this.loading.dismiss();
    });
  }
}
