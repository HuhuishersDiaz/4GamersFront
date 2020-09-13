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
import swal2 from 'sweetalert2';
import {BsModalService, BsModalRef, ModalOptions} from 'ngx-bootstrap/modal';

@Component({selector: 'app-torneos', templateUrl: './torneos.component.html', styleUrls: ['./torneos.component.css']})
export class TorneosComponent implements OnInit { // @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

    @ViewChild('modalReglas')modalReglas : ElementRef;
    @ViewChild('modEntrar')ModalEntrar : ElementRef;
    modalRef : BsModalRef;

    option : ModalOptions = {
        keyboard: false,
        class: "modal-lg"

        // class : "modal-dialog-centered"
    }

    reglas : string;

    listTorneos : any[];
    listCampeonatos : any[];
    idpersona : string;
    TorneoActivo : any;
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
        this.TorneoActivo = item;

        if (!this.idpersona) 
            swal("Registrate", "Disfruta de miles de beneficios", {icon: "info"})

        let token = this.global.tokens;

        // console.log(item.fkJuego);
        await this.api.reglasjuego(item.fkJuego)
        .then((data : any) =>{
            this.reglas = data.info.recordset[0].descripcion
            // console.log(data);
        })
        // item.fkJuego;
        // return false;

        let continuamos = await this.api.idJuegopersona(this.idpersona,  item.fkJuego).then(data => data).catch(err => err)
        // console.log(continuamos)

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
        }
    }


    async entrarCampeonato(item : any) {

        // this.modalRef = this.modalService.show(this.ModalEntrar, {});

        let tokens = this.global.tokens;

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

    async verReglas( torneo : any  ) {
        console.log(torneo);
        // this.modalService.hide(0)
        let reglas;
        await this.api.reglasjuego(torneo.fkJuego)
        .then((data : any) =>{
            reglas = data.info.recordset[0].descripcion
            console.log(data);
        })
        // this.modalRef = this.modalService.show(this.modalReglas, this.option);
        swal2.fire({
            title : "Reglas",
            html : reglas,
            confirmButtonColor: "#f91757",   

        }) 

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
