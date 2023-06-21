import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/_services/auth.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-agregar-servicio',
  templateUrl: './agregar-servicio.component.html',
  styleUrls: ['./agregar-servicio.component.css']
})
export class AgregarServicioComponent implements OnInit {
  servicioFrom: FormGroup = new FormGroup({});
  servicio: any;
  idServicio:any;
  nombreServicio: string = '';
  costoServicio:any;
  profesional: any;

  @Output() cambiosRealizados = new EventEmitter();
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private _servicioService: servicioService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.profesional = this._authService.obtenerInformacionToken();
    this.servicioFrom = this.formBuilder.group({
      nombre: [''],
      costo: [''],
    });
    
  }

  

  crearRelacion():void{
    this._servicioService.agregarServicioAProfesional(this.idServicio,this.profesional.id)
    .subscribe(respuesta => {
      this.toastService.showSuccess("Se agrego el servicio");
      this.servicioFrom.patchValue({
        nombre: "",
        costo: "",
       
      });
      this.ngOnInit();
      this.cambiosRealizados.emit();
      },
      error => {
        console.log(error);
      }
    );
  }

  buscarServicioPorNombre(): void {
      this._servicioService.obtenerServiciosPorNombre(this.nombreServicio).subscribe(
        respuesta => {

            this.idServicio = respuesta.servicio.id_servicio;
            this.crearRelacion();
        },
        error => {
          console.log(error);
        }
      );

  }


  agregarServicio(): void {
    this._servicioService.agregarServicio(this.servicioFrom.value).subscribe(
      (response) => {
        this.nombreServicio  = this.servicioFrom.controls['nombre'].value;
        this.buscarServicioPorNombre();
      },


      error => {
        console.log(error);
      }
    );
  }
}



