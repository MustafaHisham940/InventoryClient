import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { registerables } from 'chart.js';
import { SlidingNotificationComponent } from "../sliding-notification/sliding-notification.component";
import { ReportService } from '../../core/services/report.service';
import { DashboardService, MonthlyTotal, StockInOut } from '../../core/services/dashboard.service';
import { StoresService } from '../../core/services/stores.service';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-home', 
  standalone: true,
  imports: [SlidingNotificationComponent, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   *
   */
  notificationCostFlag:boolean=false
  constructor(private _ReportService:ReportService, private _DashboardService:DashboardService, private _StoresService:StoresService) {

  }

  // Stat cards - null means "not loaded (yet)" and shows a dash.
  todaySales: number | null = null;
  todayPurchases: number | null = null;
  productsInStock: number | null = null;

  /** shown in the monthly chart title */
  readonly currentYear = new Date().getFullYear();

  // Monthly bar chart: filled from the API, the chart itself is created after the view exists, so whichever comes last applies it.
  private monthlyTotals: MonthlyTotal[] | null = null;

  // Stock report (IvItmBal). Multi-store users get a store dropdown; single-store users are fixed to their own store.
  stockStoreChoosable = false;
  stockStores: { strCd: string, strNm: string }[] = [];
  /** null = all stores */
  stockStoreCode: string | null = null;
  stockTotalIn: number | null = null;
  stockTotalOut: number | null = null;
  private stockData: StockInOut | null = null;
  
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
    this.loadStatCards();
  }

  /** Scope (all stores vs. the user's single store) comes from the login token, see DashboardService.resolveScope */
  private loadStatCards(): void {
    const scope = this._DashboardService.resolveScope();
    if (!scope.ok) {
      console.warn('Dashboard cards skipped: the token has no usable store settings.');
      return;
    }

    this._DashboardService.getMonthlySalesPurchases(scope.storeCode).subscribe({
      next: (res) => {
        this.monthlyTotals = res.data;
        this.applyMonthlyToChart();
      },
      error: (err) => console.error('Could not load the monthly sales/purchases chart:', err)
    });

    this.stockStoreChoosable = scope.storeCode === null;
    this.stockStoreCode = scope.storeCode;
    if (this.stockStoreChoosable) {
      this._StoresService.GetStoresLookupList().subscribe({
        next: (res) => this.stockStores = res.data,
        error: (err) => console.error('Could not load the stores list:', err)
      });
    }
    this.loadStock();

    this._DashboardService.getHomeStats(scope.storeCode).subscribe({
      next: (res) => {
        this.todaySales = res.data.todaySales;
        this.todayPurchases = res.data.todayPurchases;
        this.productsInStock = res.data.productsInStock;
      },
      error: (err) => console.error('Could not load the dashboard cards:', err)
    });
  }

  /** fetches the stock in/out numbers for the selected store (all stores when none is selected) */
  private loadStock(): void {
    this._DashboardService.getStockInOut(this.stockStoreCode).subscribe({
      next: (res) => {
        this.stockData = res.data;
        this.stockTotalIn = res.data.totalIn;
        this.stockTotalOut = res.data.totalOut;
        this.applyStockToCharts();
      },
      error: (err) => console.error('Could not load the stock report:', err)
    });
  }

  /** the store dropdown of the stock report ('' = all stores) */
  onStockStoreChange(value: string): void {
    this.stockStoreCode = value ? value : null;
    this.loadStock();
  }

  private applyStockToCharts(): void {
    if (!this.stockData) return;
    const label = (i: { itmNm: string | null, itmCd: string }) => i.itmNm?.trim() || i.itmCd;

    const inChart = this.charts['stockInChart'];
    if (inChart) {
      inChart.data.labels = this.stockData.topIn.map(label);
      inChart.data.datasets[0].data = this.stockData.topIn.map(i => i.qty);
      inChart.update();
    }
    const outChart = this.charts['stockOutChart'];
    if (outChart) {
      outChart.data.labels = this.stockData.topOut.map(label);
      outChart.data.datasets[0].data = this.stockData.topOut.map(i => i.qty);
      outChart.update();
    }
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
        labels: [] as string[],
        datasets: [
          {
            label: 'المبيعات',
            data: [] as number[],
            backgroundColor: 'rgba(78, 115, 223, 0.8)',
            borderColor: 'rgba(78, 115, 223, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'المشتريات',
            data: [] as number[],
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
    this.applyMonthlyToChart();
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
          labels: [] as string[],
          datasets: [{
            label: 'الوارد',
            data: [] as number[],
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
      this.applyStockToCharts();
    }

    // Stock Out Chart
    const stockOutCtx = this.stockOutChartCanvas.nativeElement.getContext('2d');
    if (stockOutCtx) {
      const stockOutConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: [] as string[],
          datasets: [{
            label: 'الصادر',
            data: [] as number[],
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
      this.applyStockToCharts();
    }
  }

  // Update methods for interactive features
  /** pushes the loaded 12 months into the bar chart (no-op until both the chart and the data exist) */
  private applyMonthlyToChart(): void {
    const chart = this.charts['barChart'];
    if (!chart || !this.monthlyTotals) return;

    chart.data.labels = this.monthlyTotals.map(m =>
      new Date(m.year, m.month - 1, 1).toLocaleDateString('ar-EG', { month: 'long' }));
    chart.data.datasets[0].data = this.monthlyTotals.map(m => m.sales);
    chart.data.datasets[1].data = this.monthlyTotals.map(m => m.purchases);
    chart.update();
  }

  /** only 'monthly' is backed by real data for now (the quarterly / yearly buttons are disabled) */
  updateBarChart(period: string): void {
    if (period === 'monthly') {
      this.applyMonthlyToChart();
    }
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
