import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from 'src/app/core/_services/agenda.service';
import { AuthService } from 'src/app/core/_services/auth.service';
import { PacienteService } from 'src/app/core/_services/paciente.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: any[] = [];
  searchText: string = '';
  pacienteFicha: boolean = false;
  mostrarLista: boolean = false;
  pacienteSeleccionado: any;
  pacienteForm: FormGroup = new FormGroup({});
  mostrarInformacion = true;
  informacionOriginal: any;
  activo: string = "";

  constructor(
    private agendaService: AgendaService,
    private pacienteService: PacienteService,
    private _authService: AuthService,
    private _servicioService: servicioService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  obtenerEdad(fechaNacimiento: Date): string {
    const fechaActual = new Date();
  
    const diff = fechaActual.getTime() - fechaNacimiento.getTime();
    const edadEnMilisegundos = Math.abs(diff);
  
    const edad = Math.floor(edadEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25));
  
    return edad.toString();
  }
  
  ngOnInit(): void {
    this.obtenerPacientes();
    this.pacienteForm = this.formBuilder.group({
      alergias: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', Validators.required],
      rut: ['', Validators.required],
      telefono: ['', Validators.required],
      edad: ['', Validators.required],
      prevencion: ['', Validators.required],
      is_activo: ['']
    });
  
    if (this.activo != "") {
      this.pacienteForm.patchValue({
        alergias: this.pacienteSeleccionado.alergias,
        nombre: this.pacienteSeleccionado.nombre,
        apellido: this.pacienteSeleccionado.apellido,
        direccion: this.pacienteSeleccionado.direccion,
        email: this.pacienteSeleccionado.email,
        rut: this.pacienteSeleccionado.rut,
        telefono: this.pacienteSeleccionado.telefono,
        prevencion: this.pacienteSeleccionado.prevencion,
        is_activo: this.activo
      });
  
      const fechaNacimiento = new Date(this.pacienteSeleccionado.edad);
      const edad = this.obtenerEdad(fechaNacimiento);
  
      this.pacienteForm.patchValue({
        edad: fechaNacimiento
      });
    }
  
    this.informacionOriginal = { ...this.pacienteSeleccionado };
  }
  

  obtenerPacientes(): void {
    this.pacienteService.obtenerPacientes().subscribe(respuesta => {
      this.pacientes = respuesta.paciente;
      this.filtrarOpciones(this.searchText);

    });
  }

  filtrarOpciones(texto: string): any[] {
    return this.pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(texto.toLowerCase()));
  }

  seleccionarPaciente(paciente: any): void {
    this.pacienteSeleccionado = paciente;

    this.pacienteFicha = true;
    this.pacienteService.enviarIdPaciente(paciente.rut);
    if (this.pacienteSeleccionado.is_activo == true) {
      this.activo = "Activado";
    } else {
      this.activo = "Desactivado"
    }
    this.searchText = paciente.nombre;
    this.mostrarLista = false;

    this.ngOnInit();

  }

  toggleInformacion(): void {
    if (this.pacienteSeleccionado) {
      if (this.mostrarInformacion) {
        this.informacionOriginal = { ...this.pacienteSeleccionado };
      }
      this.mostrarInformacion = !this.mostrarInformacion;
    }
  }

  cancelarEdicion(): void {
    this.pacienteSeleccionado = { ...this.informacionOriginal };
    this.pacienteForm.patchValue(this.informacionOriginal);
    this.mostrarInformacion = true;
    this.ngOnInit();
  }

  guardarCambios(): void {
    this.mostrarInformacion = true;

    const datosFormulario = this.pacienteForm.value;

    const hayCambios = JSON.stringify(this.informacionOriginal) !== JSON.stringify(datosFormulario);

    if (hayCambios) {
      this.pacienteService.actualizarInformacionPacienteRut(this.pacienteSeleccionado.rut, this.pacienteForm.value).subscribe(
        (response) => {
          this.toastService.showSuccess('La información del paciente se ha actualizado exitosamente');

          this.informacionOriginal = { ...this.pacienteSeleccionado, ...this.pacienteForm.value };

          this.pacienteForm.patchValue(this.informacionOriginal);

          this.mostrarInformacion = true;
        }
      );
    }
  }

  irAgregarPaciente() {
    this.router.navigate(['/addPaciente']);
  }
}
