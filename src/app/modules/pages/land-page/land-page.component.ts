import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from 'src/app/core/_services/agenda.service';
import { ProfesionalService } from 'src/app/core/_services/profesional.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';
import { ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-land-page',
  templateUrl: './land-page.component.html',
  styleUrls: ['./land-page.component.css']
})
export class LandPageComponent implements OnInit {
  agendaform: FormGroup = new FormGroup({});
  servicioSeleccionado: any;
  profesionalSeleccionado: any;
  idServicio: any;
  idProfesional: any;
  servicios: any[] = [];
  profesionales: any[] = [];

  constructor(
    private toastService: ToastService,
    private _profesionalService: ProfesionalService,
    private formBuilder: FormBuilder,
    private agendaService: AgendaService,
    private _servicioService: servicioService
  ) {}

  ngOnInit(): void {
    this.obtenerProfesionales();
    this.agendaform = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      idProfesional: ['', Validators.required],
      idServicio: ['', Validators.required],
    });
  }

  obtenerServicios(): void {
    this._servicioService
      .obtenerServiciosPorProfesional(this.idProfesional)
      .subscribe((respuesta) => {
        this.servicios = respuesta.servicios;
      });
  }

  obtenerProfesionales(): void {
    this._profesionalService.profesionales().subscribe((respuesta) => {
      this.profesionales = respuesta.profs;
    });
  }

  buscarServicios(): void {
    if (this.servicioSeleccionado) {
      this._servicioService
        .obtenerServiciosPorNombre(this.servicioSeleccionado)
        .subscribe(
          (respuesta) => {
            if (respuesta.servicio) {
              this.idServicio = respuesta.servicio.id_servicio;
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.toastService.showError('Ingrese un nombre válido');
    }
  }

  buscarProfesional(): void {
    if (this.profesionalSeleccionado) {
      console.log(this.profesionalSeleccionado);
      this._profesionalService
        .obtenerProfesionalPorRut(this.profesionalSeleccionado)
        .subscribe(
          (respuesta) => {
            if (respuesta.profesional) {
              this.idProfesional = respuesta.profesional.id_profesional;
              this.obtenerServicios();
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  cancelarEdicion(): void {
    this.ngOnInit();
  }

  camposCompletos(): boolean {
    return (
      this.agendaform.value.nombre &&
      this.agendaform.value.apellido &&
      this.agendaform.value.rut &&
      this.agendaform.value.telefono &&
      this.agendaform.value.email &&
      this.profesionalSeleccionado &&
      this.servicioSeleccionado
    );
  }

  guardarCambios(): void {
    const startYear = 1999;
    const endYear = 2022;

    const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 31) + 1;

    const fecha_agendamiento = `${randomYear}-${randomMonth.toString().padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`;

    const nuevaAgenda = {
      fecha_agendamiento: fecha_agendamiento,
      hora_agendamiento: "18:00",
      nombre: this.agendaform.value.nombre,
      apellido: this.agendaform.value.apellido,
      rut: this.agendaform.value.rut,
      telefono: this.agendaform.value.telefono,
      email: this.agendaform.value.email,
      idProfesional: this.idProfesional,
      idServicio: this.idServicio,
    };

    this.agendaService.agregarAgendaWeb(nuevaAgenda).subscribe(
      (respuesta) => {
        this.toastService.showSuccess(respuesta.message);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onRutInput(event: any) {
    let rut = event.target.value.replace(/[^\dKk]/g, '');
    rut = rut.substring(0, 12);
    rut = rut.substring(0, rut.length - 1) + '-' + rut.substring(rut.length - 1);

    if (rut.charAt(rut.length - 2).toUpperCase() === 'K') {
      rut = rut.slice(0, -2) + 'K';
    }

    rut = rut.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.');
    this.agendaform.patchValue({ rut: rut });
  }

  onTelefonoInput(event: any) {
    let telefono = event.target.value.replace(/[^\d]/g, '');
    telefono = telefono.substring(0, 9);
    this.agendaform.patchValue({ telefono: telefono });
  }
}
