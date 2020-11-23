import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User, Login} from '../models/usuario';
import {Observable, throwError, Subject} from 'rxjs';
import {catchError, retry, map} from 'rxjs/operators';
import {respuesta, inscripcion,DetalleFase} from '../interfaces/interfaces';
import {environment} from '../../environments/environment';

@Injectable()
export class GamersService {
   

    public url = environment.apiUrl;
    public idPersona: string;
    public ActualizarMonedas = new Subject();

    constructor(private http : HttpClient) {
        this.idPersona = localStorage.getItem("idPersona");
    }
    public isUserLoggedIn = new Subject();

    setUserLoggedIn(loggedIn: boolean) {
      this.isUserLoggedIn.next(loggedIn);
    }
    
    async getGames() {
        return this.http.get(this.url + "juegos/tjuegos").toPromise();
    }

    async reglasjuego(idjuego) {
    
        return this.http.get(this.url + `juegos/reglas/${idjuego}`).toPromise();
    }

    async getTokens(idPersona) {

        return await this.http.get<respuesta>(this.url + "tokens/consultaTokens/" + idPersona).toPromise()

    }

    async getVersus() {
        // console.log(this.idPersona)
        if(this.idPersona == 'null'){
            return this.http.get<respuesta>(this.url + "versus/allversus/0")

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
    async GanadorVersus(data : any) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };
        return await this.http.post(this.url + "versus/GanadorVersus", data, options).toPromise();
    }
         
