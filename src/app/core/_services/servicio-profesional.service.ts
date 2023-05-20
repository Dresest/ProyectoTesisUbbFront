import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class servicioService {
  base_url=environment.base_url;
  constructor(
      private http: HttpClient, 
      ) { }
      
    obtenerServiciosPorProfesional(id_profesional: number): Observable<any> {
    return this.http.get(`${this.base_url}/profesionales/${id_profesional}/servicios`);
  }
    obtenerServiciosTop(id_profesional: number): Observable<any> {
    return this.http.get(`${this.base_url}/obtenerServiciosMasSolicitados/${id_profesional}`);
  }
  obtenerServiciosNoRelacionadosPorProfesional(id_profesional: number): Observable<any> {
    return this.http.get(`${this.base_url}/obtenerServiciosNoRelacionadosPorProfesional/${id_profesional}`);
  }
  
  obtenerServiciosPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.base_url}/servicio/${nombre}`);
  }

  actualizarInformacionServicio(id: number, data: any) {
    return this.http.post(`${this.base_url}/editarServicio/${id}`, data);
    }
    
  agregarServicio( data: any) {
    return this.http.post(`${this.base_url}/addServicio`, data);
    }

    agregarServicioAProfesional(id_servicio: number, id_profesional: number) {
      const data = {id_profesional: id_profesional, id_servicio: id_servicio };
      return this.http.post(`${this.base_url}/agregarNuevoProfesionalServicio`, data);
    }
    

  eliminarServicioAProfesional( id_servicio: number, id_profesional: number) {
    const data = {id_profesional: id_profesional, id_servicio: id_servicio };
    return this.http.post(`${this.base_url}/eliminarServicioDeProfesional`, data);
    }
    
}
