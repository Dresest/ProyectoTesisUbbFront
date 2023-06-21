import { Component, OnInit, ViewChild } from '@angular/core';
import { AgendaService } from '../../../core/_services/agenda.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AuthService } from 'src/app/core/_services/auth.service';

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
  // Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
        display: true,
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

  constructor(private agendaService: AgendaService,
    private _authService: AuthService
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
  }

  ngOnInit(): void {
    this.profesional = this._authService.obtenerInformacionToken();
    this.actualizarGrafica();
  }

  pdf(): void {
    this.mostrarPdf = true;
        this.element = document.getElementById("Reportes");
        // Configurar opciones de html2pdf
        const options = {
          filename: 'Reportes.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        setTimeout(() => {
          (window as any).html2pdf(this.element, options);
          
        }, 0);
      };
}
