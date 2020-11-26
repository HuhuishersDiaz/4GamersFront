import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SwiperComponent } from 'ngx-useful-swiper';
import { GamersService } from 'src/app/provides/GamersService';
import { GlobalService } from 'src/app/services/global.service';
import { apiv2Service } from 'src/app/provides/apiv2.service';
import { SocketsService } from 'src/app/services/sockets.service';
import { UIGamersService } from 'src/app/services/ui-gamers.service';
import { SwiperOptions } from 'swiper';
import { CampeonatoModel, torneoModel } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  @ViewChild('usefulSwiper', {static: false})usefulSwiper : SwiperComponent;
  baseUrl : string = 'http://4gamers.xplainerservicios.com/content/juegos/';
  @ViewChild('modAmigos')modal : ElementRef;
  modalRef : BsModalRef;

  juegos: any[];
  lista: any[];

  torneos : torneoModel[];
  campeonatos : CampeonatoModel[];

  idPersona : string = 'null';
  
constructor(private router : Router, 
  private _socket : SocketsService, 
  private global : GlobalService, 
  private api : GamersService, 
  private apiv2 : apiv2Service, 
  private UI : UIGamersService, 
  private modalService : BsModalService) {

    this.idPersona = localStorage.getItem("idPersona");

  }

  async ngOnInit() {
    await this.verJuegos()
    await this.cargarTorneos();
    await this.cargarcampeonatos();
    if(this.idPersona != 'null' ){
      this.misTorneos();
    }
  }

  async verJuegos() {

    await this.api.getGames().then((data : any[]) => {
        this.juegos = data;
    });
    this.lista =  this.juegos ;

  }

  seleccionarjuego(item){
    this.juegos.find(c => c.activa = false);
    var posicion = this.juegos.indexOf(item);
    this.juegos[posicion].activa = true;
    console.log(this.juegos)
    this.lista =  this.juegos ;
  }

  //#region TORNEOS 
  async cargarTorneos(){

   let data = await this.apiv2.TorneosDisponibles().then( data => data ).catch(err=> err)
   this.torneos = data.items;
  }
  

  async misTorneos(){
      
    let data = {
      idPersona : this.idPersona
    }

    let mistorneos  = await this.apiv2.misTorneos(data).then( data => data ).catch(err=> err)
    console.log(mistorneos);

  }

//#region CAMPEONATOS
  async cargarcampeonatos(){

    let data = await this.apiv2.CampeonatosDisponibles().then( data => data ).catch(err=> err)
    this.campeonatos = data.items;
 
   }



}
