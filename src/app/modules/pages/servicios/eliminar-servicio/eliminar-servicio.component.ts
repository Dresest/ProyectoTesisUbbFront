import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/_services/auth.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-eliminar-servicio',
  templateUrl: './eliminar-servicio.component.html',
  styleUrls: ['./eliminar-servicio.component.css']
})
export class EliminarServicioComponent implements OnInit {
  userInfo: any;
  servicios: any[] = [];
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
    });
  }

  buscarServicioPorNombre(): void {

    this._servicioService.obtenerServiciosPorNombre(this.servicioSeleccionado).subscribe(
      respuesta => {
          this.idServicio = respuesta.servicio.id_servicio;
   
          this.eliminarServicio();
          this.cambiosRealizados.emit();
      },
      error => {
        console.log(error);
      }
    );
  }
  
  eliminarServicio(): void {
    this._servicioService.eliminarServicioAProfesional(this.idServicio,this.userInfo.id).subscribe(
      (response) => {
        this.toastService.showSuccess("Se elimino el servicio");
        this.ngOnInit();
      },
      error => {
        console.log(error);
      }
    );
  }
}


