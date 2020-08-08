import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert';
import {SocketsService} from 'src/app/services/sockets.service';
import {UserInfo} from 'src/app/models/interfaces';
import {GlobalService} from 'src/app/services/global.service';
import {Router} from '@angular/router';
import {GamersService} from 'src/app/provides/GamersService';
import {res, versusModel} from '../../interfaces/interfaces';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {UIGamersService} from 'src/app/services/ui-gamers.service';
import {IfStmt} from '@angular/compiler';
@Component({selector: 'app-versus', templateUrl: './versus.component.html', styleUrls: ['./versus.component.css']})
export class VersusComponent implements OnInit {
    versus = {
        juego: null,
        apuesta: 50,
        user: null
    }
    idpersona;
    juegos : any;
    allversus;
    tokens : number = 0;
    public listVersus : any[] = [];

    public misversus : any[] = [];
    // swal : Sweetalert
    constructor(private router : Router, private _socket : SocketsService, private global : GlobalService, private api : GamersService, private UI : UIGamersService,) {}

    ngOnInit(): void {


        this.idpersona = localStorage.getItem("idPersona") || null;

        this.getVersus();

        this.verJuegos();
        console.log(this.global.isUser());

        if(this.global.isUser()){
            console.log("Holaperro")
            this.misVersus();
            this.global.cargarTokens(this.idpersona).then(data=>{
                console.log(data);
                this.tokens = data;
            }).catch(err=>{console.log(err);
            })
        }

        this._socket.onNewVersus().subscribe(data => {
            this.listVersus.push(data);
        });
        
        

    }
    async misVersus() {
        if (this.misversus) {
            await this.api.misVersus(this.idpersona).then((data) => {
                this.misversus = (data['info']['recordset']);
                if(this.misversus[0] != null){
                    console.log();
                    alert("Tienes una partida pendiente")
                    this.router.navigateByUrl('/versus/encuentro/'+this.misversus[0].idversus)
                }
            });
        }
    }


    async verJuegos() {
        (await this.api.getGames()).subscribe((data) => {
            this.juegos = data;
        });
    }

    async getVersus() {
        (await this.api.getVersus()).subscribe((data) => {
            this.allversus = data.info.recordset;
            console.log(this.allversus);
        });

    }

    CantidadApostar(cantidad : number) {


        this.versus.apuesta += cantidad;
        if (this.versus.apuesta > 50) {
            alert("La cantidad maxima debe ser mayor o igual a 50 ");
            this.versus.apuesta = 50
            return false;
        }else if(this.versus.apuesta < 1){
            alert("La cantidad minima debe ser menor o igual a1 ");
            this.versus.apuesta = 1
            return false;
        }
        // alert(this.contador)
    }

    async AceptarVersus(data) { // console.log(data);

        let infoVersus = {
            idanfitrion: data.idpersona,
            idPersona: this.idpersona,
            idversus: data.idversus,
            idjuego: data.idjuego
        }
        let disponible;
        await this.api.versusDisponible(data.idversus).then((data) => {
            if (data.ok) {
                disponible = (data.info.recordset[0])
            }
        })
        // console.log(disponible);

        if (disponible.fkRival == null) {
            await this.api.idJuegopersona(this.idpersona, data.idjuego).then(data => {
                console.log(data.info.recordset[0]);
                if (data.ok) {
                    if (data.info.rowsAffected[0] == 0) {
                        alert("Para continuar es necesario cargar los ids,  ve a perfil ")
                    } else {

                        this._socket.accepVersus(infoVersus).then(data => {
                        }).catch(err => err);

                        this._socket.confirmacionversus()
                        .subscribe(data => {
                            if(data.acepto == true){
                                alert("El anfitrion Acepto la partida");
                             
                                this.router.navigateByUrl('/versus/encuentro/'+data.idversus)

                            }else{
                            alert("El anfitrion rechazo la partida");

                            }
                            console.log(data)
                        });


                    }
                    console.log(data.info);
                }
            }).catch(err => {
                alert('ocurrio un error intenta mas tarde ');
            });

        } else {

            alert('Partida no disponible')
            var i = this.listVersus.indexOf(data);
            this.listVersus.splice(i, 1);
        }

    }

    async CrearVersus() {
        
        if (!this.global.isUser()) {
            alert('Es necesario que te registres');
            return this.router.navigateByUrl('/login')
        }
        if(this.versus.apuesta > this.tokens){
            alert("Es necesario recargar monedas para continuar ");
            return false;
        }
        if (!this.idpersona || !this.versus.juego) {
            alert('Completa todos los campos');
        } else {
            await this.api.idJuegopersona(this.idpersona, this.versus.juego.idJuego).then(data => { // console.log(data.info.recordset[0]);
                if (data.ok) {
                    if (data.info.rowsAffected[0] == 0) {
                        alert("Para continuar es necesario cargar los ids,  ve a perfil ")
                    } else {
                        this.versus.user = this.global.User();
                        console.log(this.versus);

                        if(this.versus.apuesta > 50 || this.versus.apuesta < 1){
                            alert("El monto permitido en las apuestas comprende de 1 - 50 ")
                        }else{
                            this._socket.createVersus(this.versus)
                            alert("Esperando Rival")
                            this.misversus.push(this.versus)
                        }
                    }
                    console.log(data.info);
                }
            }).catch(err => {
                alert('ocurrio un error intenta mas tarde ');
            });
        }
    }
}
