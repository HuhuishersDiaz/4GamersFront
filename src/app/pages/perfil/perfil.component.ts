import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SocketsService} from 'src/app/services/sockets.service';
import {UsuariosService} from 'src/app/provides/usuarios.service';
import {GlobalService} from 'src/app/services/global.service';
import {UserInfo} from 'src/app/models/interfaces';
import {GamersService} from 'src/app/provides/GamersService';

@Component({selector: 'app-perfil', templateUrl: './perfil.component.html', styleUrls: ['./perfil.component.css']})
export class PerfilComponent implements OnInit {
    idpersona: string;
    user : UserInfo = {
        _id: "",
        nombre: "",
        email: "",
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

    ]
    tokens : number = 0;
    // router.post('/insertIdsPlataforma', async (req, res, next) => {

    // const {idPersona, fkPlataforma, userid} = req.body;

    constructor(
        private router : Router, 
        private _sockets : SocketsService,
        private global : GlobalService, 
        private api : GamersService,
        ) {
            this.idpersona = localStorage.getItem("idPersona") ;

    }
    

    // async EsperarVersus(){
    // await  this._sockets.pruebaEsperarRival().then(data => {
    //     console.log(data);
    //    })
    // }
    ngOnInit() { // this.EsperarVersus();
        console.log(this.global.isUser());
        console.log("Este resultado llega a perfil ");
        if (!this.global.isUser()) {
            this.router.navigateByUrl('/login')
            return false;
        }
        this.user = this.global.InfoUser();
        this.cargarTokens();

        this.cargarids();


    }
    async cargarids(){

      let data = await this.api.getidsPlataformas(this.idpersona).then(data=>data).catch(err=>err)
      if(data.info.recordset[0] != null){

      }
      console.log(data.info.recordset)
      data.info.recordset.forEach(async element  => {
         let idsinterno = await this.ids.find(ids => ids.fkPlataforma == element.fkPlataforma);
         let position = await this.ids.indexOf(idsinterno);
         this.ids[position].userid = element.userid;
         this.ids[position].idPersona = element.idPersona;
      });
      console.log(this.ids);
    }
    async cargarTokens() {
        await this.api.getTokens(this.user._id).then((data) => {
            this.tokens = data.info.recordset[0]["totaltokens"]
        }).catch(err => err);

    }

    guardarids() {
        this.ids.forEach(async element => {
            element.idPersona = this.idpersona;
            await this.api.cargaridsPlataforma(element).then(data=>{
                 console.log(data);
             })
            console.log(element);

        });

    }
    cerrarsesion(){
        localStorage.removeItem("idPersona");
        localStorage.removeItem("Nombre");
        localStorage.removeItem("Username");
        localStorage.removeItem("Correo");
        this.router.navigateByUrl('/home')
    }
    // idPersona, fkPlataforma, userid


}
