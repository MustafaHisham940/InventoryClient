import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { registerables } from 'chart.js';
import { SlidingNotificationComponent } from "../sliding-notification/sliding-notification.component";
import { ReportService } from '../../core/services/report.service';
import { DashboardService, DailySales, MonthlyTotal, StockInOut, StoreCashTotals, TopCustomers } from '../../core/services/dashboard.service';
import { isoToDate } from '../../core/utils/date-iso';
import { StoresService } from '../../core/services/stores.service';
import { StoreScopeService } from '../../core/services/store-scope.service';

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
  constructor(private _ReportService:ReportService, private _DashboardService:DashboardService, private _StoresService:StoresService, private _StoreScope:StoreScopeService) {

  }

  // Stat cards - null means "not loaded (yet)" and shows a dash.
  todaySales: number | null = null;
  todayCreditSales: number | null = null;
  todayPurchases: number | null = null;
  customersCount: number | null = null;

  // Store filter of the stat cards. Decided by the login token: an all-stores user picks a store (default: all),
  // a single-store user is fixed to their own store and only sees it as a badge.
  cardsStoreChoosable = false;
  /** null = all stores */
  cardsStoreCode: string | null = null;
  /** name of the user's own store (single-store users) */
  cardsStoreName: string | null = null;

  /** shown in the monthly chart title */
  readonly currentYear = new Date().getFullYear();

  // Sales trend (last 7 days, cash vs credit). Same store rule as the cards: an all-stores user picks a store
  // (default: all), a single-store user is fixed to their own store.
  trendStoreChoosable = false;
  /** null = all stores */
  trendStoreCode: string | null = null;
  trendStoreName: string | null = null;
  private dailySales: DailySales[] | null = null;

  // Cash vouchers table (client payments / supplier payments / personal withdrawals per store).
  // The token decides: an all-stores user sees one row per store plus a total, a single-store user only their own store.
  storeCashRows: StoreCashTotals[] | null = null;

  // Top customers doughnut (share of the total sales). Same store rule as the cards: an all-stores user picks a store
  // (default: all), a single-store user is fixed to their own store.
  topStoreChoosable = false;
  /** null = all stores */
  topStoreCode: string | null = null;
  topStoreName: string | null = null;
  private topCustomers: TopCustomers | null = null;

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

    this.cardsStoreChoosable = scope.storeCode === null;
    this.cardsStoreCode = scope.storeCode;
    this.cardsStoreName = this._StoreScope.getScope().singleStoreName;
    this.loadHomeStats();

    this.trendStoreChoosable = scope.storeCode === null;
    this.trendStoreCode = scope.storeCode;
    this.trendStoreName = this._StoreScope.getScope().singleStoreName;
    this.loadTrend();

    this.topStoreChoosable = scope.storeCode === null;
    this.topStoreCode = scope.storeCode;
    this.topStoreName = this._StoreScope.getScope().singleStoreName;
    this.loadTopCustomers();

    this.loadStoreCash();
  }

  /** the cash-vouchers table; the token is re-read so a single-store user always gets their own store only */
  private loadStoreCash(): void {
    const scope = this._DashboardService.resolveScope();
    if (!scope.ok) {
      return;
    }

    this._DashboardService.getStoreCashTotals(scope.storeCode).subscribe({
      next: (res) => this.storeCashRows = res.data,
      error: (err) => console.error('Could not load the cash vouchers table:', err)
    });
  }

  /** row label: the store name, a fixed Arabic label for the vouchers that are saved without a store */
  storeCashLabel(row: StoreCashTotals): string {
    return row.strCd.toLowerCase() === 'null' ? 'عام (بدون مخزن)' : (row.strNm?.trim() || row.strCd);
  }

  /** the total row (all-stores users only) */
  get storeCashTotal(): StoreCashTotals {
    const rows = this.storeCashRows ?? [];
    return {
      strCd: '', strNm: null,
      clientPayments: rows.reduce((s, r) => s + r.clientPayments, 0),
      supplierPayments: rows.reduce((s, r) => s + r.supplierPayments, 0),
      personalWithdrawals: rows.reduce((s, r) => s + r.personalWithdrawals, 0)
    };
  }

  /** top 5 customers by sales; the token is checked again so a single-store user always gets their own store */
  private loadTopCustomers(): void {
    const scope = this._DashboardService.resolveScope();
    if (!scope.ok) {
      return;
    }
    const storeCode = scope.storeCode ?? this.topStoreCode;

    this._DashboardService.getTopCustomers(storeCode, 5).subscribe({
      next: (res) => {
        this.topCustomers = res.data;
        this.applyTopCustomersToChart();
      },
      error: (err) => console.error('Could not load the top customers:', err)
    });
  }

  /** the store dropdown of the top customers chart ('' = all stores) */
  onTopStoreChange(value: string): void {
    this.topStoreCode = value ? value : null;
    this.loadTopCustomers();
  }

  /** pushes the loaded customers into the doughnut (no-op until both the chart and the data exist) */
  private applyTopCustomersToChart(): void {
    const chart = this.charts['doughnutChart'];
    if (!chart || !this.topCustomers) return;

    const labels = this.topCustomers.customers.map(c => `${c.cstNm?.trim() || c.cstId} (${c.percent}%)`);
    const values = this.topCustomers.customers.map(c => c.sales);
    // everybody else keeps the doughnut at 100% of the total sales
    if (this.topCustomers.othersSales > 0) {
      labels.push(`أخرى (${this.topCustomers.othersPercent}%)`);
      values.push(this.topCustomers.othersSales);
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update();
  }

  /** last 7 days of cash vs credit sales; the token is checked again so a single-store user always gets their own store */
  private loadTrend(): void {
    const scope = this._DashboardService.resolveScope();
    if (!scope.ok) {
      return;
    }
    const storeCode = scope.storeCode ?? this.trendStoreCode;

    this._DashboardService.getDailySales(storeCode, 7).subscribe({
      next: (res) => {
        this.dailySales = res.data;
        this.applyTrendToChart();
      },
      error: (err) => console.error('Could not load the sales trend:', err)
    });
  }

  /** the store dropdown of the sales trend ('' = all stores) */
  onTrendStoreChange(value: string): void {
    this.trendStoreCode = value ? value : null;
    this.loadTrend();
  }

  /** pushes the loaded days into the line chart (no-op until both the chart and the data exist) */
  private applyTrendToChart(): void {
    const chart = this.charts['lineChart'];
    if (!chart || !this.dailySales) return;

    chart.data.labels = this.dailySales.map(d => {
      const day = isoToDate(d.date);
      return day ? day.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'numeric' }) : d.date;
    });
    chart.data.datasets[0].data = this.dailySales.map(d => d.cashSales);
    chart.data.datasets[1].data = this.dailySales.map(d => d.creditSales);
    chart.update();
  }

  /**
   * Loads the stat cards for the selected store. The token is checked again on every load: a single-store user always
   * gets their own store whatever the screen holds, an all-stores user gets the picked store or every store.
   */
  private loadHomeStats(): void {
    const scope = this._DashboardService.resolveScope();
    if (!scope.ok) {
      return;
    }
    const storeCode = scope.storeCode ?? this.cardsStoreCode;

    this._DashboardService.getHomeStats(storeCode).subscribe({
      next: (res) => {
        this.todaySales = res.data.todaySales;
        this.todayCreditSales = res.data.todayCreditSales;
        this.todayPurchases = res.data.todayPurchases;
        this.customersCount = res.data.customersCount;
      },
      error: (err) => console.error('Could not load the dashboard cards:', err)
    });
  }

  /** the store dropdown above the stat cards ('' = all stores) */
  onCardsStoreChange(value: string): void {
    this.cardsStoreCode = value ? value : null;
    this.todaySales = this.todayCreditSales = null; // dash while the new numbers load
    this.loadHomeStats();
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

  private createLineChart(): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: [] as string[],
        datasets: [
          {
            label: 'مبيعات نقدية',
            data: [] as number[],
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
            label: 'مبيعات آجلة',
            data: [] as number[],
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
    this.applyTrendToChart();
  }

  private createDoughnutChart(): void {
    const ctx = this.doughnutChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: [] as string[],
        datasets: [{
          data: [] as number[],
          // five customers + the grey "others" slice
          backgroundColor: [
            'rgba(78, 115, 223, 0.8)',
            'rgba(28, 200, 138, 0.8)',
            'rgba(246, 194, 62, 0.8)',
            'rgba(231, 74, 59, 0.8)',
            'rgba(54, 185, 204, 0.8)',
            'rgba(160, 160, 160, 0.6)'
          ],
          borderColor: [
            'rgba(78, 115, 223, 1)',
            'rgba(28, 200, 138, 1)',
            'rgba(246, 194, 62, 1)',
            'rgba(231, 74, 59, 1)',
            'rgba(54, 185, 204, 1)',
            'rgba(160, 160, 160, 1)'
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
          },
          tooltip: {
            callbacks: {
              // the label already carries the name and the percentage, the tooltip adds the amount
              label: (item) => `${item.label}: ${Number(item.raw).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
            }
          }
        }
      }
    };

    this.charts['doughnutChart'] = new Chart(ctx, config as ChartConfiguration);
    this.applyTopCustomersToChart();
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

  OnDestroy(){

  }
} 
