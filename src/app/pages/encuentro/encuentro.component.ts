import {
    Component,
    OnInit,
    resolveForwardRef,
    ViewChild,
    ElementRef
} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, retry, delay, ignoreElements} from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import {GlobalService} from 'src/app/services/global.service';
import {GamersService} from 'src/app/provides/GamersService';
import {UIGamersService} from 'src/app/services/ui-gamers.service';
import {SocketsService} from 'src/app/services/sockets.service';
import {infouser} from 'src/app/interfaces/interfaces';

@Component({selector: 'app-encuentro', templateUrl: './encuentro.component.html', styleUrls: ['./encuentro.component.css']})

export class EncuentroComponent implements OnInit {

    @ViewChild('historiamMensajes')private historiamMensajes : ElementRef;


    order : any;
    public mensajes : any[] = [];
    idpersona;
    idversus;
    message : any;
    idjuego;
    mensaje;
    victoria;
    username;
    infoAnfitrion : infouser = {
        idpersona: 0,
        idplataforma: '',
        username: '',
        nombre: ''
    };
    infoRival : infouser = {
        idpersona: 0,
        idplataforma: '',
        username: '',
        nombre: ''
    };
    terminos;
    apuesta;
    constructor(private router : Router, private route : ActivatedRoute, private _socket : SocketsService, private global : GlobalService, private api : GamersService, private UI : UIGamersService) {

        this.idpersona = localStorage.getItem("idPersona") || null;
        this.username = localStorage.getItem("Username") || null;

    }


    ngOnInit() {
        this.idversus = this.route.snapshot.paramMap.get("id");
        this.username = localStorage.getItem("Username") || null;

        this.ValidarVersus(this.idversus);

        this.loadchat(this.idversus);

        this._socket.onNewMessageVersus().subscribe(data => {
            this.mensajes.push(data);
            this.historiamMensajes.nativeElement.scrollTop = this.historiamMensajes.nativeElement.scrollHeight;
        });

    }

    ngOnDestroy(): void {

        this.enviarMensaje("Salio del chat")

    }

    loadchat(idversus) {
        this.api.chatVersus(idversus).then((data) => {
            this.mensajes = data['info'].recordset;
            // console.log(data['info'].recordset);
        })

    }

    async ValidarVersus(idversus) {
        await this.api.ValidarVersus(idversus).then((res) => {
            // console.log(res);
            if (res.ok) {

                let infoUser = res.info.recordset[0];
                this.idjuego = infoUser['fkJuego'];
                let idAnfitrion = infoUser['fkAnfitrion'];
                let idRival = infoUser['fkRival'];
                this.apuesta = infoUser['Apuesta'];
                // alert(res.info.recordset[0]);
                if (this.idpersona == infoUser['fkAnfitrion'] || this.idpersona == infoUser['fkRival']) {
                    alert("Bienvenido");
                    this.enviarMensaje("Se ha conectado")

                } else {
                    this.router.navigateByUrl('/versus')
                    alert('No perteneces a esta partida ');
                }

                this.api.idJuegopersona(idAnfitrion, this.idjuego).then(data => { // console.log(data.info.recordset[0]);
                    if (data.ok) {
                        this.infoAnfitrion = data.info.recordset[0];
                    }
                });

                this.api.idJuegopersona(idRival, this.idjuego).then(data => { // console.log(data.info.recordset[0]);
                    if (data.ok) {
                        this.infoRival = data.info.recordset[0];
                    }
                });


            }
        }).catch((err) => {

            this.router.navigateByUrl('/versus')

        })


    }

    async newMessage() {

        let mensaje = await this.enviarMensaje(this.mensaje)

    }

    Reportar(info : boolean) {
        this.victoria = info;
        // let mensaje;
        // if (this.victoria) {
        //     mensaje = "SE HA DECLARADO VICTORIOSO"
        // } else {
        //     mensaje = "SE HA DECLARADO PERDEDOR"
        // }

        // this.enviarMensaje(mensaje)

    }

    enviarMensaje(mensaje) {


        const datamensaje = {
            idPersona: this.idpersona,
            username: this.username,
            message: mensaje,
            idversus: this.idversus
        }

        this.mensajes.push(datamensaje);

        this._socket.chatVersus(datamensaje).then((data) => { // console.log(data);
        }).catch(err => { // console.log(err);
        })
        this.mensaje = '';
        this.historiamMensajes.nativeElement.scrollTop = this.historiamMensajes.nativeElement.scrollHeight;

    }


