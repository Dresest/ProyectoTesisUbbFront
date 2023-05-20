import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AgendaService } from 'src/app/core/_services/agenda.service';
import { AuthService } from 'src/app/core/_services/auth.service';
import { ToastService } from 'src/app/core/_services/toast.service';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  inicio: number = 0;
  agendas: any[] = [];
  rutBuscado: string = '';
  userInfo: any;
  numAgendasPorPagina: number = 5;
  paginaActual: number = 1;
  mostrarAnadirAgenda = false;
  mostrarEditarAgenda=false;

  @Output() cambiosRealizados = new EventEmitter();
  
  constructor(
    private agendaService: AgendaService,
     private toastService: ToastService,
     private _authService: AuthService) { }

  ngOnInit(): void {
    this.userInfo = this._authService.obtenerInformacionToken();
    this.obtenerAgendas();

    
  }


  
  

  obtenerAgendas(): void {
    this.agendaService.obtenerAgendasProfesional(this.userInfo.id).subscribe(respuesta => {
      this.agendas = respuesta.agendas;
    });
  }


  buscarAgendas(): void {
    if (this.rutBuscado) {
      this.agendaService.obtenerAgendasPorRut(this.rutBuscado,this.userInfo.id).subscribe(
        respuesta => {
          this.agendas = respuesta.agendas;
         
        },
        error => {
          this.obtenerAgendas();

        }
      );
    } else {
      this.toastService.showError('Ingrese un rut válido');
    }
  }
  
  cambiarPagina(valor: number): void {
    this.inicio += valor;
  }

  obtenerTextoPaginacion(): string {
    const paginaActual = Math.floor(this.inicio / 5) + 1;
    const totalPaginas = Math.ceil(this.agendas.length / 5);
    return `Página ${paginaActual} de ${totalPaginas}`;
  }

  mostrarComponenteAgregarAgenda() {
    this.mostrarAnadirAgenda = true;

  }

  mostrarComponenteEditarAgenda(idAgenda:number) {
    this.agendaService.enviarIdAgenda(idAgenda);
    this.mostrarEditarAgenda = true;
  }

  
  actualizarAgendas(){
    this.mostrarAnadirAgenda = false;
    this.mostrarEditarAgenda = false;
    this.obtenerAgendas();
  }

}
