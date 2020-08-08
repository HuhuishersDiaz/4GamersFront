import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GamersService } from 'src/app/provides/GamersService';
import { SocketsService } from 'src/app/services/sockets.service';
import { NgxLoadingModule ,ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-fasestorneo',
  templateUrl: './fasestorneo.component.html',
  styleUrls: ['./fasestorneo.component.css']
})
export class FasestorneoComponent implements OnInit {

  public loading = false;

public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  idTorneo: any;
  fasesTorneo: any[] = [];
  idPersona: string;
  puedojugar: boolean = false;
  infoInscripcion : any = {};

  infoEncuentro : any = {};
  process : number = 0;
  constructor(private router : Router, 
    private route : ActivatedRoute,
    private api : GamersService,
    private _socket : SocketsService) { 

    this.idPersona = localStorage.getItem("idPersona") || null;
    this.idTorneo = this.route.snapshot.paramMap.get("id");
    
  }

 async  ngOnInit() {
    await this.loadfases(this.idTorneo);
    await this.infoinscripcion()
    await this.CargarResultados().then(data=>{
      console.log(data);
    });

    // console.log(this.idPersona)
    // console.log(this.fasesTorneo);
    console.log(this.infoInscripcion);
    console.log(this.fasesTorneo); 
    console.log(this.process)
  }
  
  async loadfases(idversus){
    await this.api.fasesTorneo(idversus).then(data=>{
      this.fasesTorneo = data['info'].recordset;
    })
  }

  async CargarResultados(){

    await Promise.all(
        this.fasesTorneo.map(async (element,index) => {
        // const contents = await fs.readFile(file, 'utf8')
        // console.log(element,index)
        var bloqueamolasiguiente = false;

        await this.api.EncuentroFase(element.idFase, this.infoInscripcion.idInscripcion).then( (data: any) => {
          if (data.ok) {
            if (data.message.rowsAffected[0] > 0) {
              this.api.resultadosEncuentro(data.message.recordset[0].IdEncuentro).then((info: any) => {
                console.log(info);
              });
              this.fasesTorneo[index].bloqueada = true;
              this.process += 33.33
            }
            else {
              if (bloqueamolasiguiente == true) {
                this.fasesTorneo[index].bloqueada = true;
              }
              else {
                this.fasesTorneo[index].bloqueada = false;
                bloqueamolasiguiente = true;
              }
            }
          }
        });


        console.log("Aqui hacemos el await esperamos a que resuelva ")
      })
    );


    // return new Promise((resolve)=>{
    //   var bloqueamolasiguiente = false;
    //   this.fasesTorneo.forEach(async (element) => {
    //     // console.log(element);

    //     let position = this.fasesTorneo.indexOf(element);
    //     // console.log(element.idFase, this.infoInscripcion.idInscripcion);
    //     await this.api.EncuentroFase(element.idFase, this.infoInscripcion.idInscripcion).then(async (data: any) => {
    //       if (data.ok) {
    //         if (data.message.rowsAffected[0] > 0) {

    //           this.fasesTorneo[position].bloqueada = true;
    //           await this.api.resultadosEncuentro(data.message.recordset[0].IdEncuentro).then((info: any) => {
    //             alert(info);
    //             resolve("");
    //           });
    //           console.log("Aqui ninca llega");

    //         }
    //         else {
    //           if (bloqueamolasiguiente == true) {
    //             this.fasesTorneo[position].bloqueada = true;

    //           }
    //           else {
    //             this.fasesTorneo[position].bloqueada = false;
    //             bloqueamolasiguiente = true;
    //           }

    //         }
    //       }
    //     });

    //   });
    // })
    
  }
  async infoinscripcion(){
    await this.api.inscripcion(this.idPersona , this.idTorneo).then(data => {
      this.infoInscripcion = data[0];
    });
  }

  async BuscarRival(fase : any){
    this.loading = true;
    fase.idpersona = this.idPersona;
    fase.idinscripcion = this.infoInscripcion.idInscripcion;
    let respuesta = await this._socket.EsperarRivalTorneo(fase).then(data=>data).catch(err=>err)
    console.log(respuesta)
    if(respuesta['ok']){
      this.loading = false;
      this.puedojugar = true;
      this.infoEncuentro = respuesta['info']
      alert("Rival encontrado")
    }
  }

  async jugar(){

    let info ={
       idTorneo : this.idTorneo,
       fkfase : this.infoEncuentro.fkFase,
       idEncuentro :  this.infoEncuentro.IdEncuentro
    }

    this.router.navigateByUrl(`torneos/torneo/${info.idTorneo}/fases/${info.fkfase}/encuentro/${info.idEncuentro}`)
  } 


}
