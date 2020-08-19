import {Component, OnInit, ViewChild} from '@angular/core';
import {GamersService} from 'src/app/provides/GamersService';
import * as alertify from 'alertifyjs';
import {global} from '@angular/compiler/src/util';
import {GlobalService} from 'src/app/services/global.service';
import {Router} from '@angular/router';
import {CountdownComponent, CountdownConfig} from 'ngx-countdown';
import swal from 'sweetalert';

@Component({selector: 'app-torneos', templateUrl: './torneos.component.html', styleUrls: ['./torneos.component.css']})
export class TorneosComponent implements OnInit { // @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

    listTorneos : any[];
    listCampeonatos : any[];
    idpersona : string;

    constructor(private api : GamersService, private global : GlobalService, private router : Router) {
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
        console.log(item)
        if (!this.idpersona) {
            alert("Es necesario iniciar session ")
            return false;
        }
        let respuesta = await this.api.inscripcion(this.idpersona, item.idTorneo).then(data => data).catch(err => err);
        if (respuesta[0]) { // console.log(respuesta[0])
            this.router.navigateByUrl("/torneos/torneo/" + respuesta[0].fkTorneo + "/fases")
        } else {

            let token = await this.global.tokens;
            let lugar = await this.api.LugarTorneo(item.idTorneo).then(data => data['info'].rowsAffected[0]).catch(err => err)

            let inscripcion = {
                fkTorneo: item.idTorneo,
                fkPersona: this.idpersona,
                Lugar: lugar + 1
            }

            if (token < item.CosEntrada) {
                alertify.error("Tokens insuficientes ");

            } else if (inscripcion.Lugar > item.numJugadores) {

                alertify.error("Lugares no disponibles");

            } else {

                alertify.confirm("La cuota de entrada para este torneo es de " + item.CosEntrada, async () => {
                    let avalible = await this.api.InscripcionTorneo(inscripcion).then(data => data).catch(err => err)
                    if (avalible.message[0] == 1) {

                        var infoEncuentro = {
                            fkpersona: this.idpersona,
                            iswinner: false,
                            monto: item.CosEntrada,
                            mensaje: "Inscripcion Torneo"
                            // fkpersona, monto , iswinner,mensaje
                        }
                        this.api.EstadodeCuenta(infoEncuentro).then(data => {
                            console.log(data)
                            if (data["ok"]) {
                                alertify.success("Bienvenido");
                                this.router.navigateByUrl("/torneos/torneo/" + inscripcion.fkTorneo + "/fases")
                            }
                        })


                    } else {
                        alertify.error("Intenta mas tarde");
                    }


                }, () => {

                    alertify.error("Cancelado");

                })
            }
        }
    }

    async entrarCampeonato(item : any) {
        let tokens = await this.global.tokens;
            
        let numInscripciones = 0;
        await this.api.getInscripcionesCampeonato(item.idCampeonato).then((data:any)=>{
            numInscripciones =  data.rowsAffected[0];
        })

        
        let dataInscripcion = {
            fkCampeonato: item.idCampeonato,
            fkPersona: this.idpersona
        }

        var infoOperacion= {
            fkpersona: this.idpersona,
            iswinner: false,
            monto: item.cosEntrada,
            mensaje: "Inscripcion Campeonato"
        }
        let Inscripcion ;

        await this.api.getInscripcionCampeonatos(this.idpersona,item.idCampeonato).then((data:any)=>{
            console.log(data)
            if(data.rowsAffected[0] > 0 ){
                Inscripcion = data.recordset[0];
            }
        })
        console.log(Inscripcion)
        if(Inscripcion){
            if(Inscripcion.status == 1){
                swal("Estas de vuelta","Bienvenido")
                this.router.navigateByUrl(`/campeonato/${item.idCampeonato}`)
            }else{
                swal("El campeonato aun no finaliza")
            }
        }
        else
            if(tokens < item.cosEntrada ){
                swal("Tokens insuficiontes")
            }else{
                if(numInscripciones == item.numjugadores){
                    swal("Lugares no disponibles");
                    return false;
                }
            
                this.api.EstadodeCuenta(infoOperacion).then((data : any)=>{

                    if(data.info.rowsAffected[0] == 1){
                        this.api.posInscripcionCampeonato(dataInscripcion).then(async (data: any)  => {
                            if(data.info == true){
                                swal("Operacion exitosa","Bienvenido",{
                                    icon : 'success'
                                })
                            await this.api.BuscarRival(dataInscripcion).then(data=>{
                                    console.log(data);
                                });
                                alert("Estamos BuscandoRival")
                             this.router.navigateByUrl("/campeonato/"+ item.idCampeonato)
                            }
                        })  
                    }
                    
                })  
            }

    }

    handleEvent($event) {
        console.log($event);
    }

}
