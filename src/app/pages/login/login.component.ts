import { Component, OnInit } from '@angular/core';
import { User, Login } from '../../models/usuario';
import { UsuariosService } from '../../provides/usuarios.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { UserInfo } from 'src/app/models/interfaces';
import { GamersService } from 'src/app/provides/GamersService';
import {NgForm} from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[
    
  ]
})
export class LoginComponent implements OnInit {
  LoginForm;
  public user : Login;
  constructor(private apiUser : UsuariosService,private router: Router,private global : GlobalService,private api : GamersService ) {
    this.user = new Login("","");
   }

  async ngOnInit() {
  }
  async Login(data: NgForm){

    let respuesta = await this.apiUser.Login(data.value).then(data=>data).catch(err=>err);
    if(respuesta.ok){

      await this.global.saveData(new UserInfo(respuesta.user.idPersona.toString(),respuesta.user.nombre.toString(),respuesta.user.username.toString(),respuesta.user.correo.toString(),0))
      this.global.InfoUser();
      respuesta.user.nombre.toString() || null
     
      this.router.navigateByUrl('/Home');
      this.Actualizar();
      this.Actualizar();
      this.Actualizar();
    }
   else{
      swal('Correo o usuario no encuentrado','Por favor registrate');
   }
  }

  Actualizar() {
    this.api.setUserLoggedIn(true);
  }
}
