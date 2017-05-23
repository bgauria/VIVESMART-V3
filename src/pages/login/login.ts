import { Component } from '@angular/core';
import { NavController , AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabPage } from  '../tab/tab';
import { UsuariosubpreferenciaPage } from '../usuariosubpreferencia/usuariosubpreferencia';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import { RegistroPage } from '../registro/registro';
import {ConnectivityService} from '../../providers/connectivity-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ Alerta, Load, Entity, Url, ConnectivityService]
})

export class LoginPage {
    public user= '';
    public pass= '';
    public code= '';
    
    constructor(public navCtrl: NavController, public storage: Storage, public alertCtrl: AlertController,
                 private oAlerta: Alerta, private oLoad: Load, public oEntity: Entity, public oUrl: Url, private oCS: ConnectivityService) {   
    }
    
  ionViewWillEnter() {
    this.storage.get('vs_code_push').then((code) => {
        if(typeof code !== 'undefined' && code !== null){
            this.code= code;
        }
    });      
  }

    public login(){
        if(this.oCS.isOnline()) {
            if(this.user =='' || this.pass ==''){
                this.oAlerta.show1('Faltan campos por llenar!');	
            }else{
                this.oLoad.showLoading(); 
                var data = JSON.stringify({
                                            KEY: 'KEY_USUARIO_LOGIN',
                                            user: this.user,
                                            pass:  this.pass,
                                            code: this.code
                                         });

                this.oEntity.get(data, this.oUrl.url_usuario, 0).finally(() => { 
                    this.oLoad.dismissLoading(); 
                }).subscribe(data => {
                     //console.log('--> ' + JSON.stringify(data));
                    if(data.success == 1){
                        this.storage.ready().then(() => {
                           this.storage.set('vs_user', JSON.stringify(
                                                                            {
                                                                                usu_id: data.usuario[0].usu_id,
                                                                                full_name: data.usuario[0].full_name,
                                                                                usu_nombre: data.usuario[0].usu_nombre,
                                                                                usu_apellido: data.usuario[0].usu_apellido,
                                                                                usu_cedula: data.usuario[0].usu_cedula,
                                                                                usu_correo: data.usuario[0].usu_mail,
                                                                                usu_user: data.usuario[0].usu_user,
                                                                                usu_puntos_acumulados: data.usuario[0].usu_puntos_acumulados,
                                                                                usu_tiene_subpreferencias: data.usuario[0].tiene_subpreferencias
                                                                                
                                                                            }
                                                                        ));
                                                                        
                            this.storage.set('vs_user_puntos_acumulados', JSON.stringify(
                                                                            {
                                                                                usu_nivel: data.usuario[0].usu_nivel,
                                                                                usu_puntos_proximo_nivel: data.usuario[0].usu_puntos_proximo_nivel,
                                                                                usu_puntos_acumulados: data.usuario[0].usu_puntos_acumulados
                                                                                
                                                                            }
                                                                        ));
                            this.storage.set('vs_tiene_preferencias', data.usuario[0].tiene_subpreferencias);
                            this.storage.set('vs_usuario', this.user);
                            this.storage.set('vs_foto', data.foto);

        
                            
                        }); 
                        if(data.usuario[0].tiene_subpreferencias == '0'){
                            this.navCtrl.setRoot(UsuariosubpreferenciaPage, {data: '1'});
                        }else{
                            this.navCtrl.setRoot(TabPage);
                        }    

                        
                    } else {
                        //this.oAlerta.show1("Usuario o Contraseña incorrectos!");
                        this.oAlerta.show1(data.msg);
                        
                    }   
                }, error => {
                    this.oAlerta.showVolverIntentar();

                });
        
            }
  
        } 
    }
     goToRegistro(){
      this.navCtrl.push(RegistroPage,  { });
  }


      showRecordarPass() {  
        let confirm = this.alertCtrl.create({
            title: 'Recuperar contraseña',
            message: 'Escribe tu mail para recuperar tu usuario y contraseña',
            inputs: [
                {
                name: 'title',
                placeholder: 'Mail',
                type: 'mail'
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {}
                },
                {
                    text: 'Enviar',
                    handler: data => { this.recuperarPass(data.title); }
                }
            ]
        });
        confirm.present();
     
    }

     public recuperarPass(mail){
        if(this.oCS.isOnline()) {
            if(mail ==''){
                this.oAlerta.show1('Faltan el mail!');	
            }else{
                this.oLoad.showLoading(); 
                var data = JSON.stringify({
                                            KEY: 'KEY_RECUPERAR_PASS',
                                            _mail: mail
                                         });

                this.oEntity.get(data, this.oUrl.url_usuario, 0).finally(() => { 
                    this.oLoad.dismissLoading(); 
                }).subscribe(data => {
                    if(data.success == 1){
                        this.oAlerta.show1(data.msg);
                    } else {
                        this.oAlerta.show1(data.msg);
                    }   
                }, error => {
                    this.oAlerta.show2('ERROR' ,error , 'OK');
                });
            } 
        }
    }
}
