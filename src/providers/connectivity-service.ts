import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class ConnectivityService {
  constructor(public platform: Platform, private alertCtrl: AlertController) {
     
  }
  
  isOnline(): boolean {
      if(navigator.connection.type == Connection.NONE) {
        this.showSinInternet();
        return false;
      }else{ 
        return true;
      }

    // return true;
        
  }

  isOnlineV2(): boolean {
      if(navigator.connection.type == Connection.NONE) {
        return false;
      }else{ 
        return true;
      }
    
        
  }
    showSinInternet() {
        let alert = this.alertCtrl.create({
            title: "Estamos teniendo problemas",
            subTitle: "Por favor revise su conexión a internet y vuelva a intentar!",
            buttons: ["OK"]
        });
        alert.present(prompt);
    }

}
