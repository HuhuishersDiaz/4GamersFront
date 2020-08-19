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
@Component({selector: 'app-encuentro-campeonato', templateUrl: './encuentro-campeonato.component.html', styleUrls: ['./encuentro-campeonato.component.css']})
export class EncuentroCampeonatoComponent implements OnInit {

    @ViewChild('historiamMensajes')private historiamMensajes : ElementRef;
    @Output()navOut = new EventEmitter();

    public mensajes : any[] = [];
    idpersona : string | number;
    message : string = "";
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
    Disputa : boolean;
    TenemosResultado : boolean = false;
    idEncuentro : string;
    idCampeonato : string;
    dataEncuentro : any = {
        fecha: "",
        fkAnfitrion: 0,
        fkCampeonato: 0,
        fkFase: 0,
        fkRival: 0,
        idEncuentro: 0,
        numEncuentro: 0,
        status: 0
    };
    dataCampeonato : any = {
        cosEntrada: 1,
        fechaCreacion: "",
        fechaFin: "",
        fechaInicio: "",
        fkJuego: 0,
        idCampeonato: 0,
        imgLogo: "",
        imgPrecentacion: "",
        monPremio: 0,
        numjugadores: 0
    }
    constructor(private router : Router, private route : ActivatedRoute, private _socket : SocketsService, private global : GlobalService, private api : GamersService, private UI : UIGamersService) {

        this.idpersona = localStorage.getItem("idPersona");
        this.username = localStorage.getItem("Username");


    }


    async ngOnInit() {
        this.idCampeonato = this.route.snapshot.paramMap.get("idcampeonato");
        this.idEncuentro = this.route.snapshot.paramMap.get("idEncuentro");

        await this.infoCampeonato(this.idCampeonato);
        await this.validatEncuentro(this.idEncuentro);
        // await this.ResVersus()
        await this.loadchat(this.idEncuentro);

        this._socket.onNewMessageCampeonato().subscribe(data => {

            this.mensajes.push(data);
            this.historiamMensajes.nativeElement.scrollTop = this.historiamMensajes.nativeElement.scrollHeight;
        });


    }
    async infoCampeonato(idcampeonato) {
        await this.api.getCampeonato(idcampeonato).then((data : any) => {
            this.dataCampeonato = data[0];
        })

    }
    async validatEncuentro(idEncuento) {
        await this.api.getEncuentroCampeonato(idEncuento).then((data : any) => {
            this.dataEncuentro = data.info;

            this.api.idJuegopersona(this.dataEncuentro.fkAnfitrion, this.dataCampeonato.fkJuego).then(data => { // console.log(data.info.recordset[0]);
                if (data.ok) {
                    this.infoAnfitrion = data.info.recordset[0];
                }
            });

            this.api.idJuegopersona(this.dataEncuentro.fkRival, this.dataCampeonato.fkJuego).then(data => { // console.log(data.info.recordset[0]);
                if (data.ok) {
                    this.infoRival = data.info.recordset[0];
                }
            });


        })
        this.enviarMensaje("Se ha conectado")

    }

    loadchat(idversus) {
        this.api.chatCampeonato(this.idEncuentro).then((data) => {
            this.mensajes = data['info'].recordset;
        })

    }

    Reportar(info : boolean) {
        this.victoria = info;
    }

    enviarMensaje(mensaje) {

        const datamensaje = {
            idPersona: this.idpersona,
            username: this.username,
            message: mensaje,
            idencuentro: this.idEncuentro
        }

        this.mensajes.push(datamensaje);

        this._socket.chatCampeonato(datamensaje).then((data) => { // console.log(data);
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
        // {fkCampeonato, fkPersona}
        var infoEncuentro = {
            fkCampeonato: this.dataCampeonato.idCampeonato,
            idEncuentro: this.dataEncuentro.idEncuentro,
            fkPersona: this.idpersona,
            iswinner: this.victoria,

        }

        if (this.terminos) {
            // vamos a ver si existe alguna respuesta nuestra anteriormente
            

            if(this.victoria == false){
            
                this.api.cancelarInscripcionCampeonato(this.idCampeonato,this.idpersona).then(async(data:any)=>{
                    console.log(data);
                    if(data.ok)
                        await this.api.reportarCampeonato(infoEncuentro).then(data=>{
                            swal("Gracias por participar "); 
                            this.router.navigateByUrl('/torneos');
                            return false

                    })
                })
            }else{
                    
                let RespuestaRival = await this.ValidarResultado(infoEncuentro, idRival).then(data => data).catch(err => err)
                
                this.api.reportarCampeonato(infoEncuentro).then(data=>{
                    console.log(data);
                }) 

                switch (RespuestaRival) {
                    case false:
                        swal("Esperando la respuesta del rival", {
                            icon: 'info',
                            timer: 2000
                        })
                        break;
                    case "Disputa":
                        swal("¡Tu encuentro se ha ido a disputa!", "Es necesario cargar pruebas ", {
                            icon: 'info',
                            timer: 2000
                        })
                    
                        infoEncuentro.iswinner = false;
                        this.TenemosResultado = true;
                        this.Disputa = true;
                        // this.router.navigateByUrl('/versus')

                        break;
                    case "Ganador":
 
                        swal("Felicidade ","avanza a la siguiente ronda", {icon: 'success'})
                        this.router.navigateByUrl('/campeonato/'+this.dataCampeonato.idCampeonato)
                        break;

                    default:
                        swal(RespuestaRival, {
                            icon: 'info',
                            timer: 2000
                        })
                        "break";
                }
            }   
        } else {
            alertify.error("Confirma los terminos y condiciones")
        }
    }

    async ValidarResultado(infoEncuentro, idRival) {

        return new Promise((resolve) => {
            this.api.resPerEncCamp(this.dataEncuentro.idEncuentro, this.idpersona).then(data => {
                // alert("Aqui consultamos si tenemos un resultado cargado")
                // console.log(data)
                if (data['info'].rowsAffected[0] == 0) {
                    // alert("si no tenemos resultados cargados entonces reportamos ")
                    
                    this.api.resPerEncCamp(this.dataEncuentro.idEncuentro, idRival).then((res : any) => {
                        // console.log(res)
                        // alert("consultamos si el ruval tiene respuesta ");
                        
                        if (res['info'].rowsAffected[0] == 0) { 
                        //    alert("si el usuario no tiene nada reportado entonces esperamos ")
                                
                        resolve(false);
                        } else { 

                            // alert("El usuario tiene una respuesta ")
                            let infoRival = res['info'].recordset[0];
                            // console.log(infoRival)

                            if (infoRival.isWinner == this.victoria) {
                                // alert("Si el usuario tiene victoria lo mandamos a disputa")
                                resolve("Disputa")
                            } else {
                                // alert("Si el usuario tiene derrota entonces es ganador ")

                                resolve("Ganador");
                            }
                        }

                    }).catch(err => { // console.log(err)
                        resolve('Error de servidor')
                    })

                } else {
                    resolve("No puedes modificar tu resultado ")
                }
                // }
            })
        })
    }


    async subirDisputa() {
        swal("Tu resultado ha sido enviado exitosamente! ", "Espera nuestra respuesta", {icon: 'success'})
        this.router.navigateByUrl('/versus')

    }


    Actualizar() {
        this.api.setUserLoggedIn(true);
    }

}
