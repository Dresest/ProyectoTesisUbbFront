import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/_services/auth.service';
import { FichaClinicaService } from 'src/app/core/_services/ficha-clinica.service';
import { PacienteService } from 'src/app/core/_services/paciente.service';
import { ProfesionalService } from 'src/app/core/_services/profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';
// import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-ficha-clinica',
  templateUrl: './ficha-clinica.component.html',
  styleUrls: ['./ficha-clinica.component.css']
})
export class FichaClinicaComponent implements OnInit {
  private subscription!: Subscription;
  pacienteForm: FormGroup = new FormGroup({});
  fichaClinicaForm: FormGroup = new FormGroup({});
  diagnosticoFrom: FormGroup = new FormGroup({});
  mostrarInformacion = true;
  mostrarPdf = false;
  agregandoFicha = false;
  informacionOriginal: any;
  fichasClinicas: any;
  fichasClinicasPaginadas: any;
  fichaSeleccionada: any;
  idPacienteSeleccionado: any;
  agregarBtn = true;
  profesional: any;
  profesionalNombre: any;
  paciente: any;
  totalPaginas = 0;
  paginaActual = 1;
  elementosPorPagina = 10;
  element: any;
  diagnosticos: any;
  diagnosticoBuscado: any;
  fechaCreacion:any;
  constructor(
    private formBuilder: FormBuilder,
    private FichaClinica: FichaClinicaService,
    private toastService: ToastService,
    private pacienteService: PacienteService,
    private _authService: AuthService,
    private _profesionalService: ProfesionalService,) { }

  ngOnInit(): void {
   
   
    this.profesional = this._authService.obtenerInformacionToken();

    this.obtenerDiagnosticos();

    this.pacienteForm = this.formBuilder.group({
      alergias: [''],
      nombre: [''],
      apellido: [''],
      direccion: [''],
      email: [''],
      rut: [''],
      telefono: [''],
      edad: [''],
      prevencion: [''],
      is_activo: [''],

    });
    this.subscription = this.pacienteService.idPacienteSeleccionado$.subscribe(
      idPacienteSeleccionado => {
        this.idPacienteSeleccionado = idPacienteSeleccionado;

        this.pacienteService.obtenerPacientePorRut(this.idPacienteSeleccionado).subscribe(respuesta => {
          this.paciente = respuesta.paciente;
          this.pacienteForm.patchValue({
            alergias: this.paciente.alergias,
            nombre: this.paciente.nombre,
            apellido: this.paciente.apellido,
            direccion: this.paciente.direccion,
            email: this.paciente.email,
            rut: this.paciente.rut,
            telefono: this.paciente.telefono,
            edad: this.paciente.edad,
            prevencion: this.paciente.prevencion,
            is_activo: this.paciente.activo,
          });
          this.obtenerFichas();
        });
      }
    );

    this.fichaClinicaForm = this.formBuilder.group({
      id_paciente: ['',],
      id_profesional: ['',],
      motivo_consulta: ['', [Validators.required]],
      examen_fisico: ['', [Validators.required]],
      intervencion: ['', [Validators.required]],
      indicaciones: ['', [Validators.required]],
      id_diagnostico: ['',]
    });



    this.informacionOriginal = { ...this.fichaClinicaForm.value };
  }


  obtenerDiagnosticos(): void {
    this.FichaClinica.getAllDiagnoscito().subscribe(respuesta => {
      this.diagnosticos = respuesta.diagnostico;
    });
  }


  obtenerFichas(): void {
    this.FichaClinica.allFicha(this.idPacienteSeleccionado).subscribe(respuesta => {
      this.fichasClinicas = respuesta.fichas;
      this.totalPaginas = Math.ceil(this.fichasClinicas.length / this.elementosPorPagina);
      this.actualizarFichasClinicasPaginadas();
    });
  }
  buscardiagnosticos(): void {
    if (this.diagnosticoBuscado) {
      console.log(this.diagnosticoBuscado);
    }
  }
  pdf(id_ficha: number): void {
    this.mostrarPdf = true;
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
      this.fechaCreacion=this.fichaSeleccionada.fecha_creacion;
      this._profesionalService.getProfesionalById(this.fichaSeleccionada.id_profesional).subscribe(respuesta => {
        this.profesionalNombre = respuesta.profesional.nombre + " " + respuesta.profesional.apellido;
        
  
        this.element = document.getElementById("fichaClinica");
        
  
        // Configurar opciones de html2pdf
        const options = {
          filename: 'ficha_clinica.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        setTimeout(() => {
          (window as any).html2pdf(this.element, options);
          this.mostrarPdf = false;
        }, 0);
      });
    });
  }
  
  


  mostrarDetallesFicha(id_ficha: number): void {


    this.agregarBtn = false;
    this.mostrarInformacion = true;
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
  diferenciaHoras(fechaCreacion: string): number {
    const fechaCreacionObj = new Date(fechaCreacion);
    const fechaActual = new Date();
  
    const diferenciaHoras = Math.abs(fechaActual.getTime() - fechaCreacionObj.getTime()) / 36e5;
    return diferenciaHoras;
  }
  
  EditarDetallesFicha(id_ficha: number): void {

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
      diagnostico: this.diagnosticoBuscado,
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
