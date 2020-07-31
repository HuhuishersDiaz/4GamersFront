import {
    Component,
    OnInit,
    resolveForwardRef,
    ViewChild,
    ElementRef
} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
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
        });

    }
    ngOnDestroy(): void {

        this.enviarMensaje("Salio del chat")

    }

    loadchat(idversus) {
        this.api.chatVersus(idversus).then((data) => {
            this.mensajes = data['info'].recordset;
            console.log(data['info'].recordset);
        })
    }

    async ValidarVersus(idversus) {
        await this.api.ValidarVersus(idversus).then((res) => {
            if (res.ok) {

                let infoUser = res.info.recordset[0];
                this.idjuego = infoUser['fkJuego'];
                let idAnfitrion = infoUser['fkAnfitrion'];
                let idRival = infoUser['fkRival'];
                this.apuesta = infoUser['apuesta'];
                if (this.idpersona == infoUser['fkAnfitrion'] || this.idpersona == infoUser['fkRival']) {
                    alert("Bienvenido");
                    this.enviarMensaje("Se ha conectado")

                } else {
                    this.router.navigateByUrl('/versus')
                    alert('No perteneces a esta partida ');
                }

                this.api.idJuegopersona(idAnfitrion, this.idjuego).then(data => {
                    console.log(data.info.recordset[0]);
                    if (data.ok) {
                        this.infoAnfitrion = data.info.recordset[0];
                    }
                });

                this.api.idJuegopersona(idRival, this.idjuego).then(data => {
                    console.log(data.info.recordset[0]);
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
        this.historiamMensajes.nativeElement.scrollTop = this.historiamMensajes.nativeElement.scrollHeight;

    }

    Reportar(info : boolean) {
        this.victoria = info;
        let mensaje;
        if (this.victoria) {
            mensaje = "SE HA DECLARADO VICTORIOSO"
        } else {
            mensaje = "SE HA DECLARADO PERDEDOR"
        }

        this.enviarMensaje(mensaje)

    }

    enviarMensaje(mensaje) {


        const datamensaje = {
            idPersona: this.idpersona,
            username: this.username,
            message: mensaje,
            idversus: this.idversus
        }

        this.mensajes.push(datamensaje);

        this._socket.chatVersus(datamensaje).then((data) => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
        this.mensaje = '';
    }


    async Finalizar() {
        console.log(this.infoAnfitrion)
        console.log(this.infoRival)
        let idRival;
        if (this.idpersona == this.infoAnfitrion.idpersona) {
            idRival = this.infoRival.idpersona
        } else {
            idRival = this.infoAnfitrion.idpersona;
        }
        let data = {
            fkversus: this.idversus,
            fkpersona: this.idpersona,
            iswinner: this.victoria,
            img: 'img.jpg'
        }

        if (this.terminos) {

            await this.timeout(idRival).then(data=>{
                alert(data)
            })
        

            

            // this.api.marcarresultado(data).then(data=>{
            //     alert("Esperando Resultado .....")
            //     if(data['ok']){
            //         if(this.victoria){


            //             // alert('Felicides has ganado '+this.apuesta)
            //         }

            //     }else{
            //         alert(data['message'])
            //         this.router.navigateByUrl('/versus')
            //     }

            // })
        } else {

            alert("Confirma los terminos y condiciones");

        }


        // fkversus,fkpersona,iswinner,img

    }

    timeout(idRival) {
        return new Promise(resolve => {
            let resultadoRival = false;
            setTimeout(() => {
                do {
                    this.api.respuestarival(this.idversus, idRival).then(data => {
                        if (data['ok']) {
                            if (data['info'].recordset[0]) {
                                console.log("Si tenemos datos ");
                                console.log("Si tenemos datos ");
                            }else{
                            console.log("Aun no responde nada");
                            }
                        }else{
                            console.log("Aun no responde nada");
                        }
                    });
                } while (resultadoRival == false);
            }, 1000);
            resolve(resultadoRival)
        });
    }


}
