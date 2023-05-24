import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/core/_services/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  emailForm: FormGroup;
  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    });
  }

  ngOnInit(): void {
   
  }

  showMessage(message: string, type: string, label: string) {
    this.messageService.add({ severity: type, summary: label, detail: message });
  }
  
  onSubmit(): void {
    this.authService.forgot(this.emailForm.value).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success', 'Aviso!!');
        this.router.navigate(['/login']);
      },
      error: (res) => {
        this.showMessage(res.error.message, 'error', 'Error!!');
      }
    });
  }

}
