import {Component, OnInit} from '@angular/core';
import {GlobalService} from './services/global.service';
import {Router} from '@angular/router';
import {GamersService} from './provides/GamersService';
import {UserInfo} from './models/interfaces';


@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent {
    
    constructor(private global : GlobalService, private router : Router, private gamers : GamersService) {

        global.InfoUser();

  
    }


}
