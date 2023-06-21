import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './modules/pages/nopagefound/nopagefound.component';
import { NotLoggedInGuard } from './core/_guards/not-logged-in/not-logged-in.guard';
import { LoginComponent } from './modules/pages/login/login.component';
import { PagesComponent } from './modules/pages/pages.component';
import { AuthGuard } from './core/_guards/auth/auth.guard';
import { PagesRoutingModule } from './modules/pages/pages.routing';
import { NuevaPasswordComponent } from './modules/pages/nueva-password/nueva-password.component';
import { RecuperarComponent } from './modules/pages/recuperar/recuperar.component';
import { LandPageComponent } from './modules/pages/land-page/land-page.component';
import { RegistroComponent } from './modules/pages/registro/registro.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NotLoggedInGuard] },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'registro', component: RegistroComponent },
  {path: 'nueva-password/:token', component: NuevaPasswordComponent,data: { titulo: 'Nueva Password' }},
  { path: '**', component: NopagefoundComponent },
  { path: 'centrokine', component: LandPageComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    PagesRoutingModule,],
  exports: [RouterModule]
})
export class AppRoutingModule { }
