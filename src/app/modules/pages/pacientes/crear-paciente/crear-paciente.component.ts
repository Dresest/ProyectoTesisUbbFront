import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/core/_services/paciente.service';
import { ToastService } from 'src/app/core/_services/toast.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent implements OnInit {
  pacienteForm: FormGroup = new FormGroup({});
  showDatePicker: boolean = false;



  constructor(
    private pacienteService: PacienteService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.pacienteForm = this.formBuilder.group({
      alergias: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      rut: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      edad: ['', Validators.required], 
      prevencion: ['', Validators.required],
    });
  }
  
  openDatePicker(): void {
    this.showDatePicker = true;
  }
  onRutInput(event: any) {
    let rut = event.target.value.replace(/[^\dKk]/g, ''); 
    rut = rut.substring(0, 12); 
    rut = rut.substring(0, rut.length - 1) + '-' + rut.substring(rut.length - 1); 
  
    if (rut.charAt(rut.length - 2).toUpperCase() === 'K') {
      rut = rut.slice(0, -2) + 'K';
    }
  
    rut = rut.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); 
    this.pacienteForm.patchValue({ rut: rut });
  }

  
onTelefonoInput(event: any) {
  let telefono = event.target.value.replace(/[^\d]/g, ''); 
  telefono = telefono.substring(0, 9);
  this.pacienteForm.patchValue({ telefono: telefono });
}
  
  
  
  

  cancelarEdicion(): void {
    this.router.navigate(['/paciente']);
  }

  guardarCambios(): void {
    const datosFormulario = this.pacienteForm.value;
  
    if (this.pacienteForm.valid) {
      let campoVacio = false;
      for (const control in this.pacienteForm.controls) {
        if (this.pacienteForm.controls.hasOwnProperty(control)) {
          const valor = this.pacienteForm.controls[control].value;
          if (valor === null || valor === '') {
            campoVacio = true;
            break;
          }
        }
      }
  
      if (campoVacio) {
        this.toastService.showError('Debe completar todos los campos');
      } else {
        const fechaNacimiento = new Date(this.pacienteForm.value.edad); 
        const fechaNacimientoFormateada = fechaNacimiento.toLocaleDateString('en-GB'); 
  
        this.pacienteForm.patchValue({ edad: fechaNacimientoFormateada });
  
        this.pacienteService.registrarPaciente(this.pacienteForm.value).subscribe(
          (response) => {
            this.toastService.showSuccess('Se registró el paciente');
            this.ngOnInit();
            this.router.navigate(['/paciente']);
          }
        );
      }
    }
  }
  
  
  

  
}
