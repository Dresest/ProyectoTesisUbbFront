import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, catchError, tap } from 'rxjs';
import { LoginForm } from '../_interfaces/loginForm';
import { GenericService } from './generic.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { ToastService } from './toast.service';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  base_url = environment.base_url;
  constructor(
    private http: HttpClient,
    private router: Router,
    private genericServices: GenericService,
    private messageService: MessageService,
    private toastService: ToastService,
  ) { }

  desactivar(id: number) {
    const body = {}; 
  
    return this.http.post(`${this.base_url}/desactivar/${id}`, body);
  }
  
  activar(id: number) {
    const body = {}; 
    return this.http.post(`${this.base_url}/activar/${id}`, body);
  }
  registro(data: any) {
    const body = {}; 
    return this.http.post(`${this.base_url}/registro`, data);
  }
  actualizarInformacionProfesional(id: number, data: any) {
    return this.http.post(`${this.base_url}/profesional/edit/${id}`, data);
  }
  enviarInvitacion( data: any) {
    return this.http.post(`${this.base_url}/enviarInvitacion`, data);
  }

  obtenerProfesionalPorRut(rut: string): Observable<any> {
    return this.http.get(`${this.base_url}/profesional/rut/${rut}`);
  }
  profesionales(): Observable<any> {
    return this.http.get(`${this.base_url}/profesionales`);
  }
  getProfesionalById(idProfesional: string): Observable<any> {
    return this.http.get(`${this.base_url}/getProfesionalById/${idProfesional}`);
  }
  
}  