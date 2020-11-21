import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GamersService } from 'src/app/provides/GamersService';
import { GlobalService } from 'src/app/services/global.service';
import { SocketsService } from 'src/app/services/sockets.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-retiro',
  templateUrl: './retiro.component.html',
  styleUrls: ['./retiro.component.css']
})
export class RetiroComponent implements OnInit {
  idpersona: string;
  infoUsuario : any = {
    DNI: "00000000",
  }
  files: FileList;
  username: string;
  constructor(
    private route : Router, private _sockets : SocketsService, private global : GlobalService, private api : GamersService, private formBuilder : FormBuilder) { 
    this.idpersona = localStorage.getItem("idPersona");
    this.username = localStorage.getItem("Username");

  }

  async ngOnInit() {
    await this.infoPersona();
  }
  async Validar(data: NgForm){    
    if(data.valid)
    {
     
      swal("Espera","Cargando información", {
        icon: "/assets/loading.gif",
        buttons : {},
        closeOnEsc : false,
        closeOnClickOutside : false,
      })

      let filename; 
      await this.api.uploadimg(this.files[0]).then((data) => { // console.log(data);
          if (data.OK) {
              filename = data.Name;
          }
      });
      if(filename){
        let infoDireccion = {
          idpersona : this.idpersona,
          imgFrente : filename,
          username : this.username,
          Nombre : data.value.Nombre,
          PrimerApellido : data.value.pApellido,
          SegundoApellido :data.value.sApellido,
          Direccion : data.value.Direccion,
          Provincia : data.value.provincia,
          Estado : data.value.Estado,
          CodPostal : data.value.CodPostal,
          Telefono : data.value.telefono,
          Pais : data.value.pais
        }
        this.api.GuardarDireccion(infoDireccion).then((data:any)=>{
          if(data.ok){
            console.log(data);

            swal("Operacion Exitosa","Estamos validando tu información", {icon: 'success',timer : 1000})
            this.route.navigateByUrl('/')


          }else{

            swal("Es necesario verificar toda la informacion");

          }
        })
      }

    }
    else  
      swal("Es necesario verificar toda la informacion")
      // this.route.navigateByUrl('/boveda/retiro/validar')
  }
  async infoPersona(){
    this.api.infoPersona(this.idpersona).then( (data:any ) =>{
      this.infoUsuario = data.info;
    })
  }
  
  CargarArchivo(event){
    console.log(event.target.files);
    this.files = event.target.files;
  }
}
