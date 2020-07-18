import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VersusComponent } from './pages/versus/versus.component';
import { TorneosComponent } from './pages/torneos/torneos.component';
import { TiendaComponent } from './pages/tienda/tienda.component';


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
    path : 'perfil', component : TiendaComponent
  },
  {
    path : 'registro', component : TiendaComponent
  },
  {
    path : 'login', component : TiendaComponent
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
