import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validarretiro',
  templateUrl: './validarretiro.component.html',
  styleUrls: ['./validarretiro.component.css']
})
export class ValidarretiroComponent implements OnInit {

  constructor(
    private route : Router
  ) { }

  ngOnInit(): void {
  }
  Validar(){
    this.route.navigateByUrl('/boveda/retiro/validar')
  }
}
