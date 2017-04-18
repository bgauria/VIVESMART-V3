import { NgModule } from '@angular/core';
//import { IonicModule } from 'ionic-angular';
import { Detallenoticiapromocion } from './detallenoticiapromocion';

@NgModule({
  declarations: [
    Detallenoticiapromocion,
  ],
  imports: [
    //IonicModule.forChild(Detallenoticiapromocion),
  ],
  exports: [
    Detallenoticiapromocion
  ]
})
export class DetallenoticiapromocionModule {}
