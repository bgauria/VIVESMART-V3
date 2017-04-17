import { Component } from '@angular/core';
import { NavController, NavParams ,Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';

import { TabPage } from  '../tab/tab';
//import { ListrutasPage } from  '../listrutas/listrutas';
import {Fecha} from '../../providers/fecha';
//declare var navigator: any;
//declare var Connection: any;
/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/
@Component({
  selector: 'page-usuariosubpreferencia',
  templateUrl: 'usuariosubpreferencia.html',
  providers: [Entity, Url, Alerta, Load,Fecha, Toast]
})

export class UsuariosubpreferenciaPage {

 
  public ifReintentar;
  public _lista_usu_sub_preferencia;
  private su;
  public _togDisponiblidad;

  private sp_seleccionados='';
  private sp_deseleccionados='';


  constructor( public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, public alertCtrl: AlertController
                ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, private oF: Fecha , public oT: Toast) {
                  this.ifReintentar= true;

                 
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
                      this.oLoad.showLoading();
                      var data = JSON.stringify({
                                                  KEY: 'KEY_SELECT_SUBPREFERCIA_PREFERENCIA',
                                                  _id_usuario:  this.su.usu_id
                                                });

                      this.oEntity.get(data, this.oUrl.url_subpreferencias,0).finally(() => { 
                          this.oLoad.dismissLoading(); 
                      }).subscribe(data => {
                          if(data.success == 1){
                              console.log('>>>>>>>>> ' + JSON.stringify(data));
                              this._lista_usu_sub_preferencia= data.subpreferencia;
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
       console.log('sp_seleccionados '+this.sp_seleccionados);
       console.log('sp_deseleccionados '+this.sp_deseleccionados);
        try{ 
           /* if(navigator.connection.type == Connection.NONE) {
                this.oAlerta.showSinInternet();
                this.ifReintentar= true;  
            }else{*/
             //  if (this.sp_seleccionados != '' || this.sp_deseleccionados != ''){
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
                              this.oT.showToast(data.msg, 'middle');
                              this.navCtrl.setRoot(TabPage);
                          } else {
                              this.oT.showToast(data.msg, 'middle');
                          } 
                      }, error => {
                          this.oAlerta.showVolverIntentar();                  
                      });
                  });
                });
              // }
            //}
      }catch(err) {
        this.oAlerta.showVolverIntentar();
      }
    }
}