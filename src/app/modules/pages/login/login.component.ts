import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/core/_services/auth.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassUsuario = true;
  user:any;
url:any;
  loginUsuario: UntypedFormGroup;
  
  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/


  constructor(private readonly fb: UntypedFormBuilder,
    private readonly router: Router,
    private _authService: AuthService,
    private messageService: MessageService, private primengConfig: PrimeNGConfig,
    private toastService: ToastService) {

    this.primengConfig.ripple = true;

    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      contraseña: ['', [Validators.required]],
    });


    
    
  }


  onSubmitUsuario(): void {

    localStorage.clear();    
    this._authService.login(this.loginUsuario.value).subscribe({
      next: (res) => {
        console.log(res.message);

        this.router.navigate(['/inicio'])
        this.user = this._authService.obtenerInformacionToken();
        console.log(this.user);
        this.toastService.showSuccess('Bienvenid@ ' + this.user.nombre +' '+this.user.apellido, 'Sesión iniciada');
      },
    });
  }
  
  ngOnInit(): void {
    console.log(this._authService.base_url);
  }

  goToRecoverEmail(): void {
    this.router.navigate(['auth/forgot'])
  }

}
