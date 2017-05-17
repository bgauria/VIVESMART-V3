import { Component } from '@angular/core';
import { NavController, NavParams ,Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import {ConnectivityService} from '../../providers/connectivity-service';
import { TabPage } from  '../tab/tab';
/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/
@Component({
  selector: 'page-usuariosubpreferencia',
  templateUrl: 'usuariosubpreferencia.html',
  providers: [Entity, Url, Alerta, Load, Toast,ConnectivityService]
})

export class UsuariosubpreferenciaPage {

 
  public ifReintentar;
  public _lista_usu_sub_preferencia;
  private su;
  public _togDisponiblidad;
  private _key_enrutador;
  public _ifValidacion_Boton= false;

  private sp_seleccionados='';
  private sp_deseleccionados='';
  constructor( public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, private oCS: ConnectivityService
                ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, public oT: Toast) {
                  this.ifReintentar= true;
                  this._key_enrutador= navParams.get('data');
                  if(this._key_enrutador == '2'){
                      this._ifValidacion_Boton= true;
                  }

             
                 
  }

  ionViewWillEnter() {
    this.getCargar();
  }


   getCargar(){
       if(this.oCS.isOnline()) {
                this.ifReintentar= false;
                this.storage.ready().then(() => {
                    this.storage.get('vs_user').then((val) => {
                      this.su = JSON.parse(val);
                      this.oLoad.showLoading();
                      var data = JSON.stringify({
                                                  KEY: 'KEY_SELECT_SUBPREFERCIA_PREFERENCIA',
                                                  _id_usuario:  this.su.usu_id
                                                });

                      this.oEntity.get(data, this.oUrl.url_subpreferencias,0).finally(() => { 
                          this.oLoad.dismissLoading(); 
                      }).subscribe(data => {
                          if(data.success == 1){
                              this._lista_usu_sub_preferencia= data.subpreferencia;
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

   selectedSupPreferencia(sp){
            if(sp.bandera == 'true'){
                sp.bandera= 'false';
                if(this.sp_seleccionados != ''){
                    this.sp_seleccionados= this.sp_seleccionados.replace(sp.sub_id + ',','' );
                }
                if(this.sp_deseleccionados == ''){
                    this.sp_deseleccionados= sp.sub_id + ',';
                }else{
                    this.sp_deseleccionados= this.sp_deseleccionados + sp.sub_id + ',';
                }
            }else{
                sp.bandera= 'true';
                if(this.sp_seleccionados == ''){
                    this.sp_seleccionados= sp.sub_id + ',';
                }else{
                    this.sp_seleccionados= this.sp_seleccionados + sp.sub_id + ',';
                }
            }

    }

     getGuardar(){
        if(this.oCS.isOnline()) {
                     this.storage.ready().then(() => {
                        this.storage.get('vs_user').then((val) => {
                        this.su = JSON.parse(val);

                        this.oLoad.showLoading();
                        var data = JSON.stringify({
                                                    KEY: 'KEY_UPDATE_USUARIO_SUBPREFERENCIAS',
                                                    _id_usuario:  this.su.usu_id,
                                                    _lista_subpreferencias_seleccionadas: this.sp_seleccionados,
                                                    _lista_subpreferencias_deseleccionadas:this.sp_deseleccionados
                                                    });

                        this.oEntity.get(data, this.oUrl.url_subpreferencias,0).finally(() => { 
                            this.oLoad.dismissLoading(); 
                        }).subscribe(data => {
                            if(data.success == 1){
                                if(data.u_pref[0].tiene_preferencias != '0'){
                                    this.storage.remove('vs_tiene_preferencias'); 
                                    this.storage.set('vs_tiene_preferencias',data.u_pref[0].tiene_preferencias);
                                    this.oT.showToast(data.msg, 'middle');
                                    this.navCtrl.setRoot(TabPage);
                                }else{
                                    this.oT.showLongToast('Debes seleccionar una Preferencia!');
                                }

                                
                            } else {
                                this.oT.showToast(data.msg, 'middle');
                            } 
                        }, error => {
                            this.oAlerta.showVolverIntentar();                  
                        });
                    });
                    });
      }
    }
    goBack() {
       this.navCtrl.pop();
    }

}