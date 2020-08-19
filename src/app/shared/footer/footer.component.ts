import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }
  menus = [
    {
      path : '',
      imgActive : 'assets/home_dorado.png',
      img : '../../../assets/icono_home.svg',
      active : true
    },
    {
      path : 'versus',
      imgActive : 'assets/versus_dorado.png',
      img : '../../../assets/icono_versus.svg',
      active : false
    },
    {
      path : 'torneos',
      imgActive : 'assets/torneo_dorado.png',
      img : '../../../assets/icono_torneo.svg',
      active : false
    },
    {
      path : 'tienda',
      imgActive : 'assets/tienda_dorado.png',
      img : '../../../assets/icono_tienda.svg',
      active : false
    },
  ]

  ngOnInit(): void {
  }
}
