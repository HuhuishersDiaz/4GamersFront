import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    TemplateRef
} from '@angular/core';
import {GamersService} from 'src/app/provides/GamersService';
import * as alertify from 'alertifyjs';
import {global} from '@angular/compiler/src/util';
import {GlobalService} from 'src/app/services/global.service';
import {Router} from '@angular/router';
import {CountdownComponent, CountdownConfig} from 'ngx-countdown';
import swal from 'sweetalert';
import {BsModalService, BsModalRef, ModalOptions} from 'ngx-bootstrap/modal';

@Component({selector: 'app-torneos', templateUrl: './torneos.component.html', styleUrls: ['./torneos.component.css']})
export class TorneosComponent implements OnInit { // @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

    @ViewChild('modalReglas')modal : ElementRef;
    @ViewChild('modEntrar')ModalEntrar : ElementRef;
    modalRef : BsModalRef;

    option : ModalOptions = {
        keyboard: false,
        class: "modal-lg"

        // class : "modal-dialog-centered"
    }

    reglas = `<p dir="ltr" style="line-height:1.295;margin-left: 36pt;margin-top:0pt;margin-bottom:0pt;">
    </p><ol style="margin-top:0;margin-bottom:0;"><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">AGREGAR A TU RIVAL EN LA PLATAFORMA DEL TORNEO (PS4)</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">DURACIÓN CADA TIEMPO: 6 MINUTOS</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">CONTROLES: CUALQUIERA</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">VELOCIDAD DEL JUEGO: NORMAL</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">TIPO DE PLANTILLA: ONLINE</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">ELECCIÓN DE EQUIPO: LIBRE</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">EN CASO DE EMPATE SE JUGARÁ UN SIGUIENTE PARTIDO CON REGLA GOL DE ORO O LO ACORDADO POR LOS RIVALES POR EL CHAT.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">EN CASO DE TENER DISPUTA EN EL ENCUENTRO SE DEBE CARGAR UNA FOTO DE EVIDENCIA.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 21.25pt;padding-left: 6.549999999999997pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">DECLARAR UN RESULTADO FALSO IMPLICA UNA SANCIÓN AL JUGADOR SEGÚN LOS TÉRMINOS Y CONDICIONES.</span></p></li></ol><p><b style="font-weight:normal;" id="docs-internal-guid-4490b954-7fff-96bf-aba6-902e73078f52"><br></b></p><p dir="ltr" style="line-height:1.295;margin-left: 36pt;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">REQUISITOS Y RECOMENDACIONES:</span></p><p></p><ol style="margin-top:0;margin-bottom:0;"><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 24.549999999999997pt;padding-left: 3.25pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">TIPO DE CONEXIÓN: NAT 2 (INDISPENSABLE)</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;margin-left: 24.549999999999997pt;padding-left: 3.25pt;"><p dir="ltr" style="line-height:1.295;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Calibri,sans-serif;color:#fff;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">CONEXIÓN DE LA CONSOLA VIA CABLE DE RED (IDEAL) O WIFI</span></p></li></ol>
  `;

    listTorneos : any[];
    listCampeonatos : any[];
    idpersona : string;
    TorneoActivo : {};
    constructor(private api : GamersService, private global : GlobalService, private router : Router, private modalService : BsModalService) {
        this.idpersona = localStorage.getItem("idPersona") || null;

    }

    async ngOnInit() {
        await this.verTorneos();
        await this.verCampeonatos();
    }

    async verTorneos() {
        await this.api.getTorneos().then((data : any[]) => {
            this.listTorneos = data;
        }).catch(err => err);
        // this.listTorneos = torneos;
    }
    async verCampeonatos() {
        await this.api.getCampeonatos().then((data : any[]) => {
            this.listCampeonatos = data;
        }).catch(err => err);
        // this.listTorneos = torneos;
    }


