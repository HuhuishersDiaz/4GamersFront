import {Component, OnInit} from '@angular/core';
import {GlobalService} from 'src/app/services/global.service';
import {Router, NavigationStart} from '@angular/router';
import {GamersService} from 'src/app/provides/GamersService';
import {filter} from 'rxjs/operators';

@Component({selector: 'app-footer', templateUrl: './footer.component.html', styleUrls: ['./footer.component.css']})
export class FooterComponent {
    footer : boolean;

    constructor(private global : GlobalService, private router : Router, private api : GamersService) {
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((data : any) => {

            console.log(data.url);
            if (data.url == "/home" || data.url == "/versus" || data.url == "/tienda" || data.url == "/torneos") {
                this.footer = true;
                console.log(this.footer)
            } else {
                this.footer = false;
                console.log(this.footer)
            }
        });
    }
}
