import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from '../pages/pages.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { AuthGuard } from 'src/app/core/_guards/auth/auth.guard';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AgendaComponent } from './agenda/agenda.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PacientesComponent } from './pacientes/pacientes.component';

import { FichaClinicaComponent } from './ficha-clinica/ficha-clinica.component';
import { CrearPacienteComponent } from './pacientes/crear-paciente/crear-paciente.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'inicio',
        component: InicioComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'Inicio' }
      },
      
      {
        path: 'acccount-seting',
        component: AccountSettingsComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'Configuración' }
      },
      {
        path: 'agenda',
        component: AgendaComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'Agenda' }
      },
      {
        path: 'servicio',
        component: ServiciosComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'servicio' }
      },
      {
        path: 'paciente',
        component: PacientesComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'pacientes' }
        
      },
      {
        path: 'addPaciente',
        component: CrearPacienteComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'addPaciente' }
        
      },
      {
        path: 'fichaClinica',
        component: FichaClinicaComponent,
        canActivate: [AuthGuard],
        data: { titulo: 'fichaClinica' }
        
      },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
 
]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}