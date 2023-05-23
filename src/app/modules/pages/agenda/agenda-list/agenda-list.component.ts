import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AgendaService } from 'src/app/core/_services/agenda.service';
import { AuthService } from 'src/app/core/_services/auth.service';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.css']
})
export class AgendaListComponent implements OnInit {
  agendas: any[] = [];
  ordenAscendente: boolean = true;
  ordenAscendenteP: boolean = true;
  ordenAscendenteR: boolean = true;
  ordenAscendenteF: boolean = true;
  ordenAscendenteH: boolean = true;
  ordenAscendenteS: boolean = true;
  inicio: number = 0;
  userInfo: any;
  mostrarEditarAgenda = false;
  @Output() cambiosRealizados = new EventEmitter();

  constructor(
    private agendaService: AgendaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.obtenerInformacionToken();
    this.obtenerAgendas();
  }

  obtenerAgendas(): void {
    this.agendaService
      .obtenerAgendasProfesional(this.userInfo.id)
      .subscribe((respuesta) => {
        this.agendas = respuesta.agendas;
  
        const fechaHoy = new Date();
        fechaHoy.setHours(0, 0, 0, 0); 
        
        this.agendas = this.agendas.filter(
          (agenda) => new Date(agenda.fecha_agendamiento) >= fechaHoy
        );
  
        this.agendas.sort((a, b) => {
          const horaA = new Date(a.hora_agendamiento).getTime();
          const horaB = new Date(b.hora_agendamiento).getTime();
  
          if (horaA < horaB) {
            return -1;
          } else if (horaA > horaB) {
            return 1;
          } else {
            return 0;
          }
        });
      });
  }
  

  mostrarComponenteEditarAgenda(idAgenda: number) {
    this.agendaService.enviarIdAgenda(idAgenda);
    this.mostrarEditarAgenda = true;
  }

  ordenarPorEstado(): void {
    this.agendas.sort((a, b) => {
      const estadoA = a.estado.status.toLowerCase();
      const estadoB = b.estado.status.toLowerCase();
      if (estadoA < estadoB) {
        return this.ordenAscendente ? -1 : 1;
      }
      if (estadoA > estadoB) {
        return this.ordenAscendente ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendente = !this.ordenAscendente;
  }
  
  

  ordenarPorServicio(): void {
    this.agendas.sort((a, b) => {
      const servicioA = a.servicio.nombre.toLowerCase();
      const servicioB = b.servicio.nombre.toLowerCase();
      if (servicioA < servicioB) {
        return this.ordenAscendenteS ? -1 : 1;
      }
      if (servicioA > servicioB) {
        return this.ordenAscendenteS ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteS = !this.ordenAscendenteS;
  }
  
  ordenarPorPaciente(): void {
    this.agendas.sort((a, b) => {
      const nombreA = a.paciente.nombre.toLowerCase();
      const nombreB = b.paciente.nombre.toLowerCase();
      if (nombreA < nombreB) {
        return this.ordenAscendenteP ? -1 : 1;
      }
      if (nombreA > nombreB) {
        return this.ordenAscendenteP ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteP = !this.ordenAscendenteP;
  }
  
  ordenarPorRut(): void {
    this.agendas.reverse();
    this.ordenAscendenteR = !this.ordenAscendenteR;
  }
  ordenarPorFecha(): void {
    this.agendas.sort((a, b) => {
      const fechaA = new Date(a.fecha_agendamiento);
      const fechaB = new Date(b.fecha_agendamiento);
      if (fechaA < fechaB) {
        return this.ordenAscendenteF ? -1 : 1;
      }
      if (fechaA > fechaB) {
        return this.ordenAscendenteF ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteF = !this.ordenAscendenteF;
  }
  
  ordenarPorHora(): void {
    this.agendas.sort((a, b) => {
      const horaA = new Date(`1970-01-01T${a.hora_agendamiento}`);
      const horaB = new Date(`1970-01-01T${b.hora_agendamiento}`);
      if (horaA < horaB) {
        return this.ordenAscendenteH ? -1 : 1;
      }
      if (horaA > horaB) {
        return this.ordenAscendenteH ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteH = !this.ordenAscendenteH;
  }

  cambiarPagina(valor: number): void {
    this.inicio += valor;
  }

  obtenerTextoPaginacion(): string {
    const paginaActual = Math.floor(this.inicio / 5) + 1;
    const totalPaginas = Math.ceil(this.agendas.length / 5);
    return `Página ${paginaActual} de ${totalPaginas}`;
  }

  actualizarAgendas() {
    this.mostrarEditarAgenda = false;
    this.obtenerAgendas();
  }
}
