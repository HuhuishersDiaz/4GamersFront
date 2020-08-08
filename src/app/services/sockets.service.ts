import {Injectable, inject} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, bindCallback} from 'rxjs';
import {res} from "../interfaces/interfaces";
import swal from 'sweetalert';
import {UIGamersService} from './ui-gamers.service';
import {ReturnStatement} from '@angular/compiler';
import {Router} from '@angular/router';
import {GamersService} from '../provides/GamersService';
import {global} from '@angular/compiler/src/util';
import {GlobalService} from './global.service';
import * as alertify from 'alertifyjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketsService { 
     //private url = 'http://localhost:3000';
    private url = environment.socketURL;
    private socket;
    public ListVersus = [];
    constructor(private UI : UIGamersService, private route : Router, private api : GamersService) {
        this.socket = io(this.url);

        this.socket.on('Confirmajugarversus', (infoRival) => { // console.log(infoRival);

            alertify.confirm('Aceptaron tu versus Quieres Jugarlo ', () => {
                alertify.success('Ok')

                this.respuestaconfirmacionversus(infoRival, true);
                this.api.AgregarRival(infoRival).then(data => {
                    if (data['info'].rowsAffected[0] == 1) {
                        this.route.navigateByUrl('/versus/encuentro/' + infoRival.idversus)
                    }
                })

            }, () => {
                alertify.error('Cancel')
                this.respuestaconfirmacionversus(infoRival, false);
            });
        });

    }

    public respuestaconfirmacionversus(data, respuesta) {

        let info = {
            idrival: data.idPersona,
            idanfitrion: data.idanfitrion,
            idjuego: data.idjuego,
            idversus: data.idversus,
            acepto: respuesta
        }
        return this.socket.emit('ConfirmacionVersus', info);

    }


    // aqui enviamos la informacion del uduario y esperamos a que el servidor nos de una respuesta
    public SendUserInfo(user) {

        return this.socket.emit('userInfo', user, (res) => res);
    }

    // Este es el proceso para crear un versus debemos de revisar que se ha creado satisfactoriamente
    async createVersus(data : any) {

        var RespuestaVersusus = await this.socket.emit('newVersus', data, (res) => { // console.log(res)
            return res;
        });

    }

    // Escuchamos en todo momento cuando hay un nuevo versus
    onNewVersus() {
        return Observable.create(observer => {
            this.socket.on('ListVersus', data => {
                if (data == null) {
                    return false;
                }
                // console.log(data);
                observer.next(data);
            });
        });
    }
    // Escuchamos la respuesta del anfitrion
    confirmacionversus() {
        return Observable.create(observer => {
            this.socket.on('respuestaversus', data => {
                if (data == null) {
                    return false;
                }
                // console.log(data);
                observer.next(data);
            });
        });
    }

    // Este metodo es cuando la persona acepta un versus de otra persona
    async accepVersus(data) {

        await this.socket.emit('Quieresjugarconmigo', data, (_respuesta : any) => {});
    }

    onNewMessageVersus() {
        return Observable.create(observer => {
            this.socket.on('MessageVersus', data => {
                if (data == null) {
                    return false;
                }
                // console.log(data);
                observer.next(data);
            });
        });
    }

    esperarrespuestaversus() {
        return Observable.create(observer => {
            this.socket.on('resultadoVersusRival', data => {
                if (data == null) {
                    return false;
                }
                // console.log(data);
                observer.next(data);
            });
        });
    }
    async chatVersus(data) { // console.log(data);
        await this.socket.emit('chatVersus', data, (_respuesta : any) => {
            return _respuesta;
        });
    }

    async enviarresultadoversus(data) { // console.log(data);
        await this.socket.emit('resultadoversus', data, (_respuesta : any) => {
            return _respuesta;
        });
    }

    async EsperarRivalTorneo(data) { // console.log(data);
        return new Promise(async (resolve)=>{
             this.socket.emit('buscarRivalTorneo',data, (_respuesta : any) => {
                // console.log(_respuesta);
                resolve(_respuesta);
            });
        })
    }
    // k
    // <i class="fa fa-keyk
    // k
    // k    APARTADO DE TORNEOS
    // k
    // k" aria-hidden="true"></i>

    async chatTorneos(data) { // console.log(data);
            await this.socket.emit('chatTorneo', data);
    }
    onNewMessageTorneo() {
        return Observable.create(observer => {
            this.socket.on('MessageTorneo', data => {
                if (data == null) {
                    return false;
                }
                // console.log(data);
                observer.next(data);
            });
        });
    }

    async EsperarResultadoRival(data) { // console.log(data);
        return new Promise(async (resolve)=>{
             this.socket.emit('EsperarResultadoVerus',data, (_respuesta : any) => {
                // console.log(_respuesta);
                resolve(_respuesta);
            });
        })
    }


}