    async Entrar(item : any) {
        if (!this.idpersona) 
            swal("Registrate", "Disfruta de miles de beneficios", {icon: "info"})

        let token = this.global.tokens;

        console.log(item.fkJuego);
        // item.fkJuego;
        // return false;

        let continuamos = await this.api.idJuegopersona(this.idpersona,  item.fkJuego).then(data => data).catch(err => err)
        console.log(continuamos)

        if (! continuamos.ok) {
            // swal("Para continuar es necesario cargar los IDs ", {icon: "/assets/Logo_gif_loader.gif"});
            swal("Para continuar es necesario cargar los IDs ",{icon : "info" ,buttons : {
                cancelar : {
                    text : "Cancelar",
                    className : "btn-danger",
                    value : false,
                    closeModal : true
                    
                },
                ir : {
                    text : "ir a perfil",
                    className : "btn-danger",
                    value : true,
                    
                }
            }
            }).then(data=>{
                if(data){
                    this.router.navigateByUrl("/perfil")

                }
            });
            return false;
        }

        let Inscripciones: any[] = await this.api.LugarTorneo(item.idTorneo).then((data : any[]) => data['info'].recordset).catch(err => err)

        let miInscripcion = Inscripciones.find(c => c.fkPersona == this.idpersona);
        console.log(miInscripcion);
        if (miInscripcion) {
            this.router.navigateByUrl("/torneos/torneo/" + miInscripcion.fkTorneo + "/fases")
            return false;
        }
        // alert(Inscripciones.length)
        // alert(item.numJugadores)
        if (token < item.CosEntrada) {
            alertify.error("Tokens insuficientes ");
            return false;

        } else if (Inscripciones.length >= item.numJugadores) {

            alertify.error("Lugares no disponibles");
            return false;

        } else {

            this.modalRef = this.modalService.show(this.ModalEntrar);
            this.TorneoActivo = item;
        }
    }


    async entrarCampeonato(item : any) {

        this.modalRef = this.modalService.show(this.ModalEntrar, {});

        let tokens = await this.global.tokens;

        let numInscripciones = 0;
        await this.api.getInscripcionesCampeonato(item.idCampeonato).then((data : any) => {
            numInscripciones = data.rowsAffected[0];
        })


        let dataInscripcion = {
            fkCampeonato: item.idCampeonato,
            fkPersona: this.idpersona
        }

        var infoOperacion = {
            fkpersona: this.idpersona,
            iswinner: false,
            monto: item.cosEntrada,
            mensaje: "Inscripcion Campeonato"
        }
        let Inscripcion;

        await this.api.getInscripcionCampeonatos(this.idpersona, item.idCampeonato).then((data : any) => { // console.log(data)
            if (data.rowsAffected[0] > 0) {
                Inscripcion = data.recordset[0];
            }
        })
        // console.log(Inscripcion)
        if (Inscripcion) {
            if (Inscripcion.status == 1) {
                swal("Estas de vuelta", "Bienvenido")
                this.router.navigateByUrl(`/campeonato/${
                    item.idCampeonato
                }`)
            } else {
                swal("El campeonato aun no finaliza")
            }
        } else if (tokens < item.cosEntrada) {
            swal("Tokens insuficiontes")
        } else {
            if (numInscripciones == item.numjugadores) {
                swal("Lugares no disponibles");
                return false;
            }

            this.api.EstadodeCuenta(infoOperacion).then((data : any) => {
                if (data.info.rowsAffected[0] == 1) {
                    this.api.posInscripcionCampeonato(dataInscripcion).then(async (data : any) => {
                        if (data.info == true) {
                            swal("Operacion exitosa", "Bienvenido", {icon: 'success'})

                            this.router.navigateByUrl("/campeonato/" + item.idCampeonato)
                        }
                    })
                }

            })
        }

    }

    handleEvent($event) {
        console.log($event);
    }

    verReglas(item, template : TemplateRef < any >) {
        this.modalRef.hide();
        console.log(item);
        this.modalRef = this.modalService.show(template, this.option);

    }
    closeModal() {
        this.modalRef.hide();
        alertify.error("Cancelado");

    }

    async ConfirmaInscripcion() {
        let dataInscripcion = {
            fkTorneo : this.TorneoActivo['idTorneo'], 
            fkPersona : this.idpersona, 
            }
            console.log(this.TorneoActivo)
        let avalible = await this.api.InscripcionTorneo(dataInscripcion).then(data => data).catch(err => err)
        console.log(avalible)
        if (avalible.message[0] == 1) {

            var infoEncuentro = {
                fkpersona: this.idpersona,
                iswinner: false,
                monto: this.TorneoActivo['CosEntrada'],
                mensaje: "Inscripcion Torneo",
                referencia : this.TorneoActivo['idTorneo']
                // fkpersona, monto , iswinner,mensaje
            }
            this.api.EstadodeCuenta(infoEncuentro).then(data => {
                console.log(data)
                if (data["ok"]) {
                    this.modalRef.hide();
                    alertify.success("Bienvenido");
                    this.router.navigateByUrl("/torneos/torneo/" + this.TorneoActivo['idTorneo'] + "/fases")
                }
            })

        }
      
    }


}
