import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GamersService} from 'src/app/provides/GamersService';
import {SocketsService} from 'src/app/services/sockets.service';
import {NgxLoadingModule, ngxLoadingAnimationTypes} from 'ngx-loading';
import {DetalleFase, FaseTorneo, Detalle, Encuentro} from 'src/app/interfaces/interfaces';
import {ignoreElements} from 'rxjs/operators';
import swal from 'sweetalert';
@Component({selector: 'app-fasestorneo', templateUrl: './fasestorneo.component.html', styleUrls: ['./fasestorneo.component.css']})
export class FasestorneoComponent implements OnInit {

    public loading = false;

    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    idTorneo : any;
    fasesTorneo : any[] = [];
    idPersona : string;
    puedojugar : boolean = false;
    infoInscripcion : any = {};
    bloqueamolasiguiente : boolean = false;
    infoEncuentro : Encuentro ;
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
      status: null,
    };
    numInscripciones: any;
    constructor(private router : Router, private route : ActivatedRoute, private api : GamersService, private _socket : SocketsService) {

        this.idPersona = localStorage.getItem("idPersona") || null;
        this.idTorneo = this.route.snapshot.paramMap.get("id");

    }
 
    async ngOnInit() {
        await this.infoinscripcion();
        await this.infoTorneo();
        if (this.infoInscripcion == false) {
            this.router.navigateByUrl("/torneos")
        } else {
            await this.loadfases(this.idTorneo);

            console.log(this.fasesTorneo)
        }
    }

    async infoTorneo(){
      this.api.getTorneo(this.idTorneo).then((data:any)=>{
        console.log(data[0])
        this.dataTorneo = data[0]
      })
    }
    async loadfases(idversus) {
        await this.api.fasesTorneo(idversus).then((data : FaseTorneo[]) => {
            this.fasesTorneo = data['info'].recordset;
        })
    }

    async CargarResultados() {

        await Promise.all(this.fasesTorneo.map(async (element : FaseTorneo, index) => { // console.log(element)
            await this.api.EncuentroFase(element.idFase, this.infoInscripcion.idInscripcion).then(async (data : DetalleFase) => {
                
              // console.log(index);
                // console.log(data);
                // console.log(data)

               let posicion =  this.fasesTorneo.find((item : FaseTorneo)=> item.activa == true );
              if(posicion){
                // alert(posicion);
              }else{ 
                if(data.encuentro.IdEncuentro){
                  // alert("Tenemos un encuentro")
                  this.fasesTorneo[index].activa = true;

                  let mio = data.detalle.find((item:Detalle)=>item.fkInscripcion == this.infoInscripcion.idInscripcion);
                  let otro = data.detalle.find((item:Detalle)=>item.fkInscripcion != this.infoInscripcion.idInscripcion);
                  // console.log(mio);
                  
                  if(mio){
                    if(mio.isWinner == false){
                    
                      await this.api.FinalizarInscripcion({idinscripcion : this.infoInscripcion.idInscripcion}).then(data=> data).catch(err=>err);
                      this.router.navigateByUrl("/torneos")
  
                    }
                    if(otro){
                        if(mio.isWinner == otro.isWinner){
                          this.fasesTorneo[index].status = "Disputa"
                          this.fasesTorneo[index].activa = true;
                        }else{
                          this.fasesTorneo[index].status = "Victoria";
                          this.fasesTorneo[index].activa = false;
                        }

                    }else{
                        this.fasesTorneo[index].status = "Esperando"
                    }

                  }else{
                    this.infoEncuentro = data.encuentro
                    this.jugar();
                  }
                }else{
                  this.fasesTorneo[index].status = "Buscar Rival"
                  this.fasesTorneo[index].activa = true;

                  let posicion =  this.fasesTorneo.find((item : FaseTorneo)=> item.activa == true );
                  console.log(posicion)
                  if(posicion){
                    
                  }else{
                    this.fasesTorneo[index].status = "Buscar Rival"
                    this.fasesTorneo[index].activa = true;
                  }
                  
                  // swal("no tenemos encuentro")
                }
              }
            
            });

        }));
      
    }
    async infoinscripcion() {
        await this.api.inscripcion(this.idPersona, this.idTorneo).then(data => {

            this.infoInscripcion = data[0];
        });
    }

    async BuscarRival(fase : any) {
      if(fase.status == "Disputa"){
        swal("Espera la resolucion de tu disputa")
      }else{
        this.loading = true;
        fase.idpersona = this.idPersona;
        fase.idinscripcion = this.infoInscripcion.idInscripcion;
        let respuesta = await this._socket.EsperarRivalTorneo(fase).then(data => data).catch(err => err)
        // console.log(respuesta)
        if (respuesta['ok']) {
            this.loading = false;
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

        this.router.navigateByUrl(`torneos/torneo/${info.idTorneo}/fases/${info.fkfase}/encuentro/${info.idEncuentro}`)
    }


    async inicio($event){
      console.log($event)
      await this.api.LugarTorneo(this.idTorneo).then((data:any)=>{
        this.numInscripciones =  data.info.recordset;
      })
      let info = $event.action;
      if(info == 'done'){
      this.dataTorneo.inicio = -1;
        alert("Empezemos")
        alert(this.numInscripciones.length)
        alert(this.dataTorneo.numjugadores)
        if(this.dataTorneo.numjugadores > this.numInscripciones.length ){
          swal("Torneo cancelado!","se hara la devolucion de la inscripcion ");
          // this.api.cancelarCampeonato({idCampeonato : this.idCampeonato})
          this.router.navigateByUrl("/home")
          //Aqui falta el proceso para regresar el dinero de los inscritos 
    
        }else {
          this.CargarResultados();
          swal("Comencemos","suerte");
        }
      }
    }
    
    final($event){
      console.log($event)
      let info = $event.action;
      this.CargarResultados();
      if($event.left < 0){
        swal("Campeonato Finalizado ","Gracias por participar");
        // this.router.navigateByUrl(`/home`)
  
      }
      else if(info == 'done'){
          swal("Campeonato Finalizado ","Gracias por participar");
          // this.router.navigateByUrl(`/home`)
  
      }
    }


}
