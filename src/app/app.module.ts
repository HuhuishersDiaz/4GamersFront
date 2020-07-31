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

import { FormsModule }   from '@angular/forms';
import { UsuariosService } from './provides/usuarios.service';
import { GamersService } from './provides/GamersService';
import { SocketsService } from './services/sockets.service';
import { GlobalService } from "./services/global.service";
import { UIGamersService } from './services/ui-gamers.service';

import { EncuentroComponent } from './pages/encuentro/encuentro.component';


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
    EncuentroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ 
    UsuariosService,
    SocketsService,
    GlobalService, 
    GamersService ,
    UIGamersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
