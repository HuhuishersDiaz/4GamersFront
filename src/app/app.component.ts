import {Component, OnInit} from '@angular/core';
import {GlobalService} from './services/global.service';
import {Router} from '@angular/router';
import {GamersService} from './provides/GamersService';
import {UserInfo} from './models/interfaces';
import { SocketsService } from './services/sockets.service';


@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent {
    
    constructor(private global : GlobalService, private router : Router, private gamers : GamersService,private _socket: SocketsService ) {

        global.InfoUser();
  
    }

    ngOnInit(): void {
        this.global.InfoUser();

    }

    ngOnDestroy(): void {

        alert("Salio del chat")

    }


}
