import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VersusComponent } from './pages/versus/versus.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { EncuentroComponent } from './pages/encuentro/encuentro.component';
import { TorneosComponent } from './pages/torneos/torneos.component';
import { EncuentrotorneoComponent } from './pages/encuentrotorneo/encuentrotorneo.component';
import { FasestorneoComponent } from './pages/fasestorneo/fasestorneo.component';
import { CampeonatoComponent } from './pages/campeonato/campeonato.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CompraComponent } from './pages/compra/compra.component';
import { RetiroComponent } from './pages/retiro/retiro.component';
import { ValidarretiroComponent } from './pages/validarretiro/validarretiro.component';
import { EncuentroCampeonatoComponent } from './pages/encuentro-campeonato/encuentro-campeonato.component';
import { TycComponent } from './pages/tyc/tyc.component';
import { AvisodeprivacidadComponent } from './pages/avisodeprivacidad/avisodeprivacidad.component';
import { FaqsComponent } from './pages/faqs/faqs.component';

const routes: Routes = [
  {
    path : 'home', component : HomeComponent
  },
  {
    path : 'versus', component : VersusComponent
  },
  {
    path : 'torneos',  component: TorneosComponent,
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
    path : 'torneos/torneo/:id/fases', component : FasestorneoComponent
  },
  {
    path : 'torneos/torneo/:idtorneo/fases/:idfase/encuentro/:idencuentro', component : EncuentrotorneoComponent
  },
  {
    path : 'campeonato/:id', component : CampeonatoComponent
  },
  {
    path : 'campeonato/:idcampeonato/encuentro/:idEncuentro', component : EncuentroCampeonatoComponent
  },
  {
    path : 'tienda/checkout/:id', component : CheckoutComponent
  },
  {
    path : 'tienda/compra/:id', component : CompraComponent
  },
  {
    path : 'terminos-y-condiciones', component : TycComponent
  },
  {
    path : 'preguntas-frecuentes', component : FaqsComponent
  },
  {
    path : 'aviso-de-privacidad', component : AvisodeprivacidadComponent
  },
  {
    path : 'boveda/retirar', component : RetiroComponent
  },
  {
    path : 'boveda/retiro/validar', component : ValidarretiroComponent
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
