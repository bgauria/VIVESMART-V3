import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';

/**
 * Generated class for the Alertaganar page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-alertaganar',
  templateUrl: 'alertaganar.html',
})
export class Alertaganar {
  public tipo = '';
  public nivel = '';
  public puntosproximonivel= '';
  public puntosacum='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.tipo = navParams.get('tipo'); // si es 1 gano insignia, caso contrario compartio
    this.nivel = navParams.get('nivel');
    this.puntosproximonivel = navParams.get('puntosproximonivel');
    this.puntosacum = navParams.get('puntosacum');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Alertaganar');
  }

 dismiss() {
        this.viewCtrl.dismiss();
    }
}
