import { Component, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/_services/auth.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';
import { DecimalPipe } from '@angular/common';
import { FormatoCostoPipe } from '../../../core/_pipes/formatoMoneda.pipe';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
  providers: [DecimalPipe, FormatoCostoPipe]
})
export class ServiciosComponent implements OnInit {

  userInfo: any;
  servicios: any[] = [];
  serviciosTop: any[] = [];
  inicio: number = 0;
  ordenNombreAscendente: boolean = true;
  ordenPrecioAscendente: boolean = true;
  numAgendasPorPagina: number = 5;
  numServicioPorPagina: number = 5;
  paginaActual: number = 1;
  numAgendasPorPaginaT: number = 5;
  numServicioPorPaginaT: number = 5;
  paginaActualT: number = 1;

  constructor(
    private _servicioService: servicioService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this._authService.obtenerInformacionToken();
    this.obtenerServicios();
    this.obtenerMasSolicitados();
  }

  obtenerServicios(): void {
    this._servicioService.obtenerServiciosPorProfesional(this.userInfo.id).subscribe(respuesta => {
      this.servicios = respuesta.servicios;
    });
  }
  
  obtenerMasSolicitados(): void {
    this._servicioService.obtenerServiciosTop(this.userInfo.id).subscribe(respuesta =>{
      this.serviciosTop=respuesta.topServices;
    
    });
  }

  obtenerTextoPaginacion(): string {
    const paginaActual = Math.floor(this.inicio / 5) + 1;
    const totalPaginas = Math.ceil(this.servicios.length / 5);
    return `Página ${paginaActual} de ${totalPaginas}`;
  }
  obtenerTextoPaginacionT(): string {
    const paginaActualT = this.paginaActualT;
    const totalPaginasT = Math.ceil(this.serviciosTop.length / this.numServicioPorPaginaT);
    return `PáginaT ${paginaActualT} de ${totalPaginasT}`;
  }
  

  ordenarPorNombre(): void {
    this.servicios.sort((a, b) => {
      if (this.ordenNombreAscendente) {
        return a.nombre.localeCompare(b.nombre);
      } else {
        return b.nombre.localeCompare(a.nombre);
      }
    });
    this.ordenNombreAscendente = !this.ordenNombreAscendente;
  }
  


  ordenarPorPrecio(): void {
    this.servicios.sort((a, b) => {
      if (this.ordenPrecioAscendente) {
        return a.costo - b.costo;
      } else {
        return b.costo - a.costo;
      }
    });
    this.ordenPrecioAscendente = !this.ordenPrecioAscendente;
  }
  
  actualizarServicios(): void {
    this.obtenerServicios();
  }
  
}
