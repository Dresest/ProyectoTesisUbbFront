import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/_services/auth.service';
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
  agregandoFicha = false;
  informacionOriginal: any;
  fichasClinicas: any;
  fichasClinicasPaginadas: any;
  fichaSeleccionada: any;
  idPacienteSeleccionado: any;
  agregarBtn = true;
  profesional: any;
  paciente: any;
  totalPaginas = 0;
  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private formBuilder: FormBuilder,
    private FichaClinica: FichaClinicaService,
    private toastService: ToastService,
    private pacienteService: PacienteService,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.profesional = this._authService.obtenerInformacionToken();
   
    this.subscription = this.pacienteService.idPacienteSeleccionado$.subscribe(
      idPacienteSeleccionado => {
        this.idPacienteSeleccionado = idPacienteSeleccionado;

        this.pacienteService.obtenerPacientePorRut(this.idPacienteSeleccionado).subscribe(respuesta => {
          this.paciente = respuesta.paciente;
          this.obtenerFichas();
        });
      }
    );
   
    this.fichaClinicaForm = this.formBuilder.group({
      id_paciente: ['', ],
      id_profesional: ['', ],
      motivo_consulta: ['', [Validators.required]],
      examen_fisico: ['', [Validators.required]],
      intervencion: ['', [Validators.required]],
      indicaciones: ['', [Validators.required]],
      id_diagnostico: ['', ]
    });

    this.informacionOriginal = { ...this.fichaClinicaForm.value };
  }

  obtenerFichas(): void {
    this.FichaClinica.allFicha(this.idPacienteSeleccionado).subscribe(respuesta => {
      this.fichasClinicas = respuesta.fichas;
      this.totalPaginas = Math.ceil(this.fichasClinicas.length / this.elementosPorPagina);
      this.actualizarFichasClinicasPaginadas();
    });
  }

  mostrarDetallesFicha(id_ficha: number): void {
    this.agregarBtn = false;
    this.mostrarInformacion = false;
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
    this.agregarBtn = true;
  }

  cancelarEdicionF(): void {
    this.fichaClinicaForm.patchValue(this.informacionOriginal);
    this.mostrarInformacion = true;
    this.agregarBtn = true;
    this.agregandoFicha = false;
  }

  mostrarBtn(): void {
    this.agregandoFicha = true;
    this.agregarBtn = false;
    this.mostrarInformacion = false;
  }

  agregarFicha(): void {
    const datosFormulario = this.fichaClinicaForm.value;
    const nuevaFicha = {
      id_paciente: this.paciente.id_paciente,
      id_profesional: this.profesional.id,
      motivo_consulta: datosFormulario.motivo_consulta,
      examen_fisico: datosFormulario.examen_fisico,
      intervencion: datosFormulario.intervencion,
      indicaciones: datosFormulario.indicaciones,
      diagnostico: 1,
    };

    this.FichaClinica.agregarFicha(nuevaFicha).subscribe(respuesta => {
      this.toastService.showSuccess(respuesta.message);
    });

    this.obtenerFichas();
  }

  guardarCambios(): void {
    this.agregarBtn = true;
    this.mostrarInformacion = true;
    const datosFormulario = this.fichaClinicaForm.value;
    const nuevaFicha = {
      id_paciente: datosFormulario.id_paciente,
      id_profesional: datosFormulario.id_profesional,
      motivo_consulta: datosFormulario.motivo_consulta,
      examen_fisico: datosFormulario.examen_fisico,
      intervencion: datosFormulario.intervencion,
      indicaciones: datosFormulario.indicaciones,
      diagnostico: datosFormulario.id_diagnostico,
    };
  
    this.FichaClinica.actualizarFicha(this.fichaSeleccionada.id_ficha, nuevaFicha).subscribe(respuesta => {
      this.toastService.showSuccess(respuesta.message);
    });
  }

  irPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarFichasClinicasPaginadas();
    }
  }

  irPaginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarFichasClinicasPaginadas();
    }
  }

  actualizarFichasClinicasPaginadas(): void {
    const indiceInicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const indiceFin = Math.min(indiceInicio + this.elementosPorPagina, this.fichasClinicas.length);
    this.fichasClinicasPaginadas = this.fichasClinicas.slice(indiceInicio, indiceFin);
  }
}
