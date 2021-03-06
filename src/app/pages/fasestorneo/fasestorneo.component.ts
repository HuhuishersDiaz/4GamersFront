import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GamersService} from 'src/app/provides/GamersService';
import {SocketsService} from 'src/app/services/sockets.service';
// import {NgxLoadingModule, ngxLoadingAnimationTypes} from 'ngx-loading';
import {DetalleFase, FaseTorneo, Detalle, Encuentro} from 'src/app/interfaces/interfaces';
import {ignoreElements} from 'rxjs/operators';
import swal from 'sweetalert';
@Component({selector: 'app-fasestorneo', templateUrl: './fasestorneo.component.html', styleUrls: ['./fasestorneo.component.css']})
export class FasestorneoComponent implements OnInit {

    // public loading = false;

    // public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    idTorneo : any;
    fasesTorneo : any[] = [];
    idPersona : string;
    puedojugar : boolean = false;
    infoInscripcion : any = {};
    bloqueamolasiguiente : boolean = false;
    infoEncuentro : Encuentro;
    process : number = 0;
    dataTorneo : any = {
        CosEntrada: 0,
        Descripcion: "",
        IdTipoTorneo: 0,
        fechaCreacion: "",
        fechaFin: "",
        fechaInicio: "",
        fin: 10,
        fkJuego: 0,
        fkTipo: 0,
        idTorneo: 0,
        img: "",
        imgPrecentacion: "",
        inicio: 10,
        monPremio: 0,
        numJugadores: 8,
        status: null
    };
    numInscripciones : any;
    constructor(private router : Router, private route : ActivatedRoute, private api : GamersService, private _socket : SocketsService) {

        this.idPersona = localStorage.getItem("idPersona") || null;
        this.idTorneo = this.route.snapshot.paramMap.get("id");

    }

    async ngOnInit() {

        await this.infoinscripcion();
        await this.infoTorneo();
        await this.loadfases();
        
        await this.api.reglasjuego(this.dataTorneo.fkJuego)
        .then((data : any) =>{
            this.dataTorneo.reglas = data.info.recordset[0].descripcion
        })


        
            
            
            
    }

    async infoTorneo() {
        this.api.getTorneo(this.idTorneo).then((data : any) => { // console.log(data[0])
            this.dataTorneo = data[0]
            console.log(data[0]);
        })
    }
    async loadfases() {
        await this.api.fasesTorneo(this.idTorneo).then(async (data : FaseTorneo[]) => {
            console.log(data)
            this.fasesTorneo = data['info'].recordset;

        })

    }
    async cargarResultados(){
        await this.validarFase(0, this.fasesTorneo[0].idFase)
        await this.validarFase(1, this.fasesTorneo[1].idFase)
        await this.validarFase(2, this.fasesTorneo[2].idFase)
        if(this.dataTorneo.numJugadores > 8){
            await this.validarFase(3, this.fasesTorneo[3].idFase)
        }
        // await this.validarFase(2, this.fasesTorneo[3].idFase)
        if(this.process >= 99 ){

            let dataCopa = {
                idpersona : this.idPersona ,
                referencia : this.idTorneo ,
                descripcion : "Ganador Campeonato",
                ganadaen : "Torneo"

            }

            let addcopa = false;
            await this.api.agregarCopa(dataCopa).then((data: any )=>{
                addcopa = data.ok
            })

        

            const willDelete = await swal({
                title: "¡Felicidades!",
                text: "Eres el ganador del torneo",
                icon: "/assets/copas.png",
                dangerMode: true,
              });

              if (willDelete) {
                this.router.navigateByUrl("/home")
                this.api.cancelarTorneo({ idtorneo : this.idTorneo});
              }
            };

    }




