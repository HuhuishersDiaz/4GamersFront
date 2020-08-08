import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retiro',
  templateUrl: './retiro.component.html',
  styleUrls: ['./retiro.component.css']
})
export class RetiroComponent implements OnInit {

  constructor(
    private route : Router 
  ) { }

  ngOnInit(): void {
  }
  Validar(){    
      this.route.navigateByUrl('/boveda/retiro/validar')
  }
}
