import { Component, OnInit } from '@angular/core';
import { User, Login } from '../../models/usuario';
import { UsuariosService } from '../../provides/usuarios.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { UserInfo } from 'src/app/models/interfaces';

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
  constructor(private apiUser : UsuariosService,private router: Router,private global : GlobalService) {
    this.user = new Login("","");
   }

  ngOnInit(): void {
  }
  async Login(){
    console.log(this.user);
    let respuesta = await this.apiUser.Login(this.user).then(data=>data).catch(err=>err);
    if(respuesta.ok){
      console.log(respuesta);
      this.global.saveData(new UserInfo(respuesta.user.idPersona.toString()|| null,respuesta.user.nombre.toString()|| null,respuesta.user.username.toString()|| null,respuesta.user.correo.toString()|| null,0))
      this.global.InfoUser();respuesta.user.nombre.toString()|| null
      this.router.navigateByUrl('/Home');
    }
   else{
      alert('ocurrio un error intente mas tarde');
   }
  }
}
