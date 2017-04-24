import { Injectable } from '@angular/core';
/*
  Benito
*/
@Injectable()
export class Url {
  public url_usuario= 'http://ruteintime.com/ws/www/ws_usuario';
  public url_subpreferencias= 'http://ruteintime.com/ws/www/ws_subpreferencias';
  public url_noticias_promociones= 'http://ruteintime.com/ws/www/ws_noticias_promociones';
  public url_vehiculos_disponibles= 'http://169.53.13.129/ws_vehiculos_disponibles';
  public url_logros= 'http://ruteintime.com/ws/www/ws_logros';
  public url_foto= 'http://169.53.13.129/img/';
  constructor() {
  }

}
