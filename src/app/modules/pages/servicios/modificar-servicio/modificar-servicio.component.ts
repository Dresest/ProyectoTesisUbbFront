import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/_services/auth.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';
@Component({
  selector: 'app-modificar-servicio',
  templateUrl: './modificar-servicio.component.html',
  styleUrls: ['./modificar-servicio.component.css']
})
export class ModificarServicioComponent implements OnInit {
  servicioFrom: FormGroup = new FormGroup({});
  servicio: any;
  servicioBuscado:any;
  servicios: any[] = [];
  informacionOriginal: any;
  mostrarInformacion = true;
  idServicio:any;
  nombreServicio:any;
  costoServicio:any;
  userInfo: any;
  @Output() cambiosRealizados = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private _servicioService: servicioService,
    private toastService: ToastService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this._authService.obtenerInformacionToken();
    this.obtenerServicios();
    this.servicioFrom = this.formBuilder.group({
      nombre: [''],
      costo: [''],
      
    });
        this.servicioFrom.patchValue({
          nombre: this.nombreServicio,
          costo: this.costoServicio,  
        });
  }


  buscarServicios(): void {
    if (this.servicioBuscado) {
      this._servicioService.obtenerServiciosPorNombre(this.servicioBuscado).subscribe(
        respuesta => {
          if (respuesta.servicio) {
             this.idServicio = respuesta.servicio.id_servicio;
             this.nombreServicio = respuesta.servicio.nombre;
             this.costoServicio = respuesta.servicio.costo;
             this.ngOnInit();
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
     
    }
  }
  
  obtenerServicios(): void {
    this._servicioService.obtenerServiciosPorProfesional(this.userInfo.id).subscribe(respuesta => {
      this.servicios = respuesta.servicios;
    });
  }
  transformarValor(valor: string): number {
    const valorLimpio = valor.replace(',', '.'); // Reemplazar la coma por un punto
    return parseFloat(valorLimpio); // Convertir a número
  }
  


  toggleInformacion(): void {
    if (this.mostrarInformacion) {
      this.informacionOriginal = { ...this.servicio };
    }
    this.mostrarInformacion = !this.mostrarInformacion;
  }

  cancelarEdicion(): void {
    this.servicio = { ...this.informacionOriginal };
    this.servicioFrom.patchValue(this.informacionOriginal);
    this.mostrarInformacion = true;
    this.ngOnInit();
  }

  guardarCambios(): void {
    this.mostrarInformacion = true;
    const datosFormulario = this.servicioFrom.value;
    const hayCambios = JSON.stringify(this.informacionOriginal) !== JSON.stringify(datosFormulario);
    if (hayCambios) {
      this._servicioService.actualizarInformacionServicio( this.idServicio, this.servicioFrom.value).subscribe(
        (response) => {
          this.toastService.showSuccess('La información del servicio se ha actualizado exitosamente');
          this.mostrarInformacion = true;
          this.ngOnInit();
          this.cambiosRealizados.emit();
        }
      );

  }
  
}

}
