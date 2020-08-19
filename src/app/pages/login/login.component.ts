import { Component, OnInit } from '@angular/core';
import { User, Login } from '../../models/usuario';
import { UsuariosService } from '../../provides/usuarios.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { UserInfo } from 'src/app/models/interfaces';
import { GamersService } from 'src/app/provides/GamersService';

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
  async Login(){
    console.log(this.user);
    let respuesta = await this.apiUser.Login(this.user).then(data=>data).catch(err=>err);
    if(respuesta.ok){
      console.log(respuesta);
      await this.global.saveData(new UserInfo(respuesta.user.idPersona.toString(),respuesta.user.nombre.toString(),respuesta.user.username.toString(),respuesta.user.correo.toString(),0))
      this.global.InfoUser();respuesta.user.nombre.toString()|| null
      this.Actualizar();
      this.Actualizar();
      this.Actualizar();
      this.router.navigateByUrl('/Home');
      
    }
   else{
      alert('ocurrio un error intente mas tarde');
   }
  }

  Actualizar() {
    this.api.setUserLoggedIn(true);
  }
}
