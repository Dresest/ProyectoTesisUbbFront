import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/_services/auth.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-anadir-servicio',
  templateUrl: './anadir-servicio.component.html',
  styleUrls: ['./anadir-servicio.component.css']
})
export class AnadirServicioComponent implements OnInit {
  userInfo: any;
  servicios: any[] = [];
  serviciosAll: any[] = [];
  servicioSeleccionado:any;
  idServicio:any;
  
  @Output() cambiosRealizados = new EventEmitter();
  constructor(
    private _servicioService: servicioService,
    private _authService: AuthService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this._authService.obtenerInformacionToken();
    this.obtenerServicios();
    
  }
  obtenerServicios(): void {
    this._servicioService.obtenerServiciosPorProfesional(this.userInfo.id).subscribe(respuesta => {
      this.servicios = respuesta.servicios;
      console.log(this.servicios);
      this._servicioService.obtenerTodo().subscribe(respuestaAll => {
        this.serviciosAll = respuestaAll.servicios;
  
        const serviciosFiltrados = this.serviciosAll.filter(servicioAll => {
          return !this.servicios.some(servicio => parseInt(servicio.id_servicio) === parseInt(servicioAll.id_servicio));
        });
  
        this.servicios = serviciosFiltrados;
        console.log(serviciosFiltrados);
  
        if (this.servicios.length > 0) {
          this.servicioSeleccionado = this.servicios[0]; // Obtener el primer elemento de respuesta.servicios
        }
      });
    });
  }
  
  
  buscarServicioPorNombre(): void {

    if (this.servicioSeleccionado && this.servicioSeleccionado.nombre) {
      this._servicioService.obtenerServiciosPorNombre(this.servicioSeleccionado.nombre).subscribe(
        respuesta => {
          this.idServicio = respuesta.servicio.id_servicio;
       console.log(this.idServicio);
          this.agregarServicio();
          this.servicioSeleccionado = null;
          this.cambiosRealizados.emit();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  
  
  agregarServicio(): void {
    this._servicioService.agregarServicioAProfesional(this.idServicio,this.userInfo.id).subscribe(
      (response) => {
        this.toastService.showSuccess("Se agrego el servicio");
       
        this.ngOnInit();
       
      },
      error => {
        console.log(error);
      }
    );
  }

  
}




