
import { Injectable } from '@angular/core';
import { User  } from "../models/usuario";
import { UserInfo } from "../models/interfaces";
import { SocketsService } from './sockets.service';
import { GamersService } from '../provides/GamersService';

@Injectable()

export class GlobalService {

  tokens : number = 0;
  constructor( private _socket : SocketsService,private gamers : GamersService) { 
      var idpersona =  localStorage.getItem("idPersona") ;
      if(idpersona != null){
        this.cargarTokens(idpersona)
      }
  }

  async saveData(userinfo:UserInfo){

    localStorage.setItem("idPersona",userinfo._id.toString());
    localStorage.setItem("Nombre",userinfo.nombre.toString());
    localStorage.setItem("Username",userinfo.username.toString());
    localStorage.setItem("Correo",userinfo.correo.toString());
  }

 public isUser() {
  
    var idpersona =  localStorage.getItem("idPersona");
    // console.log(idpersona);
    if(idpersona == null){
      // console.log("La consulta es falsa ");

      return false;
    }
    return true;

  }
  public InfoUser(){
    var idpersona =  localStorage.getItem("idPersona");
    var Nombre =  localStorage.getItem("Nombre") ;
    var Username =  localStorage.getItem("Username") ;
    var Email =  localStorage.getItem("Correo") ;
    var user = new UserInfo(idpersona,Nombre,Username,Email,this.tokens)
    this._socket.SendUserInfo(user);
    return user;
  }
   public  User(){
    var idpersona =  localStorage.getItem("idPersona") ;
    var Nombre =  localStorage.getItem("Nombre") ;
    var Username =  localStorage.getItem("Username") ;
    var Email =  localStorage.getItem("Correo") ;
    var user = new UserInfo(idpersona,Nombre,Username,Email,this.tokens)
    return user;
  }
  async cargarTokens(_id) {
    
    return  await this.gamers.getTokens(_id).then((data) => {
          this.tokens = data.info.recordset[0]["totaltokens"];
          return data.info.recordset[0]["totaltokens"];
      }).catch(err => err);

    }
    
    Rango(ptsRanngo: number): string {
      if(ptsRanngo >= 0 && ptsRanngo < 100 ){
        return "MILICIA"
    }else  if(ptsRanngo > 101 && ptsRanngo < 400 ){
      return "LEGIONARIO";
    } else if(ptsRanngo > 401 && ptsRanngo < 900 ){
      return "CENTURIÓN";
    }else if(ptsRanngo > 900){
      return "ESPARTANO";
    }    
  }

  





}
