import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamersService } from 'src/app/provides/GamersService';
import { paquete } from 'src/app/interfaces/interfaces';

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
  constructor(private route : ActivatedRoute,private api : GamersService) { }

  ngAfterViewInit(): void{
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
    var data = await confirm("Valida")
    if(data){
      alert("Gracias por tu compra");
    }else{
      alert("Operacion Cancelada")
    }
    console.log(data);
  }

}
