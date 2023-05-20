import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FichaClinicaService } from 'src/app/core/_services/ficha-clinica.service';
import { PacienteService } from 'src/app/core/_services/paciente.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-ficha-clinica',
  templateUrl: './ficha-clinica.component.html',
  styleUrls: ['./ficha-clinica.component.css']
})
export class FichaClinicaComponent implements OnInit {
  private subscription!: Subscription;
  fichaClinicaForm: FormGroup = new FormGroup({});
  mostrarInformacion = true;
  informacionOriginal: any;
  fichasClinicas:any;
  fichaSeleccionada:any;
  idPacienteSeleccionado:any;

  constructor(
    private formBuilder: FormBuilder,
    private FichaClinica: FichaClinicaService,
    private toastService: ToastService,
    private pacienteService: PacienteService,) { }

  ngOnInit(): void {;
    this.subscription = this.pacienteService.idPacienteSeleccionado$.subscribe(
      idPacienteSeleccionado => {
        this.idPacienteSeleccionado = idPacienteSeleccionado;
        this.obtenerFichas();
      }
    );
   
    this.fichaClinicaForm = this.formBuilder.group({
      id_paciente: [''],
      id_profesional: [''],
      motivo_consulta: [''],
      examen_fisico: [''],
      intervencion: [''],
      indicaciones: [''],
      id_diagnostico: ['']
    });

    this.informacionOriginal = { ...this.fichaClinicaForm.value };
  }

  obtenerFichas(): void {
    this.FichaClinica.allFicha(this.idPacienteSeleccionado).subscribe(respuesta => {
      this.fichasClinicas = respuesta.fichas;
      console.log(this.fichasClinicas);
    });
  }

  mostrarDetallesFicha(id_ficha: number): void {
    this.FichaClinica.fichaByID(id_ficha).subscribe(respuesta => {
      this.fichaSeleccionada = respuesta.fichaClinica;
    
      this.fichaClinicaForm.patchValue({
        id_paciente: this.fichaSeleccionada.id_paciente,
        id_profesional: this.fichaSeleccionada.id_profesional,
        motivo_consulta: this.fichaSeleccionada.motivo_consulta,
        examen_fisico: this.fichaSeleccionada.examen_fisico,
        intervencion: this.fichaSeleccionada.intervencion,
        indicaciones: this.fichaSeleccionada.indicaciones,
        id_diagnostico: this.fichaSeleccionada.id_diagnostico
      });
      
    });
  }
  


  toggleInformacion(): void {
    if (this.mostrarInformacion) {
      this.informacionOriginal = { ...this.fichaClinicaForm.value };
    }
    this.mostrarInformacion = !this.mostrarInformacion;
  }

  cancelarEdicion(): void {
    this.fichaClinicaForm.patchValue(this.informacionOriginal);
    this.mostrarInformacion = true;
  }


  guardarCambios(): void {
    this.mostrarInformacion = true;

    const datosFormulario = this.fichaClinicaForm.value;
   
    const nuevaFicha={
      id_paciente: datosFormulario.id_paciente,
      id_profesional: datosFormulario.id_profesional,
      motivo_consulta: datosFormulario.motivo_consulta,
      examen_fisico: datosFormulario.examen_fisico,
      intervencion: datosFormulario.intervencion,
      indicaciones: datosFormulario.indicaciones,
      diagnostico: datosFormulario.id_diagnostico,
    }
    
    // const nuevaFicha={
    //   id_paciente:1,
    //   id_profesional: 1,
    //   motivo_consulta: 1,
    //   examen_fisico:1 ,
    //   intervencion: 1,
    //   indicaciones:1 ,
    //   diagnostico: 1,
    // }
  
      this.FichaClinica.actualizarFicha(this.fichaSeleccionada.id_ficha,nuevaFicha).subscribe(respuesta => {
        this.toastService.showSuccess(respuesta.message);
      });
  
    }
}
