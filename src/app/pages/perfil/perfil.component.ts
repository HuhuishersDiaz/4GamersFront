import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketsService } from 'src/app/services/sockets.service';
import { UsuariosService } from 'src/app/provides/usuarios.service';
import { GlobalService } from 'src/app/services/global.service';
import { UserInfo } from 'src/app/models/interfaces';
import { GamersService } from 'src/app/provides/GamersService';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(private router: Router, _sockets : SocketsService,private global : GlobalService,private gamers  : GamersService) { 
    
  }
   user : UserInfo = {
     _id : "",
     nombre : "",
     email : "", 
     username : "",
     Tokens : 0
   };
   tokens;
   ngOnInit() {
    if(!this.global.isUser()){
      this.router.navigateByUrl('/login')
      return false;
    }
    this.user = this.global.InfoUser();
    this.cargarTokens();
  }
  async cargarTokens(){
    await this.gamers.getTokens(this.user._id)
    .then((data)=> 
     {
      this.tokens = data.info.recordset[0]["totaltokens"]
     }).catch(err=> err );

  }

  guardarids(){

  }
  // idPersona, fkPlataforma, userid


}
