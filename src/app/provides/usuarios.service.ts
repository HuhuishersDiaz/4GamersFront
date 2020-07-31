import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Login } from '../models/usuario';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class UsuariosService {

  user : User;
   public  url = 'https://back4gamers.herokuapp.com/api/';
  //public  url = 'http://localhost:3000/api/';
  constructor(private http : HttpClient) { }
  


  async register(user : User){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache'
    }); 

    let options = {
      headers: httpHeaders
    };    

    let respuesta = await this.http.post(this.url+"users/newuser",user, options).toPromise().then(data=>data).catch(err=>err);
    console.log(respuesta);

    if(respuesta.ok){
      let usuario  = respuesta.message.recordset[0];
      return {
        ok: true,
        user: usuario
      };
    }else{

      if(respuesta.message.includes('The duplicate key value is')){
        return {
          ok: false,
          message : 'Nombre de usuario no disponible'
        }
      }

      return {
        ok: false,
        message : 'Intente mas tarde'
      };
    }

  }

  async Login(user : Login){
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache'
    }); 

    let options = {
      headers: httpHeaders
    };    

    let data =  await this.http.post(this.url+'users/Login',user, options).toPromise().then(data=>data).catch(err=>err)
      if(data.ok){
        console.log(data);
        let user = data.info.recordset[0]
        console.log(user);
        return {
          ok : true,
          user
        }
      }else{
        return {
          ok :false,
          message : data.message
        }
      }


  }

}
