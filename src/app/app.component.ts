import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { TabPage } from '../pages/tab/tab';
import { UsuariosubpreferenciaPage } from '../pages/usuariosubpreferencia/usuariosubpreferencia';
//import {Push} from 'ionic-native';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';

import {Toast} from '../providers/toast';


import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html',
   providers: [Toast]
})
export class MyApp {
  rootPage:any; //= LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, public oT: Toast ){//, private push: Push) {
    platform.ready().then(() => {
        ///////////////////////////////////////////////////////////////

       /* const options: PushOptions = {
          android: {
              senderID: '642734409312',
              vibrate: true,
              sound: true
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
          },
          windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) =>{ 
            oT.showToastWithCloseButton(notification.message);
        });

        pushObject.on('registration').subscribe((registration: any) =>{
            storage.ready().then(() => {
                storage.set('vs_code_push', registration.registrationId.toString());
            });
            alert( registration.registrationId.toString());
        });

       var push = Push.init({
        android: {
          senderID: "642734409312",
          vibrate: true,
          sound: true
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });
      push.on('registration', (data) => {
        storage.ready().then(() => {
            storage.set('vs_code_push', data.registrationId.toString());
        });
          alert('--> '+ data.registrationId.toString());
      });
      push.on('notification',(data) => {
        oT.showToastWithCloseButton(data.message);
        
      });
*/
      ////////////////////////////////////////////////////////////////
      statusBar.styleDefault();
      splashScreen.hide();

    });
     storage.ready().then(() => {
      storage.get('vs_user').then((val) => {
          if(typeof val === 'undefined' || val === null){
            this.rootPage =LoginPage;
          }else{
            storage.get('vs_tiene_preferencias').then((val) => {
              if(typeof val === 'undefined' || val === null || val =='0'){
                console.log('---->----> '+ val);
                this.rootPage = UsuariosubpreferenciaPage;
              }else{
                this.rootPage = TabPage;
              }

            
            });
            
            
          }
      });
    });
  }
}
