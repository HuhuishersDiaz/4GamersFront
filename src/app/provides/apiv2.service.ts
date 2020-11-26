
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()

// @Injectable()

export class apiv2Service {

  public url = environment.apiv2Url;

  constructor(private http: HttpClient) { 

  }

  //#region  Apartado para torneos

  //ver los torneos no finalizados
  async TorneosDisponibles(){

   return  this.http.get(this.url + "torneos").toPromise();
   
  }

  //ver el estatus de la inscripcion 
  async inscripcionTorneo (data){

    let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

    let options = {
        headers: httpHeaders
    };

    return await this.http.post(this.url + "torneos/inscripcion", data, options).toPromise()
    
  }

  async misTorneos (data){

    let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

    let options = {
        headers: httpHeaders
    };

    return await this.http.post(this.url + "torneos/mistorneos", data, options).toPromise()
    
  }
  //#endregion



  //#endregion
  
  async CampeonatosDisponibles(){

    return  this.http.get(this.url + "campeonatos").toPromise();
    
  }

  async misCampeonatos (data){

    let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

    let options = {
        headers: httpHeaders
    };

    return await this.http.post(this.url + "campeonatos/miscampeonatos", data, options).toPromise()
    
  }

  //#endregion
  


}
