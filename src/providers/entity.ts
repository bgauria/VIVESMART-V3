import {Injectable} from '@angular/core';  
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
//import { SimulateService } from '../providers/simulate';

/*
Benito
*/
@Injectable()
export class Entity {
    private headers;
    
    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    get(data, url, tiempo){
        let res= this.http.post(url, data, {headers: this.headers}).timeout(30000).map(res => res.json()).catch(this.handleError);
        return res;
    }
     handleError(error) {
        return Observable.throw(error.json().error || 'Server error');
    }
  
}