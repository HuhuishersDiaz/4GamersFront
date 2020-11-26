import { Component, Input, OnInit } from '@angular/core';
import { CampeonatoModel } from 'src/app/interfaces/interfaces';
import swal2 from 'sweetalert2';
import { apiv2Service } from 'src/app/provides/apiv2.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-campeonato',
  templateUrl: './campeonato.component.html',
  styleUrls: ['./campeonato.component.css']
})
export class CampeonatoComponent implements OnInit {

  @Input('campeonato')campeonato : CampeonatoModel ;
  private idPersona : string  = "null" ;

  public urldata = "http://4gamers.xplainerservicios.com/content/torneos/";
  constructor(private apiv2 : apiv2Service) { 
    this.idPersona = localStorage.getItem("idPersona");

  }

  ngOnInit(): void {
  } 
  
  contador(data){
    console.log(data);
  }


  verReglas(reglas : any ){
    swal2.fire({
      title : "Reglas",
      html : reglas,
      confirmButtonColor: "#f91757",   
    });
  }

  entrar( campeonato : CampeonatoModel){
    swal2.fire({
      customClass: {
             container: 'container-class',
             popup: 'popup-class',
             header: 'header-class',
             title: 'title-class',
             closeButton: 'close-button-class',
             icon: 'icon-class',
             image: 'image-class',
             content: 'content-class',
             input: 'input-class',
             actions: 'actions-class',
             confirmButton: 'confirm-button-class',
             denyButton: 'deny-button-class',
             cancelButton: 'cancel-button-class',
             footer: 'footer-class'
           }, 
      // title: '<strong>HTML <u>example</u></strong>',
      icon: 'info',
      html:
        '<b style="font-size : 14px">La cuota de entrada para esté torneo es de:</b><br> ' +
        ' <div style="text-align: center;font-size:30px"> <img src="https://p-4gamers.web.app/assets/tokens.svg" width="30" > '+campeonato.CosEntrada +' </div>' ,
      // showCancelButton : true,
      showDenyButton : true,
      confirmButtonText:'REGLAS DEL TORNEO' ,
      denyButtonText: 'IR AL TORNEO'
      
      
    }).then((res)=> {
      console.log(res)
      if(res.isConfirmed){
        this.verReglas(campeonato.descripcion)
       }else if(res.isDenied){
        this.verInscipcion();
      }
    })
  }



  async verInscipcion(){
    var infoInscripcion = {
      idPersona : this.idPersona,
      idCampeonato : this.campeonato.idCampeonato,
      cosEntrada : this.campeonato.CosEntrada
    }
    var data =  await this.apiv2.inscripcionTorneo(infoInscripcion).then(data => data).catch(err => err);
    if(data.ok){

      swal(data.message,{icon : 'success'});

    }else{

      swal(data.message,{icon : 'info'});

    }

    console.log(data);
   
  }
}
