import { Component } from '@angular/core';
import { NavController, NavParams , ActionSheetController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from  '../login/login';

import { UsuariosubpreferenciaPage } from '../usuariosubpreferencia/usuariosubpreferencia';
import { CredencialPage } from '../credencial/credencial';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {ConnectivityService} from '../../providers/connectivity-service';

/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
  providers: [Camera, PhotoViewer, Alerta, Load, Entity, Url, ConnectivityService]
})
export class PerfilPage {
  private su;
  public _foto= '';
  public _full_name='';
  public _nivel='Nivel 1';
  public _puntos ='405 Puntos';
  public _proximo_nivel='45 puntos para el próximo nivel.';
  public _cedula = '';
  public _corro = '';
  public _user ='';
  public _id_user ='';
  public imagen_vacia_1 = true;
  public imagen_1='';

 constructor( public navCtrl: NavController, public navParams: NavParams,   public actionsheetCtrl: ActionSheetController
             ,private photoViewer: PhotoViewer ,private camera: Camera,public platform: Platform ,public storage: Storage,
             private oAlerta: Alerta, private oLoad: Load, public oEntity: Entity, public oUrl: Url, private oCS: ConnectivityService) {
    
  }

  ionViewWillEnter() {
     this.storage.ready().then(() => {
        this.storage.get('vs_user').then((val) => {
            this.su = JSON.parse(val);
            this._full_name= this.su.full_name;
            this._cedula= this.su.usu_cedula;
            this._corro= this.su.usu_correo;
            this._user= this.su.usu_user;
            this._id_user= this.su.usu_id;
                     
        });
        this.storage.get('vs_foto').then((val) => {
          if(typeof val !== 'undefined' && val !== null && val !== ''){
            this.imagen_vacia_1 = false;
            this.imagen_1 = val;
          }
           
        });
         this.storage.get('vs_user_puntos_acumulados').then((val) => {
          let d = JSON.parse(val);
          if(typeof val !== 'undefined' && val !== null && typeof d.usu_puntos_acumulados !== 'undefined'){
            this._puntos= d.usu_puntos_acumulados + ' Puntos';
            this._nivel= d.usu_nivel ;
            this._proximo_nivel= d.usu_puntos_proximo_nivel + ' puntos para el próximo nivel.';

          }else{
            this._puntos= '0 Puntos';
            this._nivel='Nivel 1';
            this._proximo_nivel='50 puntos para el próximo nivel.';
          }
           
        });
      });

  }

   takePhoto(){
        this.camera.getPicture({
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType     : this.camera.PictureSourceType.CAMERA,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            targetWidth: 300,
            targetHeight: 300
        }).then((imageData) => {
                  let i = 'data:image/jpeg;base64,'+ imageData;   
                  this.guardarFoto(i);  
        }, (err) => {
            this.oAlerta.show1('ERROR: ' + err);
        });
    }

    accessGallery(){
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: this.camera.DestinationType.DATA_URL
        }).then((imageData) => { 
                let i = 'data:image/jpeg;base64,'+imageData; 
                this.guardarFoto(i); 
        }, (err) => {
          this.oAlerta.show1('ERROR: ' + err);
        });
    }

    openMenu(key) {
        let actionSheet = this.actionsheetCtrl.create({
          title: 'Menú',
          cssClass: 'action-sheets-basic-page',
          buttons: [
            /*{
              text: 'Ver',
              icon: !this.platform.is('ios') ? 'eye' : null,
              handler: () => {
                if(this.imagen_1 != ''){
                  this.verImage(this.imagen_1);
                }
                
              }
            },*/
            {
              text: 'Galería',
              icon: !this.platform.is('ios') ? 'images' : null,
              handler: () => {
                this.accessGallery();
              }
            },
            {
              text: 'Cámara',
              icon: !this.platform.is('ios') ? 'camera' : null,
              handler: () => {
                this.takePhoto();
              }
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              icon: !this.platform.is('ios') ? 'trash' : null,
              handler: () => {
                this.eliminarImagen1();
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel', 
              icon: !this.platform.is('ios') ? 'close' : null,
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
        
  }

   eliminarImagen1(){
        this.guardarFoto('');
    }

    verImage(url_photo){
      this.photoViewer.show(url_photo);
    }

guardarFoto(foto){
  
        if(this.oCS.isOnline()) {
            if( this._id_user != ''){      
                this.oLoad.showLoading(); 
                var data = JSON.stringify({
                                            KEY: 'KEY_USUARIO_UPDATE_FOTO',
                                            _id_user: this._id_user,
                                            _foto: foto,
                                            _ruta_imagen_eliminar: this.imagen_1
                                         });
                this.oEntity.get(data, this.oUrl.url_usuario, 0).finally(() => { 
                    this.oLoad.dismissLoading(); 
                }).subscribe(data => {
                    if(data.success == 1){
                        this.storage.ready().then(() => {
                            this.storage.remove('vs_foto');
                            this.storage.set('vs_foto', data.foto);
                            if(foto != ''){
                              
                              this.imagen_1 =data.foto;
                              this.imagen_vacia_1 = false;
                            }else{
                              this.imagen_vacia_1 = true;
                              this.imagen_1 ='';
                              
                            }
                            
                        });     
                    } else {
                        this.oAlerta.show1(data.msg);     
                    }   
                }, error => {
                    this.oAlerta.showVolverIntentar();

                });
        
            }
  
        } 
    }



  setCerrarSesion(){
    this.storage.ready().then(() => {
      
        this.storage.remove('vs_user');
        this.storage.remove('vs_user_puntos_acumulados');
        this.storage.remove('vs_foto');
        this.storage.remove('vs_code_push');
        this.storage.remove('vs_HomePage_lista_noticias');
        this.storage.remove('vs_HomePage_lista_promociones');
        this.storage.remove('vs_tiene_preferencias');
        this.storage.remove('vs_LogrosPage_Recargar');
        this.storage.remove('vs_usuario');       
        this.navCtrl.parent.parent.setRoot(LoginPage);
    });

  }
  
  goToPreferencias(){
    this.navCtrl.push(UsuariosubpreferenciaPage,  {data: '2'});
  }
  goToCambiarCredenciales(){
    this.navCtrl.push(CredencialPage);
  }
}
