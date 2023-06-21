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
  agendasReagendar: any[] = []; // Agendas con estado "reagendar"
  ordenAscendente: boolean = true;
  ordenAscendenteP: boolean = true;
  ordenAscendenteR: boolean = true;
  ordenAscendenteF: boolean = true;
  ordenAscendenteH: boolean = true;
  ordenAscendenteS: boolean = true;
  ordenAscendentePReagendar: boolean = true; // Orden ascendente para ordenar por paciente en agendas con estado "reagendar"
  inicio: number = 0;
  inicioReagendar: number = 0; // Inicio para paginación en agendas con estado "reagendar"
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
  actualizarAgendas() {
    this.mostrarEditarAgenda = false;
    this.obtenerAgendas();
  }

  obtenerAgendas(): void {
    this.agendaService
      .obtenerAgendasProfesional(this.userInfo.id)
      .subscribe((respuesta) => {
        this.agendas = respuesta.agendas;
        this.agendasReagendar = this.agendas.filter((agenda) => agenda.estado.status === "reagendar");
        const fechaHoy = new Date();
        fechaHoy.setHours(0, 0, 0, 0);

        this.agendas = this.agendas.filter(
          (agenda) => {
            const fechaAgendamiento = new Date(agenda.fecha_agendamiento);
            return fechaAgendamiento.toDateString() === fechaHoy.toDateString();
          }
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

  ordenarPorPacienteReagendar(): void {
    this.agendasReagendar.sort((a, b) => {
      const nombreA = a.paciente.nombre.toLowerCase();
      const nombreB = b.paciente.nombre.toLowerCase();
      if (nombreA < nombreB) {
        return this.ordenAscendentePReagendar ? -1 : 1;
      }
      if (nombreA > nombreB) {
        return this.ordenAscendentePReagendar ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendentePReagendar = !this.ordenAscendentePReagendar;
  }

  ordenarPorEstadoReagendar(): void {
    this.agendasReagendar.sort((a, b) => {
      const estadoA = a.estado.status.toLowerCase();
      const estadoB = b.estado.status.toLowerCase();
      if (estadoA < estadoB) {
        return this.ordenAscendenteR ? -1 : 1;
      }
      if (estadoA > estadoB) {
        return this.ordenAscendenteR ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteR = !this.ordenAscendenteR;
  }
  
  ordenarPorRutReagendar(): void {
    this.agendasReagendar.sort((a, b) => {
      const rutA = a.paciente.rut.toLowerCase();
      const rutB = b.paciente.rut.toLowerCase();
      if (rutA < rutB) {
        return this.ordenAscendenteR ? -1 : 1;
      }
      if (rutA > rutB) {
        return this.ordenAscendenteR ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteR = !this.ordenAscendenteR;
  }
  
  ordenarPorServicioReagendar(): void {
    this.agendasReagendar.sort((a, b) => {
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

  ordenarPorFechaReagendar(): void {
    this.agendasReagendar.sort((a, b) => {
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
  
  ordenarPorHoraReagendar(): void {
    this.agendasReagendar.sort((a, b) => {
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

  cambiarPaginaReagendar(valor: number): void {
    this.inicioReagendar += valor;
  }

  obtenerTextoPaginacionReagendar(): string {
    const paginaActual = Math.floor(this.inicioReagendar / 5) + 1;
    const totalPaginas = Math.ceil(this.agendasReagendar.length / 5);
    return `Página ${paginaActual} de ${totalPaginas}`;
  }

  
}
