import {
    Component,
    OnInit,
    resolveForwardRef,
    ViewChild,
    ElementRef,
    HostBinding,
    Output,
    EventEmitter
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

import * as alertify from 'alertifyjs'
import swal from 'sweetalert';

@Component({selector: 'app-encuentro', templateUrl: './encuentro.component.html', styleUrls: ['./encuentro.component.css']})

export class EncuentroComponent implements OnInit {

    @ViewChild('historiamMensajes')private historiamMensajes : ElementRef;
    @Output() navOut = new EventEmitter();
    baseUrl : string = "http://4gamers.xplainerservicios.com/content/";
    order : any;
    public mensajes : any[] = [];
    idpersona : any;
    idversus : string;
    message : any;
    idjuego : string; 
    mensaje : string;
    victoria:  boolean;
    username : string;
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
        nombre: '',
    };
    terminos : boolean;
    apuesta : string;
    Disputa: boolean;
    TenemosResultado : boolean = false;
    habilitarReporte : boolean = false;
    constructor(private router : Router, private route : ActivatedRoute, private _socket : SocketsService, private global : GlobalService, private api : GamersService, private UI : UIGamersService) {

        this.idpersona = localStorage.getItem("idPersona") ;
        this.username = localStorage.getItem("Username") ;

    }


    async ngOnInit() {
        this.idversus = this.route.snapshot.paramMap.get("id");
        this.username = localStorage.getItem("Username");

        await this.ValidarVersus(this.idversus);
         this.loadchat(this.idversus);

        await this.ResVersus()

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
        await this.api.ValidarVersus(idversus).then((res) => { // console.log(res);
            if (res.ok) {

                let infoUser = res.info.recordset[0];
                this.idjuego = infoUser['fkJuego'];
                let idAnfitrion = infoUser['fkAnfitrion'];
                let idRival = infoUser['fkRival'];
                this.apuesta = infoUser['Apuesta'];
                // alert(res.info.recordset[0]);
                if (this.idpersona == infoUser['fkAnfitrion'] || this.idpersona == infoUser['fkRival']) {
                    swal("Bienvenido "+this.username, {
                        icon: 'info',
                        timer: 1000
                    })
                    this.enviarMensaje("Se ha conectado")

                } else {
                    this.router.navigateByUrl('/versus')
                    swal("No perteneces a esta partida")
                }

                this.api.idJuegopersona(idAnfitrion, this.idjuego).then(data => { // console.log(data.info.recordset[0]);
                    console.log(data)
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

    async ResVersus(){
        this.infoRival.idpersona
        this.infoAnfitrion.idpersona

        let resRival = await this.api.respuestarival(this.idversus,this.infoRival.idpersona).then(data => data).catch(err => err)
        let resAnfitrion = await this.api.respuestarival(this.idversus,this.infoAnfitrion.idpersona).then(data => data).catch(err => err)
        console.log(resRival);
        console.log(resAnfitrion);

    }
    async newMessage() {

        let mensaje = await this.enviarMensaje(this.mensaje)

    }

    Reportar(info : boolean) {
        this.victoria = info;
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

            if(typeof this.victoria === 'undefined'){
                swal("Marca el resultado nuevamente por favor! ")
                return false; 
            }
            let RespuestaRival = await this.ValidarResultado(infoEncuentro, idRival).then(data => data).catch(err => err)

            switch (RespuestaRival) {
                case true:

                    // alertify.alert(`Gracias por participar`);
                    swal("Gracias por participar" ,{ buttons : {} , timer : 2000});

                    this.api.marcarresultado(infoEncuentro).then(data => { // //console.log(data);
                    })
                    infoEncuentro.mensaje = "Perdedor Versus"
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { // //console.log(data);
                    })
                    this.Actualizar();

                    this._socket.enviarresultadoversus(infoEncuentro).then((data) => data).catch(err => err);

                    this.router.navigateByUrl('/versus')

                    break;
                case false:
                    swal("Esperando la respuesta del rival", {
                        icon: "/assets/loading.gif",
                        timer: 2000
                    })
                    this.api.marcarresultado(infoEncuentro).then(data => { // //console.log(data);
                    })

                    this._socket.esperarrespuestaversus().subscribe(data => { // {fkversus: "948516830", fkpersona: "649251689", iswinner: true, monto: 50, img: "img.jpg"}
                        if (data.iswinner == this.victoria) {
                            swal("¡Tu encuentro se ha ido a disputa!", "Es necesario comprobar el resultado", {
                                icon: 'info',
                                timer: 2000
                            })
                            infoEncuentro.iswinner = false;
                            this.TenemosResultado = true;
                            infoEncuentro.mensaje = "Disputa Versus"
                            this.api.EstadodeCuenta(infoEncuentro).then(data => { // //console.log(data);
                            })
                            this.Disputa = true;
                            this.Actualizar();
                        } else {
                            swal("Felicidades has ganado " + this.apuesta + " tokens en un versus", {icon: 'success' ,timer : 2000,buttons: {}})
                            infoEncuentro.mensaje = "Ganador Versus";
                            this.api.EstadodeCuenta(infoEncuentro).then(data => {})
                            this.Actualizar();
                            this.router.navigateByUrl('/versus')
                            
                        }
                    });
                    break;
                case "Disputa":
                    swal("¡Tu encuentro se ha ido a disputa!", "Es necesario comprobar el resultado", {
                        icon: 'info',
                        timer: 2000
                    })
                    this.api.marcarresultado(infoEncuentro).then(data => { // console.log(data);
                    })
                    this._socket.enviarresultadoversus(infoEncuentro).then((data) => data).catch(err => err);
                    infoEncuentro.iswinner = false;
                    this.TenemosResultado = true;
                    infoEncuentro.mensaje = "Disputa Versus"
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { // console.log(data);
                    })
                    this.Actualizar();
                    this.Disputa = true;
                    // this.router.navigateByUrl('/versus')

                    break;
                case "Ganador":
                    this.api.marcarresultado(infoEncuentro).then(data => { // //console.log(data);
                    })

                    swal("Felicidades has ganado " + this.apuesta + " tokens en un versus", {icon: 'success' ,timer : 2000,buttons: {}})
                    infoEncuentro.mensaje = "Ganador Versus"
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { // //console.log(data);
                    })
                    this.Actualizar();
                    this.router.navigateByUrl('/versus')

                    break;

                default:
                    // alert(RespuestaRival)
                    swal(RespuestaRival, {
                        icon: 'info',
                        timer: 2000
                    })
                    "break";
            }


        } else {
            alertify.error("Confirma los terminos y condiciones")
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


    async subirDisputa(){
        swal("Tu resultado ha sido enviado exitosamente! ","Espera nuestra respuesta", {icon: 'success'})
        this.router.navigateByUrl('/versus')

    }

    name: string = 'Angular';

    Actualizar() {
        this.api.setUserLoggedIn(true);

    }

    reportaen($event){
        if($event.action == 'done'){
           this.habilitarReporte =  true;
        }
    }
}
