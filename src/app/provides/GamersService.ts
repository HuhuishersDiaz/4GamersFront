import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User, Login} from '../models/usuario';
import {Observable, throwError} from 'rxjs';
import {catchError, retry, map} from 'rxjs/operators';
import {respuesta, inscripcion} from '../interfaces/interfaces';
import {environment} from '../../environments/environment';

@Injectable()
export class GamersService {

    public url = environment.apiUrl;
    public idPersona;

    constructor(private http : HttpClient) {
        this.idPersona = localStorage.getItem("idPersona") || 0;
    }

    async getGames() {
        return this.http.get(this.url + "juegos/tjuegos");
    }

    async getTokens(idPersona) {

        return await this.http.get<respuesta>(this.url + "tokens/consultaTokens/" + idPersona).toPromise()

    }

    async getVersus() {
        console.log(this.idPersona)
        if(this.idPersona == 'null'){
            return this.http.get<respuesta>(this.url + "versus/allversus/" + this.idPersona)

        }
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

    async idJuegopersona(idpersona, idjuego) {
        return await this.http.get<respuesta>(`${
            this.url
        }users/consultaidjuego/${idpersona}/${idjuego}`).toPromise()
    }
    
    async idJuegopersonaTorneo(idInscripcion, idjuego) {
        return await this.http.get<respuesta>(`${
            this.url
        }users/consultaidjuegoTorneo/${idInscripcion}/${idjuego}`).toPromise()
    }

    async versusDisponible(idversus) {
        return await this.http.get<respuesta>(`${
            this.url
        }versus/disponible/${idversus}`).toPromise()
    }

    async misVersus(idpersona) {
        return await this.http.get(`${
            this.url
        }versus/misversus/${idpersona}`).toPromise()
    }

    async chatVersus(idversus) {
        return await this.http.get(`${
            this.url
        }versus/chatversus/${idversus}`).toPromise()
    }





    async getidsPlataformas(idPersona) {
        return await this.http.get(`${
            this.url
        }users/idsPlataformas/${idPersona}`).toPromise()
    }

    async cargaridsPlataforma(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}users/insertIdsPlataforma`, data, options).toPromise()

    }

    async respuestarival(idversu, idpersona) {

        return await this.http.get(`${this.url}versus/consultaresultado/${idversu}/${idpersona}`).toPromise()

    }
    async EstadodeCuenta(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}users/Cuenta`, data, options).toPromise()
    }


    async getTorneos() {
        return await this.http.get(`${this.url}torneos/torneosnofinalizados`).toPromise()
    }

    async LugarTorneo(idTorneo) {
        return await this.http.get(`${this.url}torneos/consultaInscripciones/${idTorneo}`).toPromise()
    }

   async inscripcion(idPersona,idTorneo) {
        return await this.http.get<inscripcion[]>(`${this.url}torneos/consultarInscripcion/${idPersona}/${idTorneo}`).toPromise()
    }
    async fasesTorneo(idTorneo) {
        return await this.http.get(`${this.url}torneos/fasesTorneo/${idTorneo}`).toPromise()

    }
     async FinalizarInscripcion(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}torneos/FinalizarInscripcion`, data, options).toPromise()
    }
    async InscripcionTorneo(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}torneos/inserttorneo`, data, options).toPromise()
    }
    async statusFase(idpersona,idfase) {
        return await this.http.get(`${this.url}torneos/procesoFases/${idpersona}/${idfase}`).toPromise()

    } 

    async validarEncuentro(idencuentro){
        return await this.http.get(`${this.url}encuentros/infoEncuentro/${idencuentro}`).toPromise()

    }

    async chatEncuentro(idencuentro: any) {
        return await this.http.get(`${ this.url}encuentros/chatTorneo/${idencuentro}`).toPromise()
    }

    async respuestarivalTorneo(idencuentro: string, idinscripcion: string) {
        return await this.http.get(`${this.url}encuentros/infoResultado/${idencuentro}/${idinscripcion}`).toPromise()
    }
    async GuardarResultadoTorneo(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "encuentros/marcarresultado", data, options).toPromise()

    }

    async EncuentroFase(idencuentro: string, idinscripcion: string) {
        return await this.http.get(`${this.url}encuentros//hayEncuentro/${idencuentro}/${idinscripcion}`).toPromise()
    }

    async resultadosEncuentro(idencuentro: string) {
        return await this.http.get(`${this.url}encuentros/resultadosEncuentro/${idencuentro}`).toPromise()
    }

    async paquetesTokensTienda() {
        return await this.http.get(`${this.url}tokens/paquetes`).toPromise()
    }
    async paqueteTokens(idPaquete) {
        return await this.http.get(`${this.url}tokens/paquete/${idPaquete}`).toPromise()
    }


}
