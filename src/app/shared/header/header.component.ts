import {Component, OnInit} from '@angular/core';
import {UserInfo} from 'src/app/models/interfaces';
import {GlobalService} from 'src/app/services/global.service';
import {GamersService} from 'src/app/provides/GamersService';
import {Router, NavigationStart} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.css']})

export class HeaderComponent implements OnInit {

    title = 'FrontGamers';
    tokens;
    user : UserInfo;
    isLoggin : Boolean = false;
    constructor(private global : GlobalService, private router : Router,) {
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(data => {
            let user = this.global.isUser();
            console.log(user);
            if (user) {
                this.user = this.global.User();
                this.cargarTokens();
                this.isLoggin = true;
            }else{
                this.isLoggin = false;

            }
        })


    }

    ngOnInit(): void {}

    async cargarTokens() {

        await this.global.cargarTokens(this.user._id).then((data) => {
            this.tokens = data;
            console.log(data)
        }).catch((err) => {
            err
        });


    }

}
