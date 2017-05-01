import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LogrosPage } from '../logros/logros';
import { PerfilPage } from '../perfil/perfil';
//import { PromosPage } from '../promos/promos';
import { TipsPage } from '../tips/tips';

/*
  Generated class for the Tab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html'
})
export class TabPage {
  pHome='0';//todo
  pPromo= '1';//solo promo con preferencias
  tab1 = HomePage;
  tab2 = PerfilPage;
  tab3 = LogrosPage;
  tab4 = HomePage;//PromosPage;
  tab5 = TipsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabPage');
  }

}
