import {Injectable} from '@angular/core';  
import { AlertController } from 'ionic-angular';

@Injectable()
export class Alerta {  

    constructor(private alertCtrl: AlertController) {
    }
    show1(text) {
        let alert = this.alertCtrl.create({
            title: 'ViveSmart',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    }
    show2(title,text, boton) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [boton]
        });
        alert.present(prompt);
    }
    
    showVolverIntentar() {
        let alert = this.alertCtrl.create({
            title: "Estamos teniendo problemas",
            subTitle: "Por favor vuelva a intentar!",
            buttons: ["OK"]
        });
        alert.present(prompt);
    }
    showSinInternet() {
        let alert = this.alertCtrl.create({
            title: "Estamos teniendo problemas",
            subTitle: "Por favor revise su conexión a internet y vuelva a intentar!",
            buttons: ["OK"]
        });
        alert.present(prompt);
    }
   
}
