import { Component } from '@angular/core';
import { NavController, NavParams , ActionSheetController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from  '../login/login';

import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import {Fecha} from '../../providers/fecha';
import { UsuariosubpreferenciaPage } from '../usuariosubpreferencia/usuariosubpreferencia';
//import { Camera } from 'ionic-native';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//import { CameraPreview,  CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
//declare var navigator: any;
//declare var Connection: any;
/*
  Benito Auria García
  0988877109
  bgauria316@gmail.com
*/
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
  providers: [Entity, Url, Alerta, Load,Fecha, Toast, Camera, PhotoViewer]//CameraPreview
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

  public imagen_vacia_1 = true;
  public imagen_1='';

 constructor( public navCtrl: NavController, public navParams: NavParams,  private oUrl: Url, public actionsheetCtrl: ActionSheetController
             ,private photoViewer: PhotoViewer ,private camera: Camera,public platform: Platform ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, private oF: Fecha , public oT: Toast) {
          //private cameraPreview: CameraPreview,
    
  }

  ionViewWillEnter() {
     this.storage.ready().then(() => {
        this.storage.get('vs_user').then((val) => {
            this.su = JSON.parse(val);
            this._full_name= this.su.full_name;
            this._cedula= this.su.usu_cedula;
            this._corro= this.su.usu_correo;
            this._user= this.su.usu_user;
            //this._puntos= this.su.usu_puntos_acumulados + ' Puntos';

            
        });
        this.storage.get('vs_foto').then((val) => {
          //if(val != ''){
          if(typeof val !== 'undefined' && val !== null){
            this.imagen_vacia_1 = false;
            this.imagen_1 = val;
            console.log('--->--->' + val);
          }
           
        });
         this.storage.get('vs_user_puntos_acumulados').then((val) => {
          //if(val != ''){
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
            mediaType: this.camera.MediaType.PICTURE
        }).then((imageData) => {
           // if(this.imagen_1 == null || this.imagen_1 == ''){
                  this.imagen_vacia_1 = false;
                  this.imagen_1 = 'data:image/jpeg;base64,'+imageData;   
                  this.guardarFoto(this.imagen_1);  
            //}
        }, (err) => {
            console.log(err);
        });
    }

    accessGallery(){
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: this.camera.DestinationType.DATA_URL
        }).then((imageData) => {
           // if(this.imagen_1 == null || this.imagen_1 == ''){
                this.imagen_vacia_1 = false;
                this.imagen_1 = 'data:image/jpeg;base64,'+imageData;    
                this.guardarFoto(this.imagen_1); 
           // }
        }, (err) => {
          console.log(err);
        });
    }

    openMenu(key) {
        //this.validar_open_menu= true;
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
                
                //this.validar_open_menu= false;
              }
            },*/
            {
              text: 'Galería',
              icon: !this.platform.is('ios') ? 'images' : null,
              handler: () => {
                this.accessGallery();
                //this.validar_open_menu= false;
              }
            },
            {
              text: 'Cámara',
              icon: !this.platform.is('ios') ? 'camera' : null,
              handler: () => {
                this.takePhoto();
                //this.validar_open_menu= false;
              }
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              icon: !this.platform.is('ios') ? 'trash' : null,
              handler: () => {
                this.eliminarImagen1();
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

   eliminarImagen1(){
        this.storage.remove('vs_foto');
        this.imagen_vacia_1= true;
        this.imagen_1='';
    }

    verImage(url_photo){
      alert('x_x');
      this.photoViewer.show(url_photo);
    }






guardarFoto(_foto){
   this.storage.ready().then(() => {
        this.storage.remove('vs_foto');
        this.storage.set('vs_foto', _foto);
    });     

}



  setCerrarSesion(){
    this.storage.ready().then(() => {
      
        this.storage.remove('vs_user');
        this.storage.remove('vs_user_puntos_acumulados');
        //this.storage.remove('vs_foto');
        this.storage.remove('vs_HomePage_lista_noticias');
        this.storage.remove('vs_HomePage_lista_promociones');
        this.storage.remove('vs_tiene_preferencias');
        this.storage.remove('vs_LogrosPage_Recargar');
        this.navCtrl.parent.parent.setRoot(LoginPage);
    });

  }
  
  goToPreferencias(){
    //this.navCtrl.setRoot(UsuariosubpreferenciaPage, {data: '1'});
    this.navCtrl.push(UsuariosubpreferenciaPage,  {data: '2'});
    //this.navCtrl.push(Detallenoticiapromocion,  {data: _np});
  }
}
