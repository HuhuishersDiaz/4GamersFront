import {Component, OnInit, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {GamersService} from 'src/app/provides/GamersService';
import {GlobalService} from 'src/app/services/global.service';
import * as alertify from 'alertifyjs';
import {SwiperOptions} from 'swiper';

@Component({selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {


    listTorneos : any[];
    TokensTienda : any[];
    idpersona : string;

    config : SwiperOptions = {
        slidesPerView: 3,
        spaceBetween: 30,
        freeMode: true,
       
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    };


    constructor(private router : Router, private api : GamersService, private global : GlobalService,) {
        this.idpersona = localStorage.getItem("idPersona") || null;

    }

    // @HostListener('window:resize', ['$event'])
    // onResize(event) {
    //     console.log(
    //     event.target.innerWidth);
    //     if(event.target.innerWidth > 978){
    //         this.config.slidesPerView = 4
    //         alert()
    //     }
    // }

    async ngOnInit() {
        this.api.setUserLoggedIn(true);
        await this.verTorneos();
        console.log(this.listTorneos)
        await this.PaquetesTokens();
    }
    async PaquetesTokens() {
        this.api.paquetesTokensTienda().then((paquetes : any) => {
            console.log(paquetes.info.recordset);
            this.TokensTienda = paquetes.info.recordset;
        })
    }


    cobrar() {
        this.router.navigateByUrl('boveda/retirar')

    }

    async verTorneos() {
        await this.api.getTorneos().then((data : any[]) => {
            this.listTorneos = data;
        }).catch(err => err);
        // this.listTorneos = torneos;

    }
    async Entrar(item : any) {
        console.log(item)
        if (!this.idpersona) {
            alert("Es necesario iniciar session ")
            return false;
        }
        let respuesta = await this.api.inscripcion(this.idpersona, item.idTorneo).then(data => data).catch(err => err);
        if (respuesta[0]) { // console.log(respuesta[0])
            this.router.navigateByUrl("/torneos/torneo/" + respuesta[0].fkTorneo + "/fases")
        } else {

            let token = await this.global.tokens;
            let lugar = await this.api.LugarTorneo(item.idTorneo).then(data => data['info'].rowsAffected[0]).catch(err => err)

            let inscripcion = {
                fkTorneo: item.idTorneo,
                fkPersona: this.idpersona,
                Lugar: lugar + 1
            }

            if (token < item.CosEntrada) {
                alertify.error("Tokens insuficientes ");

            } else if (inscripcion.Lugar > item.numJugadores) {

                alertify.error("Lugares no disponibles");

            } else {

                alertify.confirm("La cuota de entrada para este torneo es de " + item.CosEntrada, async () => {
                    let avalible = await this.api.InscripcionTorneo(inscripcion).then(data => data).catch(err => err)
                    if (avalible.message[0] == 1) {

                        var infoEncuentro = {
                            fkpersona: this.idpersona,
                            iswinner: false,
                            monto: item.CosEntrada,
                            mensaje: "Inscripcion Torneo"
                            // fkpersona, monto , iswinner,mensaje
                        }
                        this.api.EstadodeCuenta(infoEncuentro).then(data => {
                            console.log(data)
                            if (data["ok"]) {
                                alertify.success("Bienvenido");
                                this.router.navigateByUrl("/torneos/torneo/" + inscripcion.fkTorneo + "/fases")
                            }
                        })


                    } else {
                        alertify.error("Intenta mas tarde");
                    }


                }, () => {

                    alertify.error("Cancelado");

                })
            }
        }
    }

    async Comprar(paquete : any) {
        console.log(paquete)
        this.router.navigateByUrl('/tienda/checkout/' + paquete.idToken)
    }

    abrirVideo() {
        alertify.YoutubeDialog || alertify.dialog('YoutubeDialog', function () {
            var iframe;
            return {
                // dialog constructor function, this will be called when the user calls alertify.YoutubeDialog(videoId)
                main: function (videoId) { // set the videoId setting and return current instance for chaining.
                    return this.set({'videoId': videoId});
                },
                // we only want to override two options (padding and overflow).
                setup: function () {
                    return {
                        options: { // disable both padding and overflow control.
                            padding: !1,
                            overflow: !1
                        }
                    };
                },
                // This will be called once the DOM is ready and will never be invoked again.
                // Here we create the iframe to embed the video.
                build: function () { // create the iframe element
                    iframe = document.createElement('iframe');
                    iframe.frameBorder = "no";
                    iframe.width = "100%";
                    iframe.height = "100%";
                    // add it to the dialog
                    this.elements.content.appendChild(iframe);

                    // give the dialog initial height (half the screen height).
                    this.elements.body.style.minHeight = screen.height * .5 + 'px';
                },
                // dialog custom settings
                settings: {
                    videoId: undefined
                },
                // listen and respond to changes in dialog settings.
                settingUpdated: function (key, oldValue, newValue) {
                    switch (key) {
                        case 'videoId': iframe.src = "https://www.youtube.com/embed/" + newValue + "?enablejsapi=1";
                            break;
                    }
                },
                // listen to internal dialog events.
                hooks: { // triggered when the dialog is closed, this is seperate from user defined onclose
                    onclose: function () {
                        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    },
                    // triggered when a dialog option gets update.
                    // warning! this will not be triggered for settings updates.
                    onupdate: function (option, oldValue, newValue) {
                        switch (option) {
                            case 'resizable':
                                if (newValue) {
                                    this.elements.content.removeAttribute('style');
                                    iframe && iframe.removeAttribute('style');
                                } else {
                                    this.elements.content.style.minHeight = 'inherit';
                                    iframe && (iframe.style.minHeight = 'inherit');
                                }
                                break;
                        }
                    }
                }
            };
        });
        // show the dialog
        alertify.YoutubeDialog('GODhPuM5cEE').set({frameless: false});

    }
    handleEvent($event) {
        console.log($event);
    }
}
