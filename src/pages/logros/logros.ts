import { Component } from '@angular/core';
import { NavController, NavParams ,Platform, AlertController, ModalController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import { Alertaganar } from  '../alertaganar/alertaganar';
import {ConnectivityService} from '../../providers/connectivity-service';
@Component({
  selector: 'page-logros',
  templateUrl: 'logros.html',
  providers: [Entity, Url, Alerta, Load, ConnectivityService, Toast]
})
export class LogrosPage {
  
  public ifReintentar;
  public _lista_logros;
  private su;
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, public alertCtrl: AlertController
                ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load,  public oT: Toast, private oCS: ConnectivityService) {
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
    

  }


   getCargar(){
       if(this.oCS.isOnline()) {
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
                          console.log('--> ' + JSON.stringify(data));
                          if(data.success == 1){
                              this._lista_logros= data.insignia_establecimiento;
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
      } 
        
    }
    getRecargar(){
      this.getRecargar();
    }
    goToVerDetalleLogro(l){
        let modal = this.modalCtrl.create(Alertaganar, {
            tipo: '3',
            _imagen: l.img ,
            _nombre: l.ins_name ,
            _descripcion: l.ins_descripcion,
            _bandera: l.bandera

        });
        modal.present();    
    }

}
