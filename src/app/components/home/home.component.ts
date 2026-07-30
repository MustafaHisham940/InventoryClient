import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { registerables } from 'chart.js';
import { SlidingNotificationComponent } from "../sliding-notification/sliding-notification.component";
import { ReportService } from '../../core/services/report.service';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-home', 
  standalone: true,
  imports: [SlidingNotificationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   *
   */
  notificationCostFlag:boolean=false
  constructor(private _ReportService:ReportService) {
    
  }
  
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChartCanvas') doughnutChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stockInChartCanvas') stockInChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stockOutChartCanvas') stockOutChartCanvas!: ElementRef<HTMLCanvasElement>;

  private charts: { [key: string]: Chart } = {};

  ngOnInit(): void {
    this._ReportService.CheckCostStack().subscribe({
      next:(res)=>{
        this.notificationCostFlag=res.isSuccess
      }
    })
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  ngOnDestroy(): void {
    // Destroy all charts to prevent memory leaks
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  private initializeCharts(): void {
    this.createBarChart();
    this.createPieChart();
    this.createLineChart();
    this.createDoughnutChart();
    this.createStockCharts();
  }

  private createBarChart(): void {
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
            backgroundColor: 'rgba(78, 115, 223, 0.8)',
            borderColor: 'rgba(78, 115, 223, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Revenue',
            data: [28, 48, 40, 19, 86, 27, 90, 65, 45, 55, 70, 80],
            backgroundColor: 'rgba(28, 200, 138, 0.8)',
            borderColor: 'rgba(28, 200, 138, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
         //     drawBorder: true
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.charts['barChart'] = new Chart(ctx, config);
  }

  private createPieChart(): void {
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
        datasets: [{
          data: [300, 250, 180, 220, 150],
          backgroundColor: [
            'rgba(78, 115, 223, 0.8)',
            'rgba(28, 200, 138, 0.8)',
            'rgba(246, 194, 62, 0.8)',
            'rgba(231, 74, 59, 0.8)',
            'rgba(54, 185, 204, 0.8)'
          ],
          borderColor: [
            'rgba(78, 115, 223, 1)',
            'rgba(28, 200, 138, 1)',
            'rgba(246, 194, 62, 1)',
            'rgba(231, 74, 59, 1)',
            'rgba(54, 185, 204, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          }
        }
      }
    };

   this.charts['pieCharttt'] = new Chart(ctx, config as ChartConfiguration);
  }

  private createLineChart(): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12, 19, 3, 5, 2, 3, 15],
            borderColor: 'rgba(78, 115, 223, 1)',
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Orders',
            data: [8, 15, 7, 12, 9, 14, 11],
            borderColor: 'rgba(28, 200, 138, 1)',
            backgroundColor: 'rgba(28, 200, 138, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(28, 200, 138, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
             // drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.charts['lineChart'] = new Chart(ctx, config);
  }

  private createDoughnutChart(): void {
    const ctx = this.doughnutChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Company A', 'Company B', 'Company C', 'Company D'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: [
            'rgba(78, 115, 223, 0.8)',
            'rgba(28, 200, 138, 0.8)',
            'rgba(246, 194, 62, 0.8)',
            'rgba(231, 74, 59, 0.8)'
          ],
          borderColor: [
            'rgba(78, 115, 223, 1)',
            'rgba(28, 200, 138, 1)',
            'rgba(246, 194, 62, 1)',
            'rgba(231, 74, 59, 1)'
          ],
          borderWidth: 2,
        //  cutout: '60%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          }
        }
      }
    };

    this.charts['doughnutChart'] = new Chart(ctx, config as ChartConfiguration);
  }

  private createStockCharts(): void {
    // Stock In Chart
    const stockInCtx = this.stockInChartCanvas.nativeElement.getContext('2d');
    if (stockInCtx) {
      const stockInConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Stock In',
            data: [100, 150, 200, 250, 180, 120],
            backgroundColor: 'rgba(78, 115, 223, 0.8)',
            borderColor: 'rgba(78, 115, 223, 1)',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 10
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 10
                }
              }
            }
          }
        }
      };
      this.charts['stockInChart'] = new Chart(stockInCtx, stockInConfig);
    }

    // Stock Out Chart
    const stockOutCtx = this.stockOutChartCanvas.nativeElement.getContext('2d');
    if (stockOutCtx) {
      const stockOutConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Stock Out',
            data: [80, 120, 90, 60, 150, 100],
            backgroundColor: 'rgba(231, 74, 59, 0.8)',
            borderColor: 'rgba(231, 74, 59, 1)',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 10
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 10
                }
              }
            }
          }
        }
      };
      this.charts['stockOutChart'] = new Chart(stockOutCtx, stockOutConfig);
    }
  }

  // Update methods for interactive features
  updateBarChart(period: string): void {
    const chart = this.charts['barChart'];
    if (!chart) return;

    let newData: number[][] = [];
    let newLabels: string[] = [];

    switch (period) {
      case 'monthly':
        newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        newData = [
          [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
          [28, 48, 40, 19, 86, 27, 90, 65, 45, 55, 70, 80]
        ];
        break;
      case 'quarterly':
        newLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
        newData = [
          [204, 192, 150, 245],
          [116, 132, 200, 205]
        ];
        break;
      case 'yearly':
        newLabels = ['2020', '2021', '2022', '2023', '2024'];
        newData = [
          [850, 920, 1100, 1250, 1400],
          [720, 850, 980, 1150, 1300]
        ];
        break;
    }

    chart.data.labels = newLabels;
    chart.data.datasets[0].data = newData[0];
    chart.data.datasets[1].data = newData[1];
    chart.update();
  }

  updateLineChart(period: string): void {
    const chart = this.charts['lineChart'];
    if (!chart) return;

    let newData: number[][] = [];
    let newLabels: string[] = [];

    switch (period) {
      case '7d':
        newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        newData = [
          [12, 19, 3, 5, 2, 3, 15],
          [8, 15, 7, 12, 9, 14, 11]
        ];
        break;
      case '30d':
        newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        newData = [
          [45, 52, 38, 61],
          [32, 41, 28, 47]
        ];
        break;
      case '90d':
        newLabels = ['Month 1', 'Month 2', 'Month 3'];
        newData = [
          [180, 220, 195],
          [140, 165, 152]
        ];
        break;
    }

    chart.data.labels = newLabels;
    chart.data.datasets[0].data = newData[0];
    chart.data.datasets[1].data = newData[1];
    chart.update();
  }
  OnDestroy(){

  }
} 
