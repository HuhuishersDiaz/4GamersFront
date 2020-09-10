import { Component, OnInit } from '@angular/core';
import { GamersService } from 'src/app/provides/GamersService';
import { __await } from 'tslib';
import swal from 'sweetalert';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
export class AmigosComponent implements OnInit {
  idpersona: string;
  usernameAmigo : string = ""; 
  amigos : any[];
  constructor( private api : GamersService) { }
  async ngOnInit() {
    this.idpersona =   localStorage.getItem("idPersona") ;
    await this.listAmigos();
  }

  async listAmigos (){
    this.api.listAmigos(this.idpersona).then((data : any[])=>{
      console.log(data);
      this.amigos = data['amigos'];
    })
  }

  async BuscarAmigo(){
    console.log(this.usernameAmigo)

    if(this.usernameAmigo == "" ){
      swal("Ingresa username",{ icon : "info" })
    }else{
      this.api.buscaramigo(this.usernameAmigo).then((data:any[])=>{
        console.log(data['user'].length)
        if( data['user'].length == 0){
          swal("Usuario no encuentrado",{icon:"info"})
        }else{
          swal("Armando Diaz Diaz","Hola",{icon : "/assets/perfil_icono.svg",buttons : {agregar : {text : "Agregar" , className : "btn btn-danger" ,value : true,closeModal : true}, cancelar :{text : "Eliminar",className : "btn btn-danger",value : true , closeModal : true}}})
          .then(data=>{
            let info = {
              idpersona : this.idpersona
            }
            this.api.agregarAmigo(info)
          })
        }
      })
    }

  }
}
