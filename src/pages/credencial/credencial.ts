import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';


import {ConnectivityService} from '../../providers/connectivity-service';

@Component({
  selector: 'page-credencial',
  templateUrl: 'credencial.html',
  providers: [Entity, Url, Alerta, Load, ConnectivityService]
})
export class CredencialPage {
  private su;
  //private user;
  public _txtUsuario= '';
  public _txtClave= '';
  public _txtConfirmar= '';

 constructor(public navCtrl: NavController, public storage: Storage, public oEntity: Entity, public oUrl: Url,
                 private oAlerta: Alerta, private oLoad: Load, private oCS: ConnectivityService) { 

                }

  ionViewWillEnter() {
        this.storage.get('vs_usuario').then((val) => { 
            this._txtUsuario= val; 
         
        });
        
    }
    enviar(){
        if(this.oCS.isOnline()) {
            let bandera = true;
            if(this._txtConfirmar =='' || this._txtClave=='' || this._txtUsuario=='' ){
                this.oAlerta.show1('Faltan campos por llenar!');
                bandera= false;	
            }else{
                if(this._txtClave == this._txtConfirmar){
                    bandera= true;
                }else{
                    this.oAlerta.show1('La contraseña no coincide con la confirmación!');
                    bandera= false;
                }
            }
            if (bandera){
                this.storage.ready().then(() => {
                    this.storage.get('vs_user').then((val) => { 
                        this.su = JSON.parse(val);
                        var data = JSON.stringify({
                                                    KEY: 'KEY_USUARIO_UPDATE_USER_PASS',
                                                    _id_user: this.su.usu_id,
                                                    _usuario:  this._txtUsuario,
                                                    _password: this._txtClave
                                            
                                                });

                        this.oLoad.showLoading();
                        this.oEntity.get(data, this.oUrl.url_usuario, 0).finally(() => { 
                            this.oLoad.dismissLoading(); 
                        }).subscribe(data => {
                            if(data.success == 1){
                                
                                    this.storage.remove('vs_usuario');
                                    this.storage.set('vs_usuario',this._txtUsuario);
                                
                                this.oAlerta.show1(data.msg);
                            
                            } else {
                                this.oAlerta.show1(data.msg);
                            } 
                        }, error => {
                            this.oAlerta.showVolverIntentar();
                        });
                    });
                });
            }
        }
    }


}
