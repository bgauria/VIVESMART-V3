import { NgModule } from '@angular/core';
import { Alertaganar } from './alertaganar';

@NgModule({
  declarations: [
    Alertaganar,
  ],
  imports: [
    //IonicModule.forChild(Alertaganar),
  ],
  exports: [
    Alertaganar
  ]
})
export class AlertaganarModule {}