    async Finalizar() {
        let idRival;
        if (this.idpersona == this.infoAnfitrion.idpersona) {
            idRival = this.infoRival.idpersona
        } else {
            idRival = this.infoAnfitrion.idpersona;
        }

        var infoEncuentro = {
            fkversus: this.idversus,
            fkpersona: this.idpersona,
            iswinner: this.victoria,
            monto: this.apuesta,
            img: 'img.jpg',
            mensaje: ""

        }

        if (this.terminos) { // vamos a ver si existe alguna respuesta nuestra anteriormente

            let RespuestaRival = await this.ValidarResultado(infoEncuentro, idRival).then(data => data).catch(err => err)

            switch (RespuestaRival) {
                case true:
                    alert("Aqui marcmoas el resultado y guardamos las monedas en caso de que sea perdio")

                    this.api.marcarresultado(infoEncuentro).then(data => { // //console.log(data);
                    })
                    infoEncuentro.mensaje = "Perdedor Versus"
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { // //console.log(data);
                    })

                    this._socket.enviarresultadoversus(infoEncuentro).then((data) => data).catch(err => err);

                    this.router.navigateByUrl('/versus')

                    break;
                case false:
                    alert("Aqui mandamos el resultado pero esperamos el del rival para ver quien gano o si marco que gano ")
                    this.api.marcarresultado(infoEncuentro).then(data => { // //console.log(data);
                    })

                    this._socket.esperarrespuestaversus()
                    .subscribe(data => { // {fkversus: "948516830", fkpersona: "649251689", iswinner: true, monto: 50, img: "img.jpg"}
                        if (data.iswinner == this.victoria) {
                            alert("Tu encuentro se ha ido a disputa")
                            infoEncuentro.iswinner = false;
                            infoEncuentro.mensaje = "Disputa Versus"
                             this.api.EstadodeCuenta(infoEncuentro).then(data => { // //console.log(data);
                            })
                            this.router.navigateByUrl('/versus')

                        } else {
                            alert("Felicidade has ganado " + data.monto + " tokens en un versus");
                            infoEncuentro.mensaje = "Ganador Versus";
                            this.api.EstadodeCuenta(infoEncuentro).then(data => {})
                            this.router.navigateByUrl('/versus')

                        }
                    });
                    break;
                case "Disputa":
                    alert("Si es disputa le quitamos las monedas y marcamos el torneo como disputa");
                    this.api.marcarresultado(infoEncuentro).then(data => { // console.log(data);
                    })
                    this._socket.enviarresultadoversus(infoEncuentro).then((data) => data).catch(err => err);
                    infoEncuentro.iswinner = false;
                    infoEncuentro.mensaje = "Disputa Versus"
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { // console.log(data);
                    })
                    this.router.navigateByUrl('/versus')

                    break;
                case "Ganador":
                    this.api.marcarresultado(infoEncuentro).then(data => { // //console.log(data);
                    })

                    alert("Felicidade has ganado " + this.apuesta + " tokens en un versus");
                    infoEncuentro.mensaje = "Ganador Versus"
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { // //console.log(data);
                    })
                    this.router.navigateByUrl('/versus')

                    break;

                default:
                    alert(RespuestaRival)
                    "break";
            }


        } else {
            alert("Confirma los terminos y condiciones");

        }
    }

    async ValidarResultado(infoEncuentro, idRival) {

        return new Promise((resolve) => {
            this.api.respuestarival(this.idversus, this.idpersona).then(data => { // //console.log(data);
                if (data['ok']) { // comprobamos si tenemos una respuesta previa
                    if (data['info'].rowsAffected[0] == 0) { // sino tenemos respuesta previa entonces subimos el resultado y si damos por perdido el encuentro podemos continuar y descontar
                        if (this.victoria == false) {

                            resolve(true);
                            // si lo que reportamos fue una victoria entonces vamos a consultar el resultado del rival
                        } else { // si reportamos una victoria entonces tenemos que esperar el resultado del rival
                            this.api.respuestarival(this.idversus, idRival).then(data => {
                                // si el rival no ha reportado nada entoces esperamos a que reporte el rival
                                // console.log(data);
                                if (data['info'].rowsAffected[0] == 0) { // Entonces guardamos nuestro resultado y esperamos a que responda el usuario
                                    resolve(false);
                                } else { // si el rival ya reporto revisamos si no hay una disputa
                                    let infoRival = data['info'].recordset[0];

                                    // si el resultado del rival es el mismo entonces Cremos una disputa y debemos de quitarles las monedas a los dos
                                    if (infoRival.isWinner == this.victoria) {
                                        resolve("Disputa")
                                    } else {
                                        resolve("Ganador");
                                    }

                                }

                            }).catch(err => { // console.log(err)
                                resolve('Error de servidor')
                            })
                        }

                    } else {
                        resolve("No puedes modificar tu resultado ")
                    }
                }
            })
        })
    }


}