    async subirDisputa(data : any) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
                headers: httpHeaders
         };
         return await this.http.post(this.url + "versus/subirDisputa", data, options).toPromise();
 
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

    async listAmigos(idpersona) {
        return await this.http.get(`${
            this.url
        }users/amigos/${idpersona}`).toPromise()
    }

    async buscaramigo(username : string) {
        console.log(username);
        return await this.http.get(`${
            this.url
        }users/buscaramigo/${username}`).toPromise()
    }

    async acumuladoVersus(idpersona) {
        return await this.http.get(`${
            this.url
        }users/acumuladoversus/${idpersona}`).toPromise()
    }


    async Pendientes(idpersona) {
        return await this.http.get(`${
            this.url
        }versus/pendientes/${idpersona}`).toPromise()
    }
    async chatVersus(idversus) {
        return await this.http.get(`${
            this.url
        }versus/chatversus/${idversus}`).toPromise()
    }


    async agregarAmigo(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}users/agregarAmigo`, data, options).toPromise()

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

    async EditarUsuario(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}users/editarusuario`, data, options).toPromise()
    }
    async EstadodeCuenta(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}users/Cuenta`, data, options).toPromise()
    }

    async Reembolsos(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(`${this.url}users/Reembolso`, data, options).toPromise()
    }


    async getTorneos() {
        return await this.http.get(`${this.url}torneos/`).toPromise()
    }
    async getTorneo(idTorneo) {
        return await this.http.get(`${this.url}torneos/${idTorneo}`).toPromise()
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
        return await this.http.get<DetalleFase>(`${this.url}torneos/procesoFases/${idpersona}/${idfase}`).toPromise()

    } 

    async cancelarTorneo(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };
        return await this.http.post(`${this.url}torneos/cancelar`,data,options).toPromise()
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
   async ganadorFaseTorneo(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "encuentros/ganadorfase", data, options).toPromise()

    }
    async EncuentroFase(idencuentro: string, idinscripcion: string) {
        return await this.http.get(`${this.url}encuentros//hayEncuentro/${idencuentro}/${idinscripcion}`).toPromise()
    }
    async mistorneos(idpersona: string) {
        return await this.http.get(`${this.url}torneos//mistorneos/${idpersona}`).toPromise()
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

    async uploadimg(img : File){
        const formData = new FormData();

        formData.append('file', img);

        return await this.http.post<any>('https://4gamers.xplainerservicios.com/api/user/PostUserImage', formData).toPromise();
    }

   async imagenperil(data) {
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "users/profileimg", data, options).toPromise()

    }
    async infoPersona(idPersona) {
        return await this.http.get(`${this.url}users/consultapersona/${idPersona}`).toPromise()
    }

    async Estadisticas(idPersona) {
        return await this.http.get(`${this.url}users/estadisticas/${idPersona}`).toPromise()
    }

    async CancelarVersus(data){
        // console.log(idAnfitrion);
       
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "versus/cancelarversus", data, options).toPromise()
    }
    async CancelarTodosVersus(data){
        // console.log(idAnfitrion);

        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "versus/cancelartodos", data, options).toPromise()
    }
    async getCampeonatos() {
        return await this.http.get(`${this.url}campeonato`).toPromise()
    }
    async getCampeonato(idcampeonato) {
        return await this.http.get(`${this.url}campeonato/${idcampeonato}`).toPromise()
    }
    async getEncuentroCampeonato(idEncuentro) {
        return await this.http.get(`${this.url}campeonato/encuentro/${idEncuentro}`).toPromise()
    }
    async   getInscripcionCampeonatos(idpersona : string ,idCampeonato : string  ) {
        return await this.http.get(`${this.url}campeonato/Inscripcion/${idpersona}/${idCampeonato}`).toPromise()
    }
    async getInscripcionesCampeonato(idCampeonato : string  ) {
        return await this.http.get(`${this.url}campeonato/inscripciones/${idCampeonato}`).toPromise()
    }
    async detallefasecampeonato(fkcampeonato : string ,fkfase : string  ) {
        return await this.http.get(`${this.url}campeonato/fases/${fkcampeonato}/${fkfase}`).toPromise()
    }

    async encuentrosFaseCampeonato(fkcampeonato : string ,fkfase : string  ){
        return await this.http.get(`${this.url}campeonato/encuentrosFase/${fkcampeonato}/${fkfase}`).toPromise()
    }
    
    async ganadorcampeonato(fkcampeonato : string) {
        return await this.http.get(`${this.url}campeonato/ganador/${fkcampeonato}`).toPromise()
    }
    async EncuentroActivo(idPersona : string ) {
        return await this.http.get(`${this.url}campeonato/encuentroActivo/${idPersona}`).toPromise()
    }
    async chatCampeonato(idEncuentro: string) {
        return await this.http.get(`${this.url}campeonato/chat/${idEncuentro}`).toPromise()
    }
    // Resultado persona encuentro campeonato 
    async resPerEncCamp(idversu, idpersona) {
        return await this.http.get(`${this.url}campeonato/consultaresultado/${idversu}/${idpersona}`).toPromise()
    }

    async ganadorfaseCamp(idcampeonato, idfase) {
        return await this.http.get(`${this.url}campeonato/ganadorfase/${idcampeonato}/${idfase}`).toPromise()
    }

    async posInscripcionCampeonato(data){
        // console.log(idAnfitrion);
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "campeonato/inscripcion", data, options).toPromise()
    }

    async cancelarInscripcionCampeonato(idencuentro : string , idpersona : any){
        // console.log(idAnfitrion);
        return await this.http.get(`${this.url}campeonato/inscripcion/cancelar/${idencuentro}/${idpersona}`).toPromise()
    }

    async cancelarCampeonato(data){
        // console.log(idAnfitrion);
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "campeonato/cancelar", data, options).toPromise()
    }
    
    async reportarCampeonato(data){
        // console.log(idAnfitrion);
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "campeonato/reportarresultado", data, options).toPromise()
    }
    async guardarGanadorfase(data){
        // console.log(idAnfitrion);
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "campeonato/ganadorfase", data, options).toPromise()
    }

    async faseactivacampeonato(idcampeonato : string , idpersona : any){
        // console.log(idAnfitrion);
        return await this.http.get(`${this.url}campeonato/faseactiva/${idcampeonato}/${idpersona}`).toPromise()
    }


    async agregarCopa(data){
        // console.log(idAnfitrion);
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "users/agregarcopa", data, options).toPromise()
    }
    async GuardarDireccion(data){
        // console.log(idAnfitrion);
        
        let httpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

        let options = {
            headers: httpHeaders
        };

        return await this.http.post(this.url + "users/direccion", data, options).toPromise()
    }



    //Aqui comenzamos con las nuevas funcunes de la version 2 del sistema 

    async versusbyjuego( idjuego : any ){

        return await this.http.get(`${this.url}versus/ver/${idjuego}`).toPromise();

    }


    
}
