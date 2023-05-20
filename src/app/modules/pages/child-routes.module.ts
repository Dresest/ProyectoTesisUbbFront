import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { AuthGuard } from 'src/app/core/_guards/auth/auth.guard';
import { GraficaPieComponent } from './grafica-pie/grafica-pie.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AgendaComponent } from './agenda/agenda.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { CrearPacienteComponent } from './pacientes/crear-paciente/crear-paciente.component';

const childRoutes: Routes = [
  
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [AuthGuard],
    data: { titulo: 'Inicio' }
  },
  {
    path: 'grafica1',
    component: GraficaPieComponent,
    canActivate: [AuthGuard],
    data: { titulo: 'Grafica1' }
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
    data: { titulo: 'Addpacientes' }
    
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(childRoutes),
  ]
})
export class ChildRoutesModule { }
