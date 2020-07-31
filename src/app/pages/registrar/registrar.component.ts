import { Component, OnInit } from '@angular/core';
import { User } from '../../models/usuario';
import { UsuariosService } from '../../provides/usuarios.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { UserInfo } from 'src/app/models/interfaces';

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

  async saveUser(){
    // console.log(this.registro);
    if(this.registro.password != this.registro.confirma ){
      alert('Las contraseñas no coinciden ');
      return false;
    }
    var respuesta = await  this.apiUser.register(this.registro).then(data => data).catch(err=> err);
    console.log(respuesta)
    if(respuesta.ok){
      this.global.saveData(new UserInfo(respuesta.user.idPersona.toString()|| null,respuesta.user.Nombre.toString()|| null,respuesta.user.username.toString()|| null,respuesta.user.Correo.toString()|| null,0))
      this.global.InfoUser();
      alert("Bienvenido :" + this.registro.nombre);
      // localStorage.setItem("idPersona","1255616")
      // localStorage.setItem("Nombre",this.registro.nombre.toString() )
      // localStorage.setItem("username",this.registro.username.toString())
      this.router.navigateByUrl('/home');
    }else{
      alert(respuesta.message);
      // this.registro = new User("","","","","","","",)
      
    }

    
  }
}
