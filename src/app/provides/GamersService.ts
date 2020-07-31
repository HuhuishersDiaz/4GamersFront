import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User, Login} from '../models/usuario';
import {Observable, throwError} from 'rxjs';
import {catchError, retry, map} from 'rxjs/operators';
import {respuesta} from '../interfaces/interfaces';

@Injectable()
export class GamersService { 
    public  url = 'https://back4gamers.herokuapp.com/api/';
    public idPersona;
   //public url = 'http://localhost:3000/api/';

    constructor(private http : HttpClient) {
        this.idPersona = localStorage.getItem("idPersona") || '0';
    }

    async getGames() {
        return this.http.get(this.url + "juegos/tjuegos");
    }

    async getTokens(idPersona) {
        return await this.http.get<respuesta>(this.url + "tokens/consultaTokens/" + idPersona).toPromise()

    }

    async getVersus() {
        return this.http.get<respuesta>(this.url + "versus/allversus/" + this.idPersona)
    }

    async AgregarRival(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "versus/editarival", data, options).toPromise()

    }

    async marcarresultado(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "versus/marcarresultado", data, options).toPromise()

    }

    async ValidarVersus(idVersus) {
        return this.http.get<respuesta>(this.url + 'versus/consultaversus/' + idVersus).toPromise()
    }

    async datosPersona(idpersona) {
        return await this.http.get<respuesta>(this.url + 'users/consultapersona/' + idpersona).toPromise()

    }

    async idJuegopersona(idpersona,idjuego) {
        return await this.http.get<respuesta>(`${this.url}users/consultaidjuego/${idpersona}/${idjuego}`).toPromise()
    }

    async versusDisponible(idversus) {
        return await this.http.get<respuesta>(`${this.url}versus/disponible/${idversus}`).toPromise()
    }

    async misVersus(idpersona) {
        return await this.http.get(`${this.url}versus/misversus/${idpersona}`).toPromise()
    }

    async chatVersus(idversus) {
        return await this.http.get(`${this.url}versus/chatversus/${idversus}`).toPromise()
    }

    async cargaridsPlataforma(data) {
      let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

      let options = {
          headers: httpHeaders
      };

      return await this.http.post(this.url + "versus/marcarresultado", data, options).toPromise()

    }

    async respuestarival(idversu,idpersona) {

        return await this.http.get(this.url + "versus/consultaresultado/"+idversu+"/"+idpersona).toPromise()
  
      }



}