    async validarFase(posicion, idFase) { // console.log(posicion ,idFase)
        return new Promise(async (resolve) => {
            if (this.bloqueamolasiguiente == false) {

                await this.api.EncuentroFase(idFase, this.infoInscripcion.idInscripcion).then(async (data : DetalleFase) => {
                    console.log(data);
                    if (!data.encuentro.IdEncuentro) {
                        this.fasesTorneo[posicion].status = "Buscar Rival"
                        this.fasesTorneo[posicion].activa = true;
                        return false;
                    }

                    let mio = data.detalle.find((item : Detalle) => item.fkInscripcion == this.infoInscripcion.idInscripcion);
                    let otro = data.detalle.find((item : Detalle) => item.fkInscripcion != this.infoInscripcion.idInscripcion);

                    if (mio) {

                        if (mio.isWinner == false) {

                            await this.api.FinalizarInscripcion({idinscripcion: this.infoInscripcion.idInscripcion}).then(data => data).catch(err => err);
                            this.router.navigateByUrl("/torneos")
                        }

                        if (otro) {
                            if (mio.isWinner == otro.isWinner) {
                                this.fasesTorneo[posicion].status = "Disputa"
                                this.fasesTorneo[posicion].activa = true;
                                this.bloqueamolasiguiente = true;
                                resolve(false)

                            } else {
                                this.fasesTorneo[posicion].status = "Victoria";
                                // alert(this.fasesTorneo.length);
                                if(this.fasesTorneo.length == 4){
                                  this.process += 25;
                                }else{
                                  this.process += 33.33;
                                }
                                this.fasesTorneo[posicion].activa = false;
                                this.bloqueamolasiguiente = false;
                                // alert(this.process);
                                resolve(true)

                            }

                        } else {

                            resolve(true)
                            this.fasesTorneo[posicion].status = "Esperando"
                            this.bloqueamolasiguiente = true;

                        }

                    } else {

                        resolve(false)
                        this.bloqueamolasiguiente = true;
                        this.infoEncuentro = data.encuentro
                        // alert(this.infoEncuentro.fkInscripcionRival );
                        // alert(this.infoEncuentro.fkInscripcionAnfitrion );
                        if(this.infoEncuentro.fkInscripcionRival != null && this.infoEncuentro.fkInscripcionAnfitrion != null){
                            this.jugar();
                        }else{
                            this.fasesTorneo[posicion].status = "Buscar Rival"
                            this.fasesTorneo[posicion].activa = true;
                            return false;
                        }
                    }

                });

            }
        })

    }


    async infoinscripcion() {
        await this.api.inscripcion(this.idPersona, this.idTorneo).then(data => {

            this.infoInscripcion = data[0];
        });
    }

    async BuscarRival(fase : any) {
        // alert(fase)
        console.log(fase);
        
        if (fase.status == "Disputa") {
            swal("Espera la resolucion de tu disputa")
        } else {
            swal("Buscando Rival" , {icon: "/assets/loading.gif" ,buttons : {}}  );
            fase.idpersona = this.idPersona;
            fase.idinscripcion = this.infoInscripcion.idInscripcion;
            let respuesta = await this._socket.EsperarRivalTorneo(fase).then(data => data).catch(err => err)
            console.log(respuesta)
            if (respuesta['ok']) {
                // this.loading = false;
                this.puedojugar = true;
                this.infoEncuentro = respuesta['info']
                swal("Rival encontrado")
            }
        }

    }

    async jugar() {

        let info = {
            idTorneo: this.idTorneo,
            fkfase: this.infoEncuentro.fkFase,
            idEncuentro: this.infoEncuentro.IdEncuentro
        }

        this.router.navigateByUrl(`torneos/torneo/${
            info.idTorneo
        }/fases/${
            info.fkfase
        }/encuentro/${
            info.idEncuentro
        }`)
    }


    async inicio($event) {
        console.log($event)
        await this.api.LugarTorneo(this.idTorneo).then((data : any) => {
            this.numInscripciones = data.info.recordset;
            console.log(data)
        })
        let info = $event.action;
        console.log(this.numInscripciones.length)
        console.log(this.dataTorneo.numJugadores);

        if (info == 'done') {
            this.dataTorneo.inicio = -1;
            this.cargarResultados();
            if (this.dataTorneo.numJugadores > this.numInscripciones.length) {
                swal("Torneo cancelado!", "Se hara la devolución de la inscripción ");
                // this.api.cancelarCampeonato({idCampeonato : this.idCampeonato})
                this.api.cancelarTorneo({idtorneo : this.dataTorneo.idTorneo})
                this.api.Reembolsos({tipo : "Inscripcion Torneo",referencia : this.idTorneo})
                this.router.navigateByUrl("/home")
                // Aqui falta el proceso para regresar el dinero de los inscritos

            } else {
                // this.loadfases();
                swal("Comencemos", "suerte");
            }
        }
    }

    async final($event) {

        // console.log($event)
        let info = $event.action;
        // this.loadfases();
        if ($event.left < 0) {
            await this.loadfases();
            this.cargarResultados();
            swal("Campeonato Finalizado ", "Gracias por participar");
            // this.router.navigateByUrl(`/home`)

        } else if (info == 'done') {
            swal("Campeonato Finalizado ", "Gracias por participar");
            // this.router.navigateByUrl(`/home`)

        }else{
            await this.loadfases();
            this.cargarResultados();

        }
    }


}
