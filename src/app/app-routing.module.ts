import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VersusComponent } from './pages/versus/versus.component';
import { TorneosComponent } from './pages/torneos/torneos.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { EncuentroComponent } from './pages/encuentro/encuentro.component';


const routes: Routes = [
  {
    path : 'home', component : HomeComponent
  },
  {
    path : 'versus', component : VersusComponent
  },
  {
    path : 'torneos', component : TorneosComponent
  },
  {
    path : 'tienda', component : TiendaComponent
  },
  {
    path : 'perfil', component : PerfilComponent ,pathMatch : 'full'
  },
  {
    path : 'registro', component : RegistrarComponent
  },
  {
    path : 'login', component : LoginComponent
  },
  {
    path : 'recuperar', component : RecuperarComponent
  },
  {
    path : 'versus/encuentro/:id', component : EncuentroComponent
  },
  {
    path : '**', pathMatch : 'full' ,redirectTo : 'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
