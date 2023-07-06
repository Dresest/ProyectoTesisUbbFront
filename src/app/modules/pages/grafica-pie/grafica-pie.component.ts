import { Component, OnInit, ViewChild } from '@angular/core';
import { AgendaService } from '../../../core/_services/agenda.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AuthService } from 'src/app/core/_services/auth.service';
import { servicioService } from 'src/app/core/_services/servicio-profesional.service';

@Component({
  selector: 'app-grafica-pie',
  templateUrl: './grafica-pie.component.html',
  styleUrls: ['./grafica-pie.component.css']
})
export class GraficaPieComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  profesional: any;
  element: any;
  mostrarPdf = false;
  centrarGraficos = false;
  cantidadPacientes:any;
  cantidadProfesional:any;
  cantidadAgendas:any;
  cantidadServicios:any;
  // Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Agendas Manuales'], ['Agendas Online']],
    datasets: [{
      data: [999, 999]
    }]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  // Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          const label = this.barChartLabels[ctx.dataIndex];
          return label ? ` ${value}` : '';
        },
      },
    }
  };
  public barChartLabels: string[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  public barChartData: ChartData<'bar', number[], string> = {
    labels: this.barChartLabels,
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'Agendas por Mes',
    }]
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DatalabelsPlugin];

  // Bar Chart para profesionales
  public barChartOptionsProfesionales: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          const label = this.barChartLabelsProfesionales[ctx.dataIndex];
          return label ? ` ${value}` : '';
        },
      },
    }
  };
  public barChartLabelsProfesionales: string[] = [];
  public barChartDataProfesionales: ChartData<'bar', number[], string> = {
    labels: this.barChartLabelsProfesionales,
    datasets: [{
      data: [],
      label: 'Cantidad de Agendas',
    }]
  };
  public barChartTypeProfesionales: ChartType = 'bar';
  public barChartPluginsProfesionales = [DatalabelsPlugin];

  constructor(
    private agendaService: AgendaService,
    private _authService: AuthService,
    private _servicioService: servicioService,
  ) { }

  public actualizarGrafica(): void {
    this.agendaService.contar().subscribe((data) => {
      const totalAgendas = data.agendasOffline + data.agendasOnline;
      const agendasOfflinePercentage = ((data.agendasOffline / totalAgendas) * 100).toFixed(2);
      const agendasOnlinePercentage = ((data.agendasOnline / totalAgendas) * 100).toFixed(2);

      this.pieChartData = {
        labels: [
          `Agendas Manuales ${data.agendasOffline} (${agendasOfflinePercentage}%)`,
          `Agendas Online ${data.agendasOnline} (${agendasOnlinePercentage}%)`
        ],
        datasets: [{
          data: [data.agendasOffline, data.agendasOnline]
        }]
      };

      // Actualiza la gráfica
      if (this.chart) {
        this.chart.update();
      }
    });

    this.agendaService.reporteAnual(this.profesional.id).subscribe((data) => {
      const reporteAnual = data.reporteAnual;

      // Actualizar datos del gráfico de barras
      const barChartData = {
        labels: this.barChartLabels,
        datasets: [{
          data: this.barChartLabels.map((mes) => reporteAnual[mes] || 0),
          label: 'Agendas por Mes',
        }]
      };
      this.barChartData = barChartData;

      // Actualizar la gráfica
      if (this.chart) {
        this.chart.update();
      }
    });

    this.agendaService.reportePorProfesional().subscribe((data) => {
      const reportePorProfesional = data.reportePorProfesional;

      this.barChartLabelsProfesionales = Object.keys(reportePorProfesional);
      const barChartDataProfesionales = {
        labels: this.barChartLabelsProfesionales,
        datasets: [{
          data: this.barChartLabelsProfesionales.map((profesional) => reportePorProfesional[profesional]),
          label: 'Cantidad de Agendas',
        }]
      };
      this.barChartDataProfesionales = barChartDataProfesionales;

      // Actualizar la gráfica de profesionales
      if (this.chart) {
        this.chart.update();
      }
    });
  }

  ngOnInit(): void {
    this.profesional = this._authService.obtenerInformacionToken();
    this.actualizarGrafica();
    this.contarProf();
  this.contarPaciente();
  this.contarAgendas();
  this.obtenerServicios();
    // Establecer willReadFrequently en true para el gráfico de pastel
    const pieChartContext = (this.chart?.chart as any)?.ctx;
    if (pieChartContext) {
      pieChartContext.willReadFrequently = true;
    }
  }

  contarProf(): void{
    this.agendaService.contarProfesionales().subscribe(respuesta => {
      this.contarProf = respuesta.profesionales;

    });
  }

  contarPaciente(): void{
    this.agendaService.contarPacientes().subscribe(respuesta => {
      this.cantidadPacientes = respuesta.pacientes;

    });
  }
  
  contarAgendas(): void{
    this.agendaService.obtenerAgendasProfesional(this.profesional.id).subscribe(respuesta => {
      this.cantidadAgendas = respuesta.agendas.length;

    });
  }
  obtenerServicios(): void {
    this._servicioService.obtenerServiciosPorProfesional(this.profesional.id).subscribe(respuesta => {
      this.cantidadServicios = respuesta.servicios.length;
    });
  }

  pdf(): void {
    this.mostrarPdf = true;
    // Configurar opciones de html2pdf
    const options = {
      filename: 'Reportes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 6 },
      jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
      
    };
  
    // Esperar un breve período de tiempo antes de obtener el elemento y generar el PDF
    setTimeout(() => {
      this.element = document.getElementById("Reportes");
      if (this.element) {
        (window as any).html2pdf(this.element, options);
        this.mostrarPdf = false;
      }
    }, 900);
   
  };
  
  
}
