import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GamersService } from 'src/app/provides/GamersService';
import { Router, ActivatedRoute } from '@angular/router';
import { encCamp } from 'src/app/interfaces/interfaces';
import swal from 'sweetalert';
import { CountdownComponent } from 'ngx-countdown';
import { SocketsService } from 'src/app/services/sockets.service';

@Component({
  selector: 'app-campeonato',
  templateUrl: './campeonato.component.html',
  styleUrls: ['./campeonato.component.css']
})
export class CampeonatoComponent implements OnInit {
  
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  baseUrl : string = "http://4gamers.xplainerservicios.com/content/";
  fase1 : encCamp[] = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
  fase2 : encCamp[] = [{},{},{},{},{},{},{},{}];
  fase3 : encCamp[] = [{},{},{},{}];
  fase4 : encCamp[] = [{},{}];
  fase5 : encCamp[] = [{}];
  idpersona: string;
  username: string;
  idCampeonato : string ;
  podemosjugar : boolean = true;
  encuentro : any ;
  infoCampeonato : any ={
    cosEntrada: 0,
    fechaCreacion: "",
    fechaFin: "",
    fechaInicio: "",
    finaliza: 0,
    fkJuego: 0,
    idCampeonato: 0,
    imgLogo: "",
    imgPrecentacion: "",
    iniciaen: 0,
    monPremio: 0,
    numjugadores: 0,
  };
  infoGanador : any = {
    idEncuentro : 0, 
    fkCampeonato : 0 , 
    username : '', 
    img : null ,
    idPersona : 0 
  }
  numInscripciones = [];
  loading: boolean;
  puedojugar: boolean;
  infoEncuentro: any;
  faseActiva: number = 3;

  constructor(private api : GamersService,private router : Router, private route : ActivatedRoute,private _sockets : SocketsService) {
    this.idpersona = localStorage.getItem("idPersona");
    this.username = localStorage.getItem("Username");
   }

  async ngOnInit() {
    this.idCampeonato = this.route.snapshot.paramMap.get("id");

    await this.api.ganadorcampeonato(this.idCampeonato).then((data : any)=>{
      console.log(data)
      this.infoGanador =  data.info[0] || this.infoGanador;
      if(this.infoGanador.idPersona == this.idpersona){
        swal("Felicidades","Eres el numero 1 ");

      }
     
    })
    
    await this.api.getCampeonato(this.idCampeonato).then((data:any)=>{
      this.infoCampeonato =  data[0];
     
    })

    // if(this.infoCampeonato.numjugadores == 8){
    //   this.faseActiva = 3;
    //   await  this.torneo8participantes()
      
    //  }else if(this.infoCampeonato.numjugadores == 16){
    //   this.faseActiva = 4;
    //    await this.torneo16participantes()
    //  }else{
      await this.torneo32participantes();
    //   this.faseActiva = 5;
    //  }

    await this.api.EncuentroActivo(this.idpersona).then((data:any)=>{
      this.encuentro = data.info;
    });

    await this.api.getInscripcionesCampeonato(this.infoCampeonato.idCampeonato).then((data:any)=>{
      this.numInscripciones =  data.recordset;
      console.log(data.recordset)
    })

    console.log(this.fase2)

  }


  async torneo32participantes(){
    await this.api.detallefasecampeonato(this.idCampeonato,"5").then((data : any)=>{
      data.info.forEach(( element,index) => {
        this.fase5[index] = element;
      });
    })
    await this.api.detallefasecampeonato(this.idCampeonato,"4").then((data : any)=>{
      data.info.forEach(( element,index) => {
        this.fase4[index] = element;
      });
    })
    await this.api.detallefasecampeonato(this.idCampeonato,"3").then((data : any)=>{
      data.info.forEach(( element,index) => {
        this.fase3[index] = element;
      });
    })
    await this.api.detallefasecampeonato(this.idCampeonato,"2").then((data : any)=>{
      data.info.forEach(( element,index) => {
        this.fase2[index] = element;
      });
    })
    await this.api.detallefasecampeonato(this.idCampeonato,"1").then((data : any)=>{
      data.info.forEach(( element,index) => {
        this.fase1[index] = element;
      });
    })
  }

 
  async BuscarRival() {
    swal("Buscarndo Rival")
    let  numEncuentro : number = null;
    let  soy : string = null ;
    let  Buscar : string = null ;
    let  Rival : number = null ;
    await this.api.faseactivacampeonato(this.idCampeonato,this.idpersona).then((data:any)=>{
      console.log(data)
      if(data.fkfase){
        this.faseActiva = (data.fkfase - 1);
        numEncuentro = data.numencuentro;
        if((numEncuentro % 2) == 0 ){
          soy = "fkAnfitrion";
          Buscar = "fkRival";
          Rival = (numEncuentro + 1)
          numEncuentro = (numEncuentro);
        }else{
          soy = "fkRival";
          Buscar = "fkAnfitrion";
          Rival = (numEncuentro - 1)
          numEncuentro = (numEncuentro - 1);

        }
      }      
    })
    let fase = {
      idFase : this.faseActiva,
      idpersona : this.idpersona ,
      idcampeonato : this.idCampeonato,
      numEncuentro,
      Buscar,
      Rival,
      soy,
      
    }
    console.log(fase)
    // return false;

    this.loading = true;
    let respuesta = await this._sockets.EsperarRivalCampeonato(fase).then(data => data).catch(err => err)
    console.log(respuesta)
    if (respuesta['ok']) {
      this.torneo32participantes()
        this.loading = false;
        this.puedojugar = true;
        this.encuentro = respuesta['info']

        swal("Rival encontrado")
    }else{
      swal("Rival no Disponible")

    }
  } 

  cargarFase(num){
    this.api.ganadorfaseCamp(this.idCampeonato,num).then((data:any)=>{
      console.log(data.info.recordsets[0][0])
      this.fase2[num-1] = data.info.recordsets[0][0] || {};
    })
  }

  async jugar(){
    alert("Tienes un encuentro pendiente ")  
    console.log(this.encuentro)
    this.router.navigateByUrl(`/campeonato/${this.idCampeonato}/encuentro/${this.encuentro.idEncuentro}`)
  }

  async abrirEncuentro(encuentro : any){
    
  }
  
  //Apartado de timer para abrir o cerrar el campeonato 

  async inicio($event){
    await this.api.getInscripcionesCampeonato(this.infoCampeonato.idCampeonato).then((data:any)=>{
      this.numInscripciones =  data.recordset;
    })
    let info = $event.action;
    if($event.left > 0){
      this.podemosjugar = false;
    }
    else if(info == 'done'){
    this.infoCampeonato.iniciaen = -1;
      
      if(this.infoCampeonato.numjugadores > this.numInscripciones.length ){
        swal("Campeonato cancelado!","se hara la devolucion de la inscripcion ");
        this.api.cancelarCampeonato({idCampeonato : this.idCampeonato})
        this.router.navigateByUrl("/home")
        //Aqui falta el proceso para regresar el dinero de los inscritos 
  
      }else if(this.infoCampeonato.numjugadores === this.numInscripciones.length){
        this.podemosjugar = true;
        swal("Comencemos","suerte");
      }
    }
  }
  
  final($event){

    this.numInscripciones.forEach(element => {
      console.log(element)
    });

    console.log($event)
    let info = $event.action;
    if($event.left < 0){
      swal("Campeonato Finalizado ","Gracias por participar");
      this.router.navigateByUrl(`/home`)

    }
    else if(info == 'done'){
        swal("Campeonato Finalizado ","Gracias por participar");
        this.router.navigateByUrl(`/home`)

    }
  }





}
