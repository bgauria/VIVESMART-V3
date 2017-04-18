import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams ,Platform} from 'ionic-angular';//ActionSheetController
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import {Fecha} from '../../providers/fecha';

@IonicPage()
@Component({
  selector: 'page-detallenoticiapromocion',
  templateUrl: 'detallenoticiapromocion.html',
  providers: [Entity, Url, Alerta, Load,Fecha, Toast, BarcodeScanner, SocialSharing]
})
export class Detallenoticiapromocion {
  private su;
  public np:any;
   
    constructor( public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url//, public actionsheetCtrl: ActionSheetController
               ,private socialSharing: SocialSharing ,private barcodeScanner: BarcodeScanner ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, private oF: Fecha , public oT: Toast) {
    this.np= navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Detallenoticiapromocion');
  }
    goBack() {
       this.navCtrl.pop();
    }

     addFavorito(){
        if(this.np.bandera_like == 'light'){
            //np.bandera_like = 'danger';
            this.createLike(1, this.np);
        }else{
            //np.bandera_like = 'light';
            this.createLike(0, this.np);
        }
    }

     createLike( _key_like, np ){
       
                /*if(navigator.connection.type == Connection.NONE) {
                    this.oAlerta.showSinInternet();
                    this.ifReintentar= true;  
                }else{*/
                    this.storage.ready().then(() => {
                    this.storage.get('vs_user').then((val) => {   
                        this.su = JSON.parse(val);
                        this.oLoad.showLoading();
                        var data = JSON.stringify({
                                                KEY: 'KEY_NOTICIAS_LIKE',
                                                _id_not: np.not_id,
                                                _id_usu: this.su.usu_id,
                                                _like: _key_like
                                            });
                        if(this.su.usu_id != ''){
                            this.oEntity.get(data, this.oUrl.url_noticias_promociones, 0).finally(() => { 
                                this.oLoad.dismissLoading(); 
                            }).subscribe(data => {
                                if(data.success == 1){
                                    this.oT.showLongToast(data.msg);
                                    if(np.bandera_like == 'light'){
                                        np.bandera_like = 'danger';
                                        np.not_like = parseInt(np.not_like)  + 1;
                                    }else{
                                        np.bandera_like = 'light';
                                        np.not_like =parseInt(np.not_like) - 1;
                                    }
                                } else {
                                    this.oAlerta.show1(data.msg);
                                } 
                            }, error => {
                                //this.oAlerta.showVolverIntentar();
                                this.oAlerta.show1(error);
                            });
                        }else{
                            this.oAlerta.show1('Error, faltan ID');
                        }
                            
                    });                   
                }); 
            
        //}
                     
    }

   /* setDespliegue(np){
        if(np.despliegue == 'false'){
            np.despliegue = 'true';
        }else{
           np.despliegue = 'false';
        }
    }*/
    setScanear(){
    
        this.barcodeScanner.scan().then((barcodeData) => {
            alert( JSON.stringify(barcodeData));
        }, (err) => {
            this.oT.showLongToast('Error');
        });
    }





  /*   openMenu() {
        //this.validar_open_menu= true;
        let actionSheet = this.actionsheetCtrl.create({
          title: 'Compartir',
          cssClass: 'action-sheets-basic-page',
          buttons: [
            {
              text: 'Email',
              icon: !this.platform.is('ios') ? 'mail' : null,
              handler: () => {
                this.compartir(1);
              }
            },
            {
              text: 'Facebook',
              icon: !this.platform.is('ios') ? 'facebook' : null,
              handler: () => {
                this.compartir(2);
              }
            },
            {
              text: 'Twitter',
              icon: !this.platform.is('ios') ? 'twitter' : null,
              handler: () => {
                this.compartir(3);
                //this.validar_open_menu= false;
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel', // will always sort to be on the bottom
              icon: !this.platform.is('ios') ? 'close' : null,
              handler: () => {
                //this.validar_open_menu= false;
              }
            }
          ]
        });
        actionSheet.present();
        
  }*/
  compartir(){
     this.socialSharing.share(
       'Prueba',
        'x_x',
        '',
        'https://www.google.com.ec'
        ).then(() => {
        alert('OK');
      }).catch(() => {
        // Error!
      });

  }

}
