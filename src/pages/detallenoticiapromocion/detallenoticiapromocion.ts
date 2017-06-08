import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams ,Platform, ModalController} from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import {Entity} from '../../providers/entity';
import {Url} from '../../providers/url';
import {Alerta} from '../../providers/alerta';
import {Load} from '../../providers/load';
import {Toast} from '../../providers/toast';
import { Alertaganar } from  '../alertaganar/alertaganar';
import {ConnectivityService} from '../../providers/connectivity-service';
@IonicPage()
@Component({
  selector: 'page-detallenoticiapromocion',
  templateUrl: 'detallenoticiapromocion.html',
  providers: [Entity, Url, Alerta, Load, Toast, BarcodeScanner, SocialSharing, ConnectivityService]
})
export class Detallenoticiapromocion {
  private su;
  public np:any;
   
    constructor(  public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private oUrl: Url, private oCS: ConnectivityService
               ,private socialSharing: SocialSharing ,private barcodeScanner: BarcodeScanner ,public storage: Storage, public oEntity: Entity,private oAlerta: Alerta, private oLoad: Load, public oT: Toast) {
    this.np= navParams.get('data');
  }

  
    goBack() {
        this.navCtrl.pop();
    }
    //Hacer el like
    addFavorito(){
        if(this.np.bandera_like == 'light'){
            this.createLike(1, this.np);
        }else{
            this.createLike(0, this.np);
        }
    }
    //Realiza el registro o actualización del like de la noticia o promoción
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
  //Comparte la noticia o promoción por redes sociales
  compartir(){
     this.socialSharing.share(
       this.np.not_titulo,
       this.np.not_descripcion,
        '',
        this.np.img
    ).then((data) => {
        this.createMisiones(2);
      }).catch(() => { });

  }
  //Escanea el código qr
  setScanear(){
        this.barcodeScanner.scan().then((barcodeData) => {
            if(barcodeData.text == this.np.not_id){
                this.createMisiones(1);
            }else{
                this.oAlerta.show1('El Código Escaneado no es válido para esta promoción!');
            }
        }, (err) => {
            this.oT.showLongToast('Error');
        });
    }
  //Realiza el registro en la base de datos
  createMisiones(op){
       if(this.oCS.isOnline()) {
            let _key='';
            if(op == '1'){
                _key= 'KEY_NOTICIAS_QR';

            }else{
                _key= 'KEY_NOTICIAS_COMPARTIR';
            }
            this.storage.ready().then(() => {
            this.storage.get('vs_user').then((val) => {   
                this.su = JSON.parse(val);
                this.oLoad.showLoading();
                var data = JSON.stringify({
                                        KEY: _key,
                                        _id_not: this.np.not_id,
                                        _id_usu: this.su.usu_id
                                    });
                if(this.su.usu_id != ''){
                    this.oEntity.get(data, this.oUrl.url_noticias_promociones, 0).finally(() => { 
                        this.oLoad.dismissLoading(); 
                    }).subscribe(data => {
                        console.log('--> ' + JSON.stringify(data));
                        if(data.success == 1){
                            this.storage.remove('vs_user_puntos_acumulados');
                            this.storage.set('vs_user_puntos_acumulados', JSON.stringify(
                                                                    {
                                                                        usu_nivel: data.mision_compartir_escanear[0].niv,
                                                                        usu_puntos_proximo_nivel: data.mision_compartir_escanear[0].faltaParaProximoNivel,
                                                                        usu_puntos_acumulados: data.mision_compartir_escanear[0]._ACUM
                                                                        
                                                                    }
                                                                ));

                            this.showModalPremio(
                                op,
                                data.mision_compartir_escanear[0].niv,
                                data.mision_compartir_escanear[0].faltaParaProximoNivel,
                                data.mision_compartir_escanear[0]._ACUM
                            );
                            this.storage.remove('vs_LogrosPage_Recargar');
                            this.storage.set('vs_LogrosPage_Recargar', '1');

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
    //Muestra el modal una vez que se haya compartido o escaneado
    showModalPremio(tipo, nivel, puntosproximonivel, acum){
        let modal = this.modalCtrl.create(Alertaganar, {
            tipo: tipo,
        });
        modal.present();    
    }

}
