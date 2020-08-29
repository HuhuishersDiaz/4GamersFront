import { Component, OnInit } from '@angular/core';
import { GamersService } from 'src/app/provides/GamersService';
import { Router } from '@angular/router';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  TokensTienda : any[] = [];
  config : SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    }
};

  constructor(
    private api :GamersService,
    private router : Router
  ) { }

  async ngOnInit() {
    await this.PaquetesTokens();
  }
  async PaquetesTokens(){
    this.api.paquetesTokensTienda().then((paquetes:any)=>{
      console.log(paquetes.info.recordset);
      this.TokensTienda =  paquetes.info.recordset;
    })
  }

  async Comprar(paquete : any ){
    console.log(paquete)
    this.router.navigateByUrl('/tienda/checkout/'+paquete.idToken)
  }

  async Solicitar( id ){
    this.router.navigateByUrl('/tienda/compra/'+id)
  }


}
