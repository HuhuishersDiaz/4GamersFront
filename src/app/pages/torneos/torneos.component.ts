import {Component, OnInit} from '@angular/core';
import {GamersService} from 'src/app/provides/GamersService';
import * as alertify from 'alertifyjs';
import {global} from '@angular/compiler/src/util';
import {GlobalService} from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({selector: 'app-torneos', templateUrl: './torneos.component.html', styleUrls: ['./torneos.component.css']})
export class TorneosComponent implements OnInit {
    listTorneos;

    idpersona : string;

    constructor(
      private api : GamersService,
      private global : GlobalService,
      private router : Router
      ) {
        this.idpersona = localStorage.getItem("idPersona") || null;

    }

    async ngOnInit() {
        await this.verTorneos();
    }

    async verTorneos() {
        await this.api.getTorneos().then(data => {
            this.listTorneos = data;
        }).catch(err => err);
        // this.listTorneos = torneos;
    }
    async Entrar(item : any) {
        console.log(item)
        if (!this.idpersona) {
            alert("Es necesario iniciar session ")
            return false;
        }
        let respuesta = await this.api.inscripcion(this.idpersona,item.idTorneo).then(data => data).catch(err => err);
        if (respuesta[0]) {
          // console.log(respuesta[0])
          this.router.navigateByUrl("/torneos/torneo/"+respuesta[0].fkTorneo+"/fases")
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

                alertify.confirm("La cuota de entrada para este torneo es de "+item.CosEntrada, async () => {
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
                            if(data["ok"]){
                                alertify.success("Bienvenido");
                                this.router.navigateByUrl("/torneos/torneo/"+inscripcion.fkTorneo+"/fases")
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
    async entrarCampeonato(){
        let token = await this.global.tokens;

        if (token < 200) {
            alertify.error("Tokens insuficientes ");

        } else if (8 < 7) {

            alertify.error("Lugares no disponibles");

        } else {

            alertify.confirm("La cuota de entrada para este torneo es de "+200, async () => {

                    var infoEncuentro = {
                        fkpersona: this.idpersona,
                        iswinner: false,
                        monto: 200,
                        mensaje: "Inscripcion Torneo"
                        // fkpersona, monto , iswinner,mensaje
                    }                    
                    this.api.EstadodeCuenta(infoEncuentro).then(data => { 
                        console.log(data)
                        if(data["ok"]){
                            this.router.navigateByUrl("/campeonato/123")
                            alertify.success("Bienvenido");
                        }
                    })
            }, () => {

                alertify.error("Cancelado");

            })
        }

    }


}
