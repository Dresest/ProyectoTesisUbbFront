import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/_services/auth.service';

import { MyErrorStateMatcher } from 'src/app/core/_utils/password-error-state';
@Component({
  selector: 'app-nueva-password',
  templateUrl: './nueva-password.component.html',
  styleUrls: ['./nueva-password.component.css']
})
export class NuevaPasswordComponent implements OnInit {

  
  matcher = new MyErrorStateMatcher(); 

  token! : string;
  hide = true;
  hideConfirm = true
  passwordForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder, 
    private readonly router: Router, 
    private readonly route: ActivatedRoute,
    private authService : AuthService,
    private messageService: MessageService,
    ) { 


    this.passwordForm = this.fb.group({
     
      password: ['', [Validators.required]],
      password_confirm: ['', [Validators.required ] ],
    


    }, { validator: this.checkPasswords })

    

  }
  isErrorState(control: AbstractControl<any, any> | null, form: FormGroupDirective | NgForm | null): boolean {
    throw new Error('Method not implemented.');
  }

  

  ngOnInit(): void {
    
    this.route.params.subscribe((params: Params) => {
      this.token = params['token'];
      //cargo en local
      
    })

    //consulta validez del token

    

  }

  showMessage(message: string, severity: string, summary: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: message });

  }

  checkPasswords(group: any) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.password_confirm.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit(): void {
    const password = this.passwordForm.get('password')!.value;
    const body = { password: password };
    this.authService.nuevaPassword(body, this.token).subscribe({
      next: (res) => {
        localStorage.clear();
        this.showMessage('La contraseña se ha modificado', 'success', 'Operación éxitosa');
        this.router.navigate(['login']);
      }
    });
  }
  
  
  

}

