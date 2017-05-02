import { Component } from '@angular/core';
import { NavController, NavParams ,Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';

import {Fecha} from '../../providers/fecha';
//declare var navigator: any;
//declare var Connection: any;
/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/
@Component({
  selector: 'page-logros',
  templateUrl: 'logros.html',
  providers: [Entity, Url, Alerta, Load,Fecha, Toast]
})
export class LogrosPage {
  
  public ifReintentar;
  public _lista_logros;
  private su;



  constructor( public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, public alertCtrl: AlertController
                ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, private oF: Fecha , public oT: Toast) {
                  this.ifReintentar= true;

                 
  }
  
  ionViewWillEnter() {
      if(typeof this._lista_logros === 'undefined' || this._lista_logros.length == 0){ 
        this.getCargar();
      }else{
           this.storage.get('vs_LogrosPage_Recargar').then((val) => {
                if(val == '1'){
                    this.storage.remove('vs_LogrosPage_Recargar');
                    this.getCargar();
                }
             });
      }
    
      /*if(typeof this._lista_logros === 'undefined' || this._lista_logros.length == 0){ 
            this.storage.get('ListmisvehiculosPage_vehiculos').then((val) => {
                if(val === null){
                    this.getCargar();
                }else{
                    this.su = JSON.parse(val);     
                    if(this.oF.getNumYearMasDia() != this.su.fecha){
                        this.getCargar();
                    }else{
                        this.ifReintentar= false;
                        this._lista_logros= this.su.data;
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
                      this.oLoad.showLoading();
                      var data = JSON.stringify({
                                                  KEY: 'KEY_ESTABLECIMIENTO_INSIGNIA_2',
                                                  _id_usuario:  this.su.usu_id
                                                });

                      this.oEntity.get(data, this.oUrl.url_logros,0).finally(() => { 
                          this.oLoad.dismissLoading(); 
                      }).subscribe(data => {
                          if(data.success == 1){
                              console.log('>>>>>>>>> ' + JSON.stringify(data));
                              this._lista_logros= data.insignia_establecimiento;
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
      this.getRecargar();
    }

}
