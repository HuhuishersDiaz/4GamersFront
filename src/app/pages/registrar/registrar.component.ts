import { Component, OnInit } from '@angular/core';
import { User } from '../../models/usuario';
import { UsuariosService } from '../../provides/usuarios.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { UserInfo } from 'src/app/models/interfaces';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  registro : User;

  constructor( private apiUser : UsuariosService,private router: Router,private global : GlobalService) { 
    this.registro = new User("","","","","","","","");
  }
  ngOnInit(): void {
  
  }

  async saveUser( data: NgForm ){
    console.log(data.valid);
    console.log(data.value);
    // console.log(this.registro);
    if(this.registro.password != this.registro.confirma ){
      swal('Las contraseñas no coinciden ');
      return false;
    }
      console.log(data.value)
    var respuesta = await  this.apiUser.register(data.value).then(data => data).catch(err=> err);
    console.log(respuesta)
    if(respuesta.ok){
      this.global.saveData(new UserInfo(respuesta.user.idPersona.toString()|| null,respuesta.user.Nombre.toString()|| null,respuesta.user.username.toString()|| null,respuesta.user.Correo.toString()|| null,0))
      this.global.InfoUser();
      swal("Bienvenido ","",{
        icon : "success",
        buttons : {},
        timer : 2000
      });
      // localStorage.setItem("idPersona","1255616")
      // localStorage.setItem("Nombre",this.registro.nombre.toString() )
      // localStorage.setItem("username",this.registro.username.toString())
      this.router.navigateByUrl('/home');
    }else{
      swal(respuesta.message,{icon : "error"});
      // this.registro = new User("","","","","","","",)
      
    }

    
  }
}
