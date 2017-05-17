import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
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
  public msg='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.tipo = navParams.get('tipo'); // si es 1 gano insignia, caso contrario compartio
    this.nivel = navParams.get('nivel');
    this.puntosproximonivel = navParams.get('puntosproximonivel');
    this.puntosacum = navParams.get('puntosacum');
    if(this.tipo == '1'){
      this.msg= '¡Ganaste una Insignia!';

    }else if(this.tipo == '2'){
      this.msg= '¡Ganaste Puntos!';
      
    }else{
      this.msg= '¡Logro!';
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Alertaganar');
  }

 dismiss() {
        this.viewCtrl.dismiss();
    }
}
