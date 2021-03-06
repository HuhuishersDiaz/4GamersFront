import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { VersusComponent } from './pages/versus/versus.component';
import { HomeComponent } from './pages/home/home.component';
import { TorneosComponent } from './pages/torneos/torneos.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';

import { HttpClientModule } from "@angular/common/http";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from './provides/usuarios.service';
import { GamersService } from './provides/GamersService';
import { SocketsService } from './services/sockets.service';
import { GlobalService } from "./services/global.service";
import { UIGamersService } from './services/ui-gamers.service';

import { EncuentroComponent } from './pages/encuentro/encuentro.component';
import { EncuentrotorneoComponent } from './pages/encuentrotorneo/encuentrotorneo.component';
import { FasestorneoComponent } from './pages/fasestorneo/fasestorneo.component';

import { NgxLoadingModule ,ngxLoadingAnimationTypes } from 'ngx-loading';
import { CampeonatoComponent } from './components/campeonato/campeonato.component';
import { EncuentroCampeonatoComponent } from './pages/encuentro-campeonato/encuentro-campeonato.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CompraComponent } from './pages/compra/compra.component';
import { RetiroComponent } from './pages/retiro/retiro.component';
import { ValidarretiroComponent } from './pages/validarretiro/validarretiro.component';
import { NgxOrgChartModule } from 'ngx-org-chart';

import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { CountdownModule } from 'ngx-countdown';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TycComponent } from './pages/tyc/tyc.component';
import { AvisodeprivacidadComponent } from './pages/avisodeprivacidad/avisodeprivacidad.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { PruebasComponent } from './pages/pruebas/pruebas.component';
import { AmigosComponent } from './pages/amigos/amigos.component';
import { GamesComponent } from './pages/games/games.component';
import { TorneoComponent } from './components/torneo/torneo.component';
import { apiv2Service } from './provides/apiv2.service';
import { CampeonatosComponent } from './pages/campeonatos/campeonatos.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    VersusComponent,
    HomeComponent,
    TorneosComponent,
    TiendaComponent,
    PerfilComponent,
    LoginComponent,
    RegistrarComponent,
    RecuperarComponent,
    EncuentroComponent,
    EncuentrotorneoComponent,
    FasestorneoComponent,
    CampeonatosComponent,
    CampeonatoComponent,
    EncuentroCampeonatoComponent,
    CheckoutComponent,
    CompraComponent,
    RetiroComponent,
    ValidarretiroComponent,
    EncuentroCampeonatoComponent,
    TycComponent,
    AvisodeprivacidadComponent,
    FaqsComponent,
    PruebasComponent,
    AmigosComponent,
    GamesComponent,
    TorneoComponent,
    CampeonatosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    NgxOrgChartModule,
    NgxUsefulSwiperModule,
    CountdownModule,
    ModalModule.forRoot()
  ],
  providers: [ 
    UsuariosService,
    SocketsService,
    GlobalService, 
    GamersService ,
    UIGamersService,
    apiv2Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
