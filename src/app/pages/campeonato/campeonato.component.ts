import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campeonato',
  templateUrl: './campeonato.component.html',
  styleUrls: ['./campeonato.component.css']
})
export class CampeonatoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  test($event){
    console.log();
    
  }

  nodes: any = [
    
        {
          //name: 'Thomas Kurian',
          cssClass: 'ngx-org-vp',
          image: 'assets/perfil_icono.svg',
          //title: 'CEO, Google Cloud',
          childs: [
            {
              //name: 'Beau Avril',
              cssClass: 'ngx-org-vp',
              image: 'assets/perfil_icono.svg',
              //title: 'Global Head of Business Operations',
              childs: [{
                //name: 'Ariel Bardin',
                cssClass: 'ngx-org-vp',
                image: 'assets/perfil_icono.svg',
                //title: 'VP, Product Management',
                childs: [{
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                },
                {
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                }]
              },
              {
                //name: 'Ariel Bardin',
                cssClass: 'ngx-org-vp',
                image: 'assets/perfil_icono.svg',
                //title: 'VP, Product Management',
                childs: [{
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                },
                {
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                }]
              }]
            },
            {
              //name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/perfil_icono.svg',
              //title: 'VP, Agency and Brand Solutions',
              childs: [{
                //name: 'Ariel Bardin',
                cssClass: 'ngx-org-vp',
                image: 'assets/perfil_icono.svg',
                //title: 'VP, Product Management',
                childs: [{
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                },
                {
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                }]
              },
              {
                //name: 'Ariel Bardin',
                cssClass: 'ngx-org-vp',
                image: 'assets/perfil_icono.svg',
                //title: 'VP, Product Management',
                childs: [{
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                },
                {
                  // //name: 'Ariel Bardin',
                  cssClass: 'ngx-org-vp',
                  image: 'assets/perfil_icono.svg',
                  // //title: 'VP, Product Management',
                  childs: []
                }]
              }]
            },
            
          ]
        }
  ];
}
