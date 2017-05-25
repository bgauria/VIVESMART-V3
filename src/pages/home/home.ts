import { Component } from '@angular/core';
import { NavController, NavParams ,Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import {Fecha} from '../../providers/fecha';

import { Detallenoticiapromocion } from  '../detallenoticiapromocion/detallenoticiapromocion';
import {ConnectivityService} from '../../providers/connectivity-service';
/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Entity, Url, Alerta, Load,Fecha, Toast, ConnectivityService]
})
export class HomePage {
 
  public ifReintentar;
  public _lista_noticias_promocion;
  private su;
  public _color_like= 'light';
  private _key_enrutador= '';

   constructor( public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, private oCS: ConnectivityService
               ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, private oF: Fecha , public oT: Toast) {
                  this.ifReintentar= true;
                  this._key_enrutador= navParams.data;
                 
  }

  ionViewWillEnter() {
    
      if(typeof this._lista_noticias_promocion === 'undefined' || this._lista_noticias_promocion.length == 0){ 
            this.storage.get(this.getEtiquedaDataLocal()).then((val) => {
                if(val === null){
                    this.getCargar('', '1', null);
                }else{
                    this.su = JSON.parse(val);     
                    if(this.oF.getNumYearMasDia() != this.su.fecha){
                        this.getCargar('', '1', null);
                    }else{
                        this.ifReintentar= false;
                        this._lista_noticias_promocion= this.su.data;
                    }
                }
             });
        }else{
            this.storage.get(this.getEtiquedaDataLocal()).then((val) => {
                if(val === null){
                  this.getCargar('', '1', null);
                }
             });
 
        }
  }


   getCargar(id, sp, eve){
       try{ 
            if(this.oCS.isOnline()) {
                this.ifReintentar= false;
                this.storage.ready().then(() => {
                    this.storage.get('vs_user').then((val) => {
                      this.su = JSON.parse(val);
                      //if(sp != '3'){
                        this.oLoad.showLoading();
                     // }
                      var data = JSON.stringify({
                                                  KEY: 'KEY_SELECT_NOTICIAS_PROMOCIONES',
                                                  _id_usuario:  this.su.usu_id,
                                                  _bandera: this._key_enrutador,
                                                  _sp: sp,
                                                  _inicio: id
                                                });

                      this.oEntity.get(data, this.oUrl.url_noticias_promociones,0).finally(() => { 
                          this.oLoad.dismissLoading(); 
                      }).subscribe(data => {
                          if(data.success == 1){
                              if(sp == '1'){
                                this._lista_noticias_promocion= data.not_promo;
                              }   
                              if(sp == '2'){
                                for(let d of data.not_promo) {
                                    this._lista_noticias_promocion.push(d);
                                }       
                              }
                              if(sp == '3'){
                                for(let d of data.not_promo) {
                                    this._lista_noticias_promocion.unshift(d);
                                }       
                                 eve.complete();
                              }

                             this.setGuardarDataLocal();
                          } else {
                              this.oT.showToast(data.msg, 'middle');
                              if(sp == '1'){
                                this.ifReintentar= true;
                              }
                              if(sp == '3'){
                                eve.complete();
                              }
                          } 
                      }, error => {
                          this.oAlerta.showVolverIntentar();
                          if(sp == '1'){
                            this.ifReintentar= true;
                          }
                          if(sp == '3'){
                            eve.complete();
                          }
                  
                      });
                  });
                });
            }else{
                if(sp == '3'){
                    eve.complete();
                }
            }
      }catch(err) {
        this.oAlerta.showVolverIntentar();
         if(sp == '3'){
           eve.complete();
         }
      } 
        
    }
    setGuardarDataLocal(){
        
        this.storage.remove(this.getEtiquedaDataLocal()); 
        this.storage.set(this.getEtiquedaDataLocal(),JSON.stringify(
                                                {
                                                    data: this._lista_noticias_promocion,
                                                    fecha: this.oF.getNumYearMasDia()
                                                }
                                            ));
    }
    getEtiquedaDataLocal(){
        let etiqueta='';
        if(this._key_enrutador == '1'){
            etiqueta='vs_HomePage_lista_noticias';
        }else{
            etiqueta='vs_HomePage_lista_promociones';
        }
        return etiqueta;
    }
    getRecargar(){
      this.getCargar('', '1', null);
    }
    addFavorito(np){
        if(np.bandera_like == 'light'){
            this.createLike(1, np);
        }else{
            this.createLike(0, np);
        }
    }

     createLike( _key_like, np ){
        if(this.oCS.isOnline()) {
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
                                    this.setGuardarDataLocal();
                                } else {
                                    this.oAlerta.show1(data.msg);
                                } 
                            }, error => {
                                this.oAlerta.showVolverIntentar();
                            });
                        }else{
                            this.oAlerta.show1('Error, faltan ID');
                        }
                            
                    });                   
                }); 
            
        }
                     
    }


  goToVerMas(_np){
      this.navCtrl.push(Detallenoticiapromocion,  {data: _np});
  }

    doRefresh(refresher){
        let b = this._lista_noticias_promocion[0];
        this.getCargar(b.not_id, '3', refresher);
    } 
    setcargarMas(){
        let b = this._lista_noticias_promocion[this._lista_noticias_promocion.length-1];
        this.getCargar(b.not_id, '2', null);
    }

}
