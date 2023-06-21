import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfesionalService } from 'src/app/core/_services/profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  profesionalForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private toastService: ToastService,
    private readonly router: Router,
    private _profesionalService: ProfesionalService
  ) {
    this.profesionalForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      contraseña: ['', Validators.required],
      confirmcontraseña: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.profesionalForm.invalid) {
      return;
    }
    this._profesionalService.registro(this.profesionalForm.value).subscribe(
      (res) => {
        this.toastService.showSuccess('Profesional registrado exitosamente');
        
        this.profesionalForm.reset();
    
      },
      (error) => {
        this.toastService.showError('Error al registrar el profesional');
       
      }
    );
  }

  cancelarRegistro(): void {
   
    this.profesionalForm.reset();
  }

  onRutInput(event: any) {
    let rut = event.target.value.replace(/[^\dKk]/g, ''); 
    rut = rut.substring(0, 12); 
    rut = rut.substring(0, rut.length - 1) + '-' + rut.substring(rut.length - 1); 
  
    if (rut.charAt(rut.length - 2).toUpperCase() === 'K') {
      rut = rut.slice(0, -2) + 'K';
    }
  
    rut = rut.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); 
    this.profesionalForm.patchValue({ rut: rut });
  }

  onEdadInput(event: any) {
    let edad = event.target.value.replace(/[^\d]/g, ''); 
    edad = edad.substring(0, 2);
    this.profesionalForm.patchValue({ edad: edad });
  }

  onTelefonoInput(event: any) {
    let telefono = event.target.value.replace(/[^\d]/g, ''); 
    telefono = telefono.substring(0, 9);
    this.profesionalForm.patchValue({ telefono: telefono });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmcontraseña')?.value;
    if (password !== confirmPassword) {
      return { 'contraseñaMismatch': true };
    }
    return null;
  }
}
