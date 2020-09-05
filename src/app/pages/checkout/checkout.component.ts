import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GamersService } from 'src/app/provides/GamersService';
import { paquete } from 'src/app/interfaces/interfaces';
import swal from 'sweetalert';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  idpaquete;
  paquete : paquete ={
    numTokens : 0
  };
  idpersona: string;
  constructor(private route : ActivatedRoute,private api : GamersService ,private router : Router ) { }

  ngAfterViewInit(){
    
    this.idpersona = localStorage.getItem("idPersona") ;

    this.idpaquete = this.route.snapshot.paramMap.get("id");
     this.laodinfo();
  }


  async ngOnInit() {
    
    this.idpaquete = this.route.snapshot.paramMap.get("id");
    await this.laodinfo();
  }
  async laodinfo(){
    await this.api.paqueteTokens(this.idpaquete).then((data:any)=>{
      this.paquete = data.info.recordset[0]
    }).catch(err=>err);
    console.log(this.paquete);    
  }

  async Confirmar(){
    var data = confirm("Valida")
    if(data){
      var infoEncuentro = {
        fkpersona: this.idpersona,
        iswinner: true,
        monto: this.paquete.numTokens,
        mensaje: "Compra Tienda"

      }
        this.api.EstadodeCuenta(infoEncuentro).then((data:any) => { 
          console.log(data);
          if(data.ok){
            swal("Operación exitosa","Gracias por su compra",{icon : 'success',timer : 1000 , buttons : {}});
            this.router.navigateByUrl("/home")
          }
      })
    }else{
      alert("Operacion Cancelada")
    }
    console.log(data);
  }

}
