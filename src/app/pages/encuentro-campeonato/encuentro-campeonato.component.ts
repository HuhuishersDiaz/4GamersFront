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
    baseUrl : string = "http://4gamers.xplainerservicios.com/content/";

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
        nombre: '',
        copas : 0,
        rango : ''
    };
    infoRival : infouser = {
        idpersona: 0,
        idplataforma: '',
        username: '',
        nombre: '',
        copas : 0,
        rango : ''
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
    encuentros : any[];
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
        console.log(idEncuento)
        await this.api.getEncuentroCampeonato(idEncuento).then((data : any) => {
            console.log(data)
            this.dataEncuentro = data.info;
            
            this.api.idJuegopersona(this.dataEncuentro.fkAnfitrion, this.dataCampeonato.fkJuego).then(data => { // console.log(data.info.recordset[0]);
                if (data.ok) {
                    this.infoAnfitrion = data.info.recordset[0];
                    console.log(data);
                    
                }
            });

            this.api.idJuegopersona(this.dataEncuentro.fkRival, this.dataCampeonato.fkJuego).then(data => { // console.log(data.info.recordset[0]);
                if (data.ok) {
                    this.infoRival = data.info.recordset[0];
                }
            });
        })

        await this.api.encuentrosFaseCampeonato(this.idCampeonato,this.dataEncuentro.fkFase).then((data : any)=>{
            console.log(data)
            this.encuentros  =  data.info.recordset;
            // alert("aqui llegan todos los encuentros")
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

        console.log(this.encuentros)
        let numerodeencuentro = this.encuentros.findIndex(c=> c.idEncuentro == this.idEncuentro)
        let dataganador = {
            idcampeonato : this.idCampeonato,
            idfase : this.dataEncuentro.fkFase,
            idpersona : this.idpersona,
            numEcuentro : numerodeencuentro
        }
        // return false;
        if (this.terminos) {

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
                        let data = {
                            fkrival : idRival,
                            idencuentro : this.idEncuentro
                        }
                        let Respuesta;
                        await this._socket.EsperarResultadoRivalCampeonato(data).then(data => {
                            Respuesta = data;
                        })
                        console.log(Respuesta);
                        if (Respuesta.info.isWinner == this.victoria) {
                            swal("Tu encuentro se ha ido a Disputa")
                           this.Disputa = true;

                        } else {
                            this.api.guardarGanadorfase(dataganador).then((data)=>{
                                console.log(dataganador)
                            })
                            swal("Felicidade ","avanza a la siguiente ronda", {icon: 'success'})
                            this.router.navigateByUrl('/campeonato/'+this.dataCampeonato.idCampeonato)
                            
                        }
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
 
                        this.api.guardarGanadorfase(dataganador).then((data)=>{
                            console.log(dataganador)
                        })
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
