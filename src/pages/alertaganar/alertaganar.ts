import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-alertaganar',
  templateUrl: 'alertaganar.html',
})
export class Alertaganar {
  public tipo = '';
  public _titulo='';
  public ifBandera= true;
  public _imagen = '';
  public _nombre = '';
  public _descripcion = '';
  public _bandera= '';
  public _pie= '¡Buen trabajo!';

  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.tipo = navParams.get('tipo'); // si es 1 gano insignia, caso contrario compartio

    if(this.tipo == '1'){
      this._titulo= '¡Ganaste una Insignia!';

    }else if(this.tipo == '2'){
      this._titulo= '¡Ganaste Puntos!';
      
    }else{
      this._titulo= navParams.get('_nombre');
      this.ifBandera= false;
      this._imagen = navParams.get('_imagen');
      this._nombre = navParams.get('_nombre');
      this._descripcion = navParams.get('_descripcion');
      this._bandera = navParams.get('_bandera');
      this._pie = '¡Consíguela!';
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Alertaganar');
  }

 dismiss() {
        this.viewCtrl.dismiss();
    }
}
