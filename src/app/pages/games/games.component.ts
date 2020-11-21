import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SwiperComponent } from 'ngx-useful-swiper';
import { GamersService } from 'src/app/provides/GamersService';
import { GlobalService } from 'src/app/services/global.service';
import { SocketsService } from 'src/app/services/sockets.service';
import { UIGamersService } from 'src/app/services/ui-gamers.service';
import { SwiperOptions } from 'swiper';

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

constructor(private router : Router, private _socket : SocketsService, private global : GlobalService, private api : GamersService, private UI : UIGamersService, private modalService : BsModalService) {}

  async ngOnInit() {
    await this.verJuegos()
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
}
