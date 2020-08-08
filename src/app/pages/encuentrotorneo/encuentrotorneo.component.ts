import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketsService } from 'src/app/services/sockets.service';
import { GlobalService } from 'src/app/services/global.service';
import { GamersService } from 'src/app/provides/GamersService';
import { UIGamersService } from 'src/app/services/ui-gamers.service';
import { infouser } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-encuentrotorneo',
  templateUrl: './encuentrotorneo.component.html',
  styleUrls: ['./encuentrotorneo.component.css']
})
export class EncuentrotorneoComponent implements OnInit {
  @ViewChild('historiamMensajes')private historiamMensajes : ElementRef;


  order : any;
  public mensajes : any[] = [];
  idpersona;
  idversus;
  message : any;
  idjuego;
  mensaje;
  victoria : boolean = false;
  username;
  infoAnfitrion : infouser = {
      idpersona: 0,
      idplataforma: 'prueba',
      username: 'prueba',
      nombre: 'prueba'
  };
  infoRival : infouser = {
      idpersona: 0,
      idplataforma: 'prueba1',
      username: 'prueba1',
      nombre: 'prueba1'
  };
  terminos : boolean = false;
  apuesta: number;

  idtorneo: string;
  idfase: string;
  idencuentro: string;
  idinscripcion: any;

  idinscripcionRival : string;
  constructor(private router : Router, private route : ActivatedRoute, private _socket : SocketsService, private global : GlobalService, private api : GamersService, private UI : UIGamersService) {

      this.idpersona = localStorage.getItem("idPersona");
      this.username = localStorage.getItem("Username") || null;

  }

// Lito
  async ngOnInit() {
      this.idtorneo = this.route.snapshot.paramMap.get("idtorneo");
      this.idfase = this.route.snapshot.paramMap.get("idfase");
      this.idencuentro = this.route.snapshot.paramMap.get("idencuentro");

      await this.validarEncuento(this.idencuentro);
      await this.loadchat(this.idencuentro);

      this._socket.onNewMessageTorneo().subscribe(data => {
          console.log(data);
          this.mensajes.push(data);
          this.historiamMensajes.nativeElement.scrollTop = this.historiamMensajes.nativeElement.scrollHeight;
      });

  }
    ngOnDestroy(): void {
        if (this.infoRival.idpersona == this.idpersona || this.infoAnfitrion.idpersona==this.idpersona) {
            this.enviarMensaje("Se ha conectado")
        } else {
            this.router.navigateByUrl('/torneos')
        }
    }
  //Listo
  async loadchat(idencuentro) {
      await this.api.chatEncuentro(idencuentro).then((data) => {
          this.mensajes = data['info'];
      })

  }
  //Listo
  async validarEncuento (idencuentro){
    this.idpersona = localStorage.getItem("idPersona");

      this.api.validarEncuentro(idencuentro).then(async (data:any)=>{
          console.log(data);
          if (data.ok) {
             let info = data.info;
             
             let idAnfitrion = info.fkInscripcionAnfitrion
             let idRival = info.fkInscripcionRival
            this.idjuego = info.fkJuego;
            this.apuesta = info.numTokens;

              await this.api.idJuegopersonaTorneo(idAnfitrion, this.idjuego).then((data:any) => { // console.log(data.info.recordset[0]);
                    console.log(data);  
                if (data.ok) {
                      this.infoAnfitrion = data.info;
                      if(this.idpersona == this.infoAnfitrion.idpersona){
                          this.idinscripcion = idAnfitrion;
                      }else{
                          this.idinscripcionRival = idAnfitrion
                      }
                  }
              });

             await  this.api.idJuegopersonaTorneo(idRival, this.idjuego).then((data:any) => { // console.log(data.info.recordset[0]);
                console.log(data);  
                  
              if (data.ok) {
                      this.infoRival = data.info;
                      if(this.idpersona == this.infoRival.idpersona){
                          this.idinscripcion = idRival;
                      }else{
                        this.idinscripcionRival = idRival
                    }
                  }
              });

              if (this.infoRival.idpersona == this.idpersona || this.infoAnfitrion.idpersona==this.idpersona) {
                  alert("Bienvenido");
                    this.enviarMensaje("Se ha conectado")
              } else {
                  this.router.navigateByUrl('/torneos')
                  alert('No perteneces a esta partida Evita perder tu cuenta  ');
              }
          }
      })
      .catch(err=>{
          console.log(err);
          this.router.navigateByUrl('/torneos')
      })
  }

  //Listo
  async newMessage() {
      this.enviarMensaje(this.mensaje)
  }

  //Listo
  Reportar(info : boolean) {
      this.victoria = info;

  }

  //Listo
 async enviarMensaje(mensaje) {
      
      const datamensaje = {
          idPersona: this.idinscripcion,
          username: this.username,
          message: mensaje,
          idencuentro: this.idencuentro
      }
      
      this.mensajes.push(datamensaje);

      await this._socket.chatTorneos(datamensaje);
      this.mensaje = '';
      this.historiamMensajes.nativeElement.scrollTop = this.historiamMensajes.nativeElement.scrollHeight;

  }


