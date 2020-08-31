import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  sendEmail(data : NgForm) {
    console.log(data.valid);
    console.log(data.value);
  }
}
