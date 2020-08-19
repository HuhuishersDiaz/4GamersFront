import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GamersService } from 'src/app/provides/GamersService';
import { Router, ActivatedRoute } from '@angular/router';
import { encCamp } from 'src/app/interfaces/interfaces';
import swal from 'sweetalert';
import { CountdownComponent } from 'ngx-countdown';

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
  numInscripciones = [];

  constructor(private api : GamersService,private router : Router, private route : ActivatedRoute) {
    this.idpersona = localStorage.getItem("idPersona");
    this.username = localStorage.getItem("Username");
   }

  async ngOnInit() {
    this.idCampeonato = this.route.snapshot.paramMap.get("id");
    // alert(this.idCampeonato)
    // this.context = this.myCanvas.nativeElement.getContext('2d');
    await this.api.detallefasecampeonato(this.idCampeonato,"1").then((data : any)=>{
      data.info.forEach(( element,index) => {
        this.fase1[index] = element;
      });
    })


      this.cargarFase(1);
      this.cargarFase(2);
      this.cargarFase(3);
      this.cargarFase(4);

    
    await this.api.getCampeonato(this.idCampeonato).then((data:any)=>{
      this.infoCampeonato =  data[0];
    })

    await this.api.EncuentroActivo(this.idpersona).then((data:any)=>{
      this.encuentro = data.info;
    });

    await this.api.getInscripcionesCampeonato(this.infoCampeonato.idCampeonato).then((data:any)=>{
      this.numInscripciones =  data.recordset;
    })

    console.log(this.fase2)

  }
  
  
  test($event){
    console.log();
    
  }

  cargarFase(num){
    this.api.ganadorfaseCamp(this.idCampeonato,num).then((data:any)=>{
      // console.log(data);
      console.log(data.info.recordsets[0][0])
      this.fase2[num-1] = data.info.recordsets[0][0] || {};
    })
  }
  async jugar(){
    alert("Tienes un encuentro pendiente ")
    console.log(this.encuentro)
    this.router.navigateByUrl(`/campeonato/${this.idCampeonato}/encuentro/${this.encuentro.idEncuentro}`)
  }


  

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
