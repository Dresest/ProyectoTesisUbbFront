import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FichaClinicaService {
  base_url = environment.base_url;


  constructor(private http: HttpClient) { }

  getAllDiagnoscito(): Observable<any> {
    return this.http.get(`${this.base_url}/getAllDiagnoscito`);
  }
  agregarFicha(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/registrarFichaClinica`, data);
  }
  actualizarFicha(id_ficha: any, data: any): Observable<any> {
    return this.http.post(`${this.base_url}/editarFichaClinica/${id_ficha}`, data);
  }
  allFicha(rut: any): Observable<any> {
    return this.http.get(`${this.base_url}/getFichaByPaciente/${rut}`);
  }
  fichaByID(id_ficha: any): Observable<any> {
    return this.http.get(`${this.base_url}/getFichaClinicaById/${id_ficha}`);
  }


  
}
