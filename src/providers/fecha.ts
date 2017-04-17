import {Injectable} from '@angular/core';  

@Injectable()
export class Fecha {  

    constructor() {
    }

/*
    getYear(year_actual, year_tope) {
        var fecha = new Date();
        var YEARACTUAL = year_actual;
        var listyear = {'year': []};
        for(let i= YEARACTUAL; i >= year_tope ; i--){
            listyear.year.push({ 'y': i });
        }
        return  listyear.year;
    }
*/
    getListaYear(year_actual, year_tope) {
        //var fecha = new Date();
        var YEARACTUAL = year_actual;
        var listyear = {'year': []};
        for(let i= YEARACTUAL; i >= year_tope ; i--){
            listyear.year.push({ 'y': i });
        }
        return  listyear.year;
    }


    getNumYearMasDia(){
        var fecha = new Date();
        var fecha_actual= fecha.getFullYear() +  fecha.getDate();
        return fecha_actual;
    }

    getYearActual(){
        var fecha = new Date();
        return fecha.getFullYear();
    }

    getFechaDDMMYY(){
        var f = new Date();
        return  f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate()  ;
    }

    stringToDate(_date,_format,_delimiter){ ////oFecha.stringToDate(this.prospecto._gestionfecha,"dd/MM/yyyy","/").toISOString();
                var formatLowerCase=_format.toLowerCase();
                var formatItems=formatLowerCase.split(_delimiter);
                var dateItems=_date.split(_delimiter);
                var monthIndex=formatItems.indexOf("mm");
                var dayIndex=formatItems.indexOf("dd");
                var yearIndex=formatItems.indexOf("yyyy");
                var month=parseInt(dateItems[monthIndex]);
                month-=1;
                var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
                return formatedDate;
    }


    sumaFecha = function(d, fecha){

            var Fecha = new Date();
            var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() +1) + "/" + Fecha.getFullYear());
            var sep = sFecha.indexOf('/') != -1 ? '/' : '-'; 
            var aFecha = sFecha.split(sep);
            var fecha_ = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
            fecha= new Date(fecha_);
            fecha.setDate(fecha.getDate()+parseInt(d));
            var anno=fecha.getFullYear();
            
            var mes= fecha.getMonth()+1;
            var dia= fecha.getDate();



            mes = (mes < 10) ? ("0" + mes) : mes;
            dia = (dia < 10) ? ("0" + dia) : dia;
            var fechaFinal = dia+sep+mes+sep+anno;
            return (fechaFinal);
    }

    hora(){
            var tiempo = new Date();
            var hora = tiempo.getHours();
            var minuto = tiempo.getMinutes();
            //var segundo = tiempo.getSeconds();
            var h='';
            var m='';
            if(hora <= 9){
                h= '0' + hora;
            }else{
                h= hora.toString();
            }
            if(minuto <= 9){
                m= '0' + minuto;
            }else{
                m= minuto.toString();
            }
            var x= h.toString() +':'+ m.toString();//+':'+ segundo;
            return x.toString();
    }

}
