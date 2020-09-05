import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SocketsService} from 'src/app/services/sockets.service';
import {UsuariosService} from 'src/app/provides/usuarios.service';
import {GlobalService} from 'src/app/services/global.service';
import {UserInfo} from 'src/app/models/interfaces';
import {GamersService} from 'src/app/provides/GamersService';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert';


@Component({selector: 'app-perfil', templateUrl: './perfil.component.html', styleUrls: ['./perfil.component.css']})
export class PerfilComponent implements OnInit {
    uploadForm: FormGroup;  

    idpersona: string;
    user : UserInfo = {
        _id: "",
        nombre: "",
        correo: "",
        username: "",
        Tokens: 0
    };

    ids : any[] = [
        {
            idPersona: 1,
            nombre : 'Playstation',
            fkPlataforma: 202030,
            userid: ""
        }, {
            idPersona: 1,
            nombre : 'Activision',
            fkPlataforma: 202031,
            userid: ""
        }, {
            idPersona: 1,
            nombre : 'EpicGames',
            fkPlataforma: 202032,
            userid: ""
        },
        {
            idPersona: 1,
            nombre : 'Steam',
            fkPlataforma: 202033,
            userid: ""
        },

    ]
    tokens : number = 0;
    imageURL: string = "/assets/boton_editarfotos.png";
    rango : string ;
    ptsRanngo : number  = 0;
    estadisticas : any ={
        ganadas : 0,perdidas : 0,jugadas : 0 ,copas : 0 ,ptsRanngo : 0 ,
    }

    constructor(
        private router : Router, 
        private _sockets : SocketsService,
        private global : GlobalService, 
        private api : GamersService,
        private formBuilder: FormBuilder,
        ) {
            this.idpersona = localStorage.getItem("idPersona") ;
            this.uploadForm = this.formBuilder.group({
                profile: ['']
              });

    }
    
    async ngOnInit() {

        if (!this.global.isUser()) {
            this.router.navigateByUrl('/login')
            return false;
        }

        await  this.cargarids();
        await this.InfoUsuario()
        await this.cargarTokens();
        await this.Estadisticar();

        this.ptsRanngo = this.estadisticas.ptsRanngo[0].ptsRango || 0;

        this.rango = this.global.Rango(this.ptsRanngo);

        
        if(this.user.img != null){
            // alert("Existe la imagen es esta "+this.user.img)
            this.imageURL = "http://4gamers.xplainerservicios.com/content/"+this.user.img;
        }

    }

    async Estadisticar(){
        await this.api.Estadisticas().then((data:any)=>{
            console.log(data)
            this.estadisticas = data;
        })
    }
    async InfoUsuario(){
        await this.api.infoPersona().then((data:any)=>{
            this.user = data.info;
            console.log(data)
        })
    }

    onFileSelect(event) {
        swal("Espera por favor...",{ closeOnEsc : false,closeOnClickOutside : false,buttons : {}  })
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          //console.log(file)
          this.uploadForm.get('profile').setValue(file);

          // File Preview
            const reader = new FileReader();
            reader.onload = () => {
            //console.log(this,this.imageURL);
            }
            reader.readAsDataURL(file)
            
          this.api.uploadimg(file)
          .then((data)=>{
                //console.log(data);
                if(data.OK){
                    let info = {
                        id : this.idpersona,
                        imgname : data.Name
                    }
                    //console.log(info)
                    this.api.imagenperil(info).then((res : any)=>{
                        if(res.info.rowsAffected[0]==1){
                            this.imageURL = reader.result as string;
                            swal("Imagen guardada con exito ",{
                                icon : "success",
                                timer : 1000

                            })
                        }
                    }).catch(err=>{
                        swal("Imagen no pemitida",{
                            icon : "error"
                        } )
                    })
                }
            })
        }
      }

    async cargarids(){

      let data = await this.api.getidsPlataformas(this.idpersona).then(data=>data).catch(err=>err)
      if(data.info.recordset[0] != null){

      }
      //console.log(data.info.recordset)
      data.info.recordset.forEach(async element  => {
         let idsinterno = await this.ids.find(ids => ids.fkPlataforma == element.fkPlataforma);
         let position = await this.ids.indexOf(idsinterno);
         this.ids[position].userid = element.userid;
         this.ids[position].idPersona = element.idPersona;
      });
      //console.log(this.ids);
    }
    async cargarTokens() {
        await this.api.getTokens(this.idpersona).then((data) => {
            this.tokens = data.info.recordset[0]["totaltokens"]
        }).catch(err => err);

    }

   async  guardarids() {
        this.ids.forEach(async element => {
            element.idPersona = this.idpersona;
            await this.api.cargaridsPlataforma(element).then(data=>{
                 //console.log(data);
             })
            //console.log(element);

        });
        // console.log(this.user);
        // let data = {
        //     idPersona : this.idpersona,username : this.user.username
        // }
        // console.log(data);
        // await this.api.EditarUsuario(data).then((data:any)=>{
        //     console.log(data)
        // })
        swal("Operacion exitosa",{ icon:"success" ,buttons : {} ,timer : 1000});

    }
    cerrarsesion(){
        localStorage.removeItem("idPersona");
        localStorage.removeItem("Nombre");
        localStorage.removeItem("Username");
        localStorage.removeItem("Correo");
        this.router.navigateByUrl('/home')
    }


    onSubmit() {
        const formData = new FormData();
        formData.append('file', this.uploadForm.get('profile').value);
        //console.log(formData);
        
        
      }
      mensaje(){
          alert("Hola")
      }
    // idPersona, fkPlataforma, userid


}
