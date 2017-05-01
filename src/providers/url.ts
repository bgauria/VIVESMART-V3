import { Injectable } from '@angular/core';
/*
  Benito
*/
@Injectable()
export class Url {
  public ruta='http://ruteintime.com/ws_vivesmart_v/';
  // public ruta='http://ruteintime.com/ws/www/';
  public url_usuario= this.ruta + 'ws_usuario';
  public url_subpreferencias= this.ruta + 'ws_subpreferencias';
  public url_noticias_promociones= this.ruta + 'ws_noticias_promociones';
  public url_logros= this.ruta + 'ws_logros';
  constructor() {
  }

}
