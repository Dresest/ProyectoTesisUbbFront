import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/core/_services/paciente.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent implements OnInit {
  pacienteForm: FormGroup = new FormGroup({});
  constructor(
    private pacienteService: PacienteService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.pacienteForm = this.formBuilder.group({
    
        alergia: ['', Validators.required],
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
  onRutInput(event: any) {
    let rut = event.target.value.replace(/[^\d]/g, ''); 
    rut = rut.substring(0, 12); 
    rut = rut.substring(0, rut.length - 1) + '-' + rut.substring(rut.length - 1); 
    rut = rut.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); 
    this.pacienteForm.patchValue({ rut: rut });
}

onEdadInput(event: any) {
  let edad = event.target.value.replace(/[^\d]/g, ''); 
  edad = edad.substring(0, 2);
  this.pacienteForm.patchValue({ edad: edad });
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
    console.log(datosFormulario);
  
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
        this.pacienteService.registrarPaciente(this.pacienteForm.value).subscribe(
          (response) => {
            this.toastService.showSuccess('se registro el paciente');
            this.ngOnInit();
          }
        );
      }
    }
  }
  

  
}
