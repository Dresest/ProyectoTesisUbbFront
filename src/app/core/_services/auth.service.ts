import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginForm } from '../_interfaces/loginForm';
import { GenericService } from './generic.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { ToastService } from './toast.service';
import { ThisReceiver } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  base_url=environment.base_url;
  


  constructor(
    private http: HttpClient, 
    private router:Router, 
    private genericServices: GenericService,
    private messageService:MessageService,
    private toastService: ToastService,
    ) { }
  


  login(data: LoginForm) {
    return this.http.post(`${this.base_url}/login`, data).pipe(
      tap((res: any) => {
          localStorage.setItem('token', res.token)
      })
    );
  }

  isLogged(){
    try{
      let token = localStorage.getItem('token');
      if(token !== undefined && token !== null){
        jwt_decode(token)
        //Si no hubo errores en el decode entonces está logeado
        return true;
      }else{
        return false;
      }
    }catch(err){
      //console.log(err)
      return false;
    }
  }


  logout(message:any = false, messageType:string = "info") {
    localStorage.clear();
    if(typeof(message)==="string" && message.trim() !== ""){
      switch(messageType){
        case "info":
          this.toastService.showInfo(message);
          break;
        case "success":
          this.toastService.showSuccess(message);
          break;
        case "error":
          this.toastService.showError(message);
          break;
        default:
          break;
      }
      
    }    
    this.router.navigate(['/login']);
  }

  forgot(body: any){
    return this.genericServices.postGeneric('/recuperar', '', body)
  }

  nuevaPassword(body: any, token: any){   
    return this.genericServices.postGenericHeader('/nueva-password', '',body,token)
  }


  nuevaContraseña(id: any, newpass: any): Observable<any> {
    const requestBody = { newpass: newpass }; // Crear un objeto con la propiedad "newpass"
  
    return this.http.post(`${this.base_url}/profesional/nuevaPass/${id}`, requestBody);
  }
  
  public obtenerToken(){
    let token = localStorage.getItem('token');
    return token
  }

  obtenerInformacionToken(){

    let token = localStorage.getItem('token');
    if(token === undefined || token === null){
      this.toastService.showError("Ocurrió un problema con la sesión, por favor ingrese nuevamente")
      localStorage.clear();
     
    }else{
      try{
        return jwt_decode(token);
      }catch(err){
        this.toastService.showError("Ocurrió un problema con la sesión, por favor ingrese nuevamente")
        localStorage.clear();
       
      }
    }
  }
}


