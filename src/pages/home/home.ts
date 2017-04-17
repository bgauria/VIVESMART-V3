import { Component } from '@angular/core';
import { NavController, NavParams ,Platform, ActionSheetController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import {Fecha} from '../../providers/fecha';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SocialSharing } from '@ionic-native/social-sharing';
//declare var navigator: any;
//declare var Connection: any;
/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Entity, Url, Alerta, Load,Fecha, Toast, BarcodeScanner, SocialSharing]
})
export class HomePage {
 
  public ifReintentar;
  public _lista_noticias_promocion;
  private su;
  public _color_like= 'light';

  private _key_enrutador= '';
  //http://stackoverflow.com/questions/40354553/ionic-2-update-rootparams-tabs

   constructor( public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, public actionsheetCtrl: ActionSheetController
               ,private socialSharing: SocialSharing ,private barcodeScanner: BarcodeScanner ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, private oF: Fecha , public oT: Toast) {
                  this.ifReintentar= true;
                  console.log('---> ' + navParams.data);
                  this._key_enrutador= navParams.data;
                 
  }

  ionViewWillEnter() {
    this.getCargar();
      /*if(typeof this._lista_usu_sub_preferencia === 'undefined' || this._lista_usu_sub_preferencia.length == 0){ 
            this.storage.get('ListmisvehiculosPage_vehiculos').then((val) => {
                if(val === null){
                    this.getCargar();
                }else{
                    this.su = JSON.parse(val);     
                    if(this.oF.getNumYearMasDia() != this.su.fecha){
                        this.getCargar();
                    }else{
                        this.ifReintentar= false;
                        this._lista_usu_sub_preferencia= this.su.data;
                    }
                }
             });
        }else{
            this.storage.get('ListmisvehiculosPage_vehiculos').then((val) => {
                if(val === null){
                  console.log('4');
                    this.getCargar();
                }
             });
 
        }*/
  }


   getCargar(){
       try{ 
           /* if(navigator.connection.type == Connection.NONE) {
                this.oAlerta.showSinInternet();
                this.ifReintentar= true;  
            }else{*/
                this.ifReintentar= false;
                this.storage.ready().then(() => {
                    this.storage.get('vs_user').then((val) => {
                      this.su = JSON.parse(val);
                      console.log('>>>>>>>>> ' +  this.su.usu_id);
                      this.oLoad.showLoading();
                      var data = JSON.stringify({
                                                  KEY: 'KEY_SELECT_NOTICIAS_PROMOCIONES',
                                                  _id_usuario:  this.su.usu_id,
                                                  _bandera: this._key_enrutador
                                                });

                      this.oEntity.get(data, this.oUrl.url_noticias_promociones,0).finally(() => { 
                          this.oLoad.dismissLoading(); 
                      }).subscribe(data => {
                          if(data.success == 1){
                              console.log('>>>>>>>>> ' + JSON.stringify(data));
                              this._lista_noticias_promocion= data.not_promo;
                              /*this.storage.remove('ListmisvehiculosPage_vehiculos'); 
                              this.storage.set('ListmisvehiculosPage_vehiculos',JSON.stringify(
                                                                                    {
                                                                                        data: data.vehiculo,
                                                                                        fecha: this.oF.getNumYearMasDia()
                                                                                    }
                                                                                ));*/
                          } else {
                              this.oT.showToast(data.msg, 'middle');
                              this.ifReintentar= true;
                          } 
                      }, error => {
                          this.oAlerta.showVolverIntentar();
                          this.ifReintentar= true;
                  
                      });
                  });
                });
            //}
      }catch(err) {
        this.oAlerta.showVolverIntentar();
      } 
        
    }
    getRecargar(){
      this.getCargar();
    }
    addFavorito(np){
        if(np.bandera_like == 'light'){
            //np.bandera_like = 'danger';
            this.createLike(1, np);
        }else{
            //np.bandera_like = 'light';
            this.createLike(0, np);
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

    setDespliegue(np){
        if(np.despliegue == 'false'){
            np.despliegue = 'true';
        }else{
           np.despliegue = 'false';
        }
    }
    setScanear(np){
    
        this.barcodeScanner.scan().then((barcodeData) => {
            alert( JSON.stringify(barcodeData));
        }, (err) => {
            this.oT.showLongToast('Error');
        });
    }





     openMenu() {
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
        
  }
  compartir(op){
      switch(op) {
            case 1:
                this.socialSharing.canShareViaEmail().then(() => {
                    alert('OK');
                }).catch(() => {
                // Sharing via email is not possible
                });
                break;
            case 2:
                break;
            case 3:
                break;
 
        }

  }

}