  async Finalizar() {
      let idRival;
      if (this.idpersona == this.infoAnfitrion.idpersona) {
          idRival = this.infoRival.idpersona;
      } else {
          idRival = this.infoAnfitrion.idpersona;
      }
    //   console.log(this.infoAnfitrion)
    //   console.log(this.infoRival)

      var infoEncuentro = {
        idencuentro: this.idencuentro,
        idinscripcion : this.idinscripcion,
        iswinner: this.victoria,
      }


    //   console.log(this.idinscripcion)
    //   console.log(this.idinscripcionRival)
      if (this.terminos) { // vamos a ver si existe alguna respuesta nuestra anteriormente

        // console.log(infoEncuentro)

          let RespuestaRival = await this.ValidarResultado(infoEncuentro).then(data => data).catch(err => err)
        console.log(RespuestaRival)
        this.api.GuardarResultadoTorneo(infoEncuentro).then( (data : any)  => {
            console.log(data)
        })

        let infoCuenta = {

            fkpersona : this.idpersona,
             monto : this.apuesta, 
             iswinner: this.victoria, 
             mensaje : "Ganador FaseTorneo"
        }

        switch (RespuestaRival['info']) {
            case "Disputa":
                alert("Tu encuentro se fue a disputa")
                break;
            case "Continua":
                if(this.victoria== true){
                    

                    this.api.EstadodeCuenta(infoCuenta).then((data:any) => { 
                        if(data.info.rowsAffected[0]==1){
                            alert("Felicidades has Ganado "+this.apuesta +" Tokens")
                            this.router.navigateByUrl(`/torneos/torneo/${this.idtorneo}/fases`)

                        }else{
                            alert("Intenta nuevamente ");
                        }
                    })

                }else{
                    alert("Gracias por participar ")
                    await this.api.FinalizarInscripcion(infoEncuentro).then(data=> data).catch(err=>err);
                    this.router.navigateByUrl('/torneos')
                }

                break;

            case "Espera":
                if(this.victoria == false){
                    alert("Gracias por participar ")
                    await this.api.FinalizarInscripcion(infoEncuentro).then(data=> data).catch(err=>err);
                    this.router.navigateByUrl('/torneos')
                    
                }else{
                    alert("Esperando la respuesta de tu rival ");
                    let data={
                        idencuentro : this.idencuentro,
                        idinscripcion : this.idinscripcionRival
                    }
                    let Respuesta;
                    await this._socket.EsperarResultadoRival(data).then(data=>{
                        Respuesta = data;
                    })
                    console.log(Respuesta);
                    if(Respuesta.info.isWinner == this.victoria){
                        alert("Tu encuentro se ha ido a Disputa")
                        this.router.navigateByUrl(`/torneos/torneo/${this.idtorneo}/fases`)

                    }else{
                        this.api.EstadodeCuenta(infoCuenta).then((data:any) => { 
                            if(data.info.rowsAffected[0]==1){
                                alert("Felicidades has Ganado "+this.apuesta +" Tokens")
                                this.router.navigateByUrl(`/torneos/torneo/${this.idtorneo}/fases`)

                            }else{
                                alert("Intenta nuevamente ");
                            }
                        })                    }
                }
                    break;
            default:
                alert(RespuestaRival['info'])
                break;
        }

      } else {
          alert("Confirma los terminos y condiciones");

      }
  }

  async ValidarResultado(infoEncuentro) {
    

      return new Promise((resolve) => {
          this.api.respuestarivalTorneo(this.idencuentro,this.idinscripcionRival)
            .then((data:any)=>{
   
              if(data.info.rowsAffected[0] == 1){
                  if(data.info.recordset[0].isWinner == this.victoria){
                    resolve({ ok:true , info : "Disputa" })

                  }else{
                    resolve({ ok:true , info : "Continua" })

                  }
                
              }else if(data.info.rowsAffected[0] == 0){
                resolve({ ok:true , info : "Espera" })
              }else{
                resolve({ ok:false , info : "Intenta  nuevamente" })

              }
            })  
            .catch(err=>{

                resolve({ ok:false , info : "Intenta  nuevamente" })

            });


//           this.api.respuestarival(this.idversus, this.idpersona).then(data => { // //console.log(data);
//               if (data['ok']) { // comprobamos si tenemos una respuesta previa
//                   if (data['info'].rowsAffected[0] == 0) { // sino tenemos respuesta previa entonces subimos el resultado y si damos por perdido el encuentro podemos continuar y descontar
//                       if (this.victoria == false) {

//                           resolve(true);
//                           // si lo que reportamos fue una victoria entonces vamos a consultar el resultado del rival
//                       } else { // si reportamos una victoria entonces tenemos que esperar el resultado del rival
//                           this.api.respuestarival(this.idversus, idRival).then(data => {
//                               // si el rival no ha reportado nada entoces esperamos a que reporte el rival
//                               // console.log(data);
//                               if (data['info'].rowsAffected[0] == 0) { // Entonces guardamos nuestro resultado y esperamos a que responda el usuario
//                                   resolve(false);
//                               } else { // si el rival ya reporto revisamos si no hay una disputa
//                                   let infoRival = data['info'].recordset[0];

//                                   // si el resultado del rival es el mismo entonces Cremos una disputa y debemos de quitarles las monedas a los dos
//                                   if (infoRival.isWinner == this.victoria) {
//                                       resolve("Disputa")
//                                   } else {
//                                       resolve("Ganador");
//                                   }

//                               }

//                           }).catch(err => { // console.log(err)
//                               resolve('Error de servidor')
//                           })
//                       }

//                   } else {
//                       resolve("No puedes modificar tu resultado ")
//                   }
//               }
//           })
      })
  }

}
