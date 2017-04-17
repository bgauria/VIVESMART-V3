import { Injectable } from '@angular/core';
/*
  Benito
*/
@Injectable()
export class Validartxt {

  constructor() {
   
  }

  validarTxtVacio(data: string){
    if(data == ''){
      return true;
    }else{
      return false;
    }
  }


}
