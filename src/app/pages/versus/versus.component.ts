import {Component, OnInit, ViewChild, ElementRef, TemplateRef} from '@angular/core';
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
import { Swiper, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/types/shared';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';



@Component({selector: 'app-versus', templateUrl: './versus.component.html', styleUrls: ['./versus.component.css']})
export class VersusComponent implements OnInit {

    @ViewChild('usefulSwiper',{static: false }) usefulSwiper: SwiperComponent;
    baseUrl : string = 'http://4gamers.xplainerservicios.com/content/juegos/';
    @ViewChild('modalMensaje') modal: ElementRef;
    modalRef: BsModalRef;

    versus = {
        juego: null,
        apuesta: 0,
        user: null
    }
    idpersona :  string;
    juegos : any[];
    allversus : any[];
    tokens : number = 0;
    acumulados : number ;

    public misversus : any[] = [];
    // swal : Sweetalert
    config: SwiperOptions = {
        slidesPerView: 3 ,
        preloadImages : true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    };
    // option : ModalOptions = {
    //     keyboard : false,
    //     // class : "modal-dialog-centered"
    // }
    
    
    constructor(
        private router : Router, 
        private _socket : SocketsService, 
        private global : GlobalService, 
        private api : GamersService, 
        private UI : UIGamersService,
        private modalService: BsModalService
        ) {}

    async ngOnInit() {
        this.idpersona = localStorage.getItem("idPersona") || null;

        await  this.verJuegos();

        if(this.global.isUser()){
            await this.misVersus();
            await this.pendientes()
            await this.acumulado();
            this.misversus = this.misversus.reverse()
            await this.global.cargarTokens(this.idpersona).then(data=>{
                this.tokens = data;
            })
        await  this.getVersus();


        }

        this._socket.onNewVersus().subscribe(data => {
            this.getVersus();
        });
    }

    next(){
        // Now you can use all slider methods like
        this.usefulSwiper.swiper.slideNext();
    }
    prev(){
        // Now you can use all slider methods like
        this.usefulSwiper.swiper.slidePrev();
    }
    async misVersus() {
            await this.api.misVersus(this.idpersona).then((data) => {
                this.misversus = (data['info']['recordset']);
            });
            this.misversus = this.misversus.reverse()
        
    }
    async pendientes() {
            await this.api.Pendientes(this.idpersona).then((data : any) => {
                if(data.info.rowsAffected[0] > 0){
                    swal("Tienes una partida pendiente")
                    this.router.navigateByUrl('/versus/encuentro/'+data['info']['recordset'][0].idversus)
                }
            });
    }

    async acumulado(){
        this.api.acumuladoVersus(this.idpersona).then((data : any)=>{
            console.log(data)
            this.acumulados = data.info.recordset[0].acumulado || 0
            
            this.versus.apuesta = (50 -  data.info.recordset[0].acumulado || 0);    

        }).catch((err)=>{

        }) 
    }
    async verJuegos() {
        (await this.api.getGames()).subscribe((data:any[]) => {
            this.juegos = data;
        });
    }

    async getVersus() {
        (await this.api.getVersus()).subscribe((data) => {
            console.log(data)
            this.allversus = data.info.recordset;
            this.allversus.reverse();
        });

    }

    CantidadApostar(cantidad : number) {

        this.versus.apuesta += cantidad;
        if((50 - this.acumulados) == 0){
            swal("Has alcanzado el limite de juegos por dia " );
            this.versus.apuesta = (50 - this.acumulados);
            return false;
        }
        if (this.versus.apuesta > (50 - this.acumulados)) {
            swal("La cantidad maxima debe ser mayor o igual a "+(50 - this.acumulados)+" tokens" );
            this.versus.apuesta = (50 - this.acumulados)
            return false;
        }else if(this.versus.apuesta < 1){
            swal("La cantidad minima debe ser menor o igual a1 "+(50 - this.acumulados)+" tokens");
            this.versus.apuesta = 1
            return false;
        }
        // alert(this.contador)
    }

    async AceptarVersus(versus) { // //console.log(data);
        console.log(versus);
      

        let infoVersus = {
            idanfitrion: versus.idpersona,
            idPersona: this.idpersona,
            idversus: versus.idversus,
            idjuego: versus.idjuego
        }
        let disponible;
        await this.api.versusDisponible(versus.idversus).then((data) => {
            if (data.ok) {
                disponible = (data.info.recordset[0] || null)
            }
        })
        console.log(disponible);
        if(disponible == null)
        {
            var i = this.allversus.indexOf(versus);
            this.allversus.splice(i, 1);
            swal('Partida no disponible')
            
        }
        else if (disponible.fkRival == null) {
            await this.api.idJuegopersona(this.idpersona, versus.idjuego).then(data => {
                //console.log(data.info.recordset[0]);
                if (data.ok) {
                    if (data.info.rowsAffected[0] == 0) {
                        swal("Para continuar es necesario cargar los ids,  ve a perfil ")
                    } else {
                        if(this.tokens > versus.apuesta )
                        swal("Esperando la respuesta del anfitrion");
                        
                        this._socket.accepVersus(infoVersus).then(data => {
                        }).catch(err => err);

                        this._socket.confirmacionversus()
                        .subscribe(data => {
                            if(data.acepto == true){
                                swal("El anfitrion Acepto la partida");
                                this.api.CancelarTodosVersus({idpersona : this.idpersona}).then(data=>{
                                    console.log(data);
                                        
                                })                                
                                this.router.navigateByUrl('/versus/encuentro/'+data.idversus)

                            }else{
                                swal("El anfitrion rechazo la partida");
                            }
                        });
                    }
                }
            }).catch(err => {
                swal('ocurrio un error intenta mas tarde ');
            });

        } else {

            var i = this.allversus.indexOf(versus);
            this.allversus.splice(i, 1);
            swal('Partida no disponible')
        }

    }

    async CrearVersus() {
        
        if (!this.global.isUser()) {
            swal('Es necesario que te registres');
            return this.router.navigateByUrl('/login')
        }
        if(this.versus.apuesta > this.tokens){
            swal("Es necesario recargar monedas para continuar ");
            return false;
        }
        if(this.versus.apuesta > (50 - this.acumulados)){
            swal("Monto no permitido ");
            return false;
        }
        if (!this.idpersona || !this.versus.juego) {
            swal('Completa todos los campos');
        } else {
            await this.api.idJuegopersona(this.idpersona, this.versus.juego.idJuego).then(data => { // //console.log(data.info.recordset[0]);
                if (data.ok) {
                    if (data.info.rowsAffected[0] == 0) {
                        swal("Para continuar es necesario cargar los ids,  ve a perfil ")
                    } else {
                        this.versus.user = this.global.User();

                        if(this.versus.apuesta > 50 || this.versus.apuesta < 1){
                            swal("El monto permitido en las apuestas comprende de 1 - 50 ")
                        }else{
                            this._socket.createVersus(this.versus)
                            swal("Esperando Rival")
                            this.misVersus()
                        }
                    }
                }
            }).catch(err => {
                swal('ocurrio un error intenta mas tarde ');
            });
        }
    }

    CancelarVersus(item : any){
        console.log(item)

        this.api.CancelarVersus(item).then((data:any)=>{
            console.log(data);
            if(data.message[0] == 1){
                let position = this.misversus.indexOf(item)
                console.log(position)
                this.misversus.splice(position,1);
                swal("Versus cancelado ")
                
            }
        })
    }

    // openModal(template: TemplateRef<any>) {
    //     this.modalRef = this.modalService.show(template,this.option);
    //   }
    // closeModal(template: TemplateRef<any>) {
    //     this.modalRef.hide();
    //   }
  onChange(item : any) {
      this.juegos.find(c=> c.activa = false);
      var posicion = this.juegos.indexOf(item);
      this.juegos[posicion].activa = true;

  }



}
