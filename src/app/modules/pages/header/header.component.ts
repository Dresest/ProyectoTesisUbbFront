import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/core/_services/auth.service';
import { ProfesionalService } from 'src/app/core/_services/profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  nombreUsuario: string | undefined;
  correo: string | undefined;
  userInfo: any;
  profesional:any;
  constructor(
    private readonly router: Router,
    private _authService: AuthService,
    private toastService: ToastService,
    private _profesionalService: ProfesionalService,
  ) { }

 
  ngOnInit(): void {
    this.nombreUsuar();

    this._authService.cambiosUsuario$.subscribe(() => {
      this.nombreUsuar(); 
    });
  }

    
  onLogout(): void {
    this._authService.logout();
    this.router.navigate(['/login']);
  }
  
  nombreUsuar(): void {
    this.userInfo = this._authService.obtenerInformacionToken();
    this._profesionalService.obtenerProfesionalPorRut(this.userInfo.rut).subscribe(
      (response) => {
        this.profesional = response.profesional;
        this.nombreUsuario = `${this.profesional.nombre} ${this.profesional.apellido}`;
        this.correo = `${this.profesional.email} `;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
