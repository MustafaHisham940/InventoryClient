import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';
import { TokenService } from './token.service';
import { dateToIso } from '../utils/date-iso';

export interface HomeStats {
  /** cash sales of the day (IVHDrs TrsTy 11, DTy = cash) */
  todaySales: number;
  /** credit sales of the day (IVHDrs TrsTy 11, DTy = pay later) */
  todayCreditSales: number;
  todayPurchases: number;
  /** customers (Typ = customer or both); not store-specific */
  customersCount: number;
}

export interface MonthlyTotal {
  year: number;
  /** 1 - 12 */
  month: number;
  sales: number;
  purchases: number;
}

/** one day of the sales trend (cash vs credit) */
export interface DailySales {
  /** 'yyyy-mm-ddT00:00:00' */
  date: string;
  cashSales: number;
  creditSales: number;
}

/** one of the best customers of the doughnut */
export interface TopCustomer {
  cstId: number;
  cstNm: string | null;
  sales: number;
  /** share of the total sales, 1 decimal */
  percent: number;
}

/** best customers by sales and their share of the total sales */
export interface TopCustomers {
  totalSales: number;
  customers: TopCustomer[];
  /** everybody else (sales without a customer included) */
  othersSales: number;
  othersPercent: number;
}

/** one row of the cash-vouchers table: the totals of one store */
export interface StoreCashTotals {
  /** store code; "Null" = vouchers saved without a store (client / supplier payments) */
  strCd: string;
  strNm: string | null;
  clientPayments: number;
  supplierPayments: number;
  personalWithdrawals: number;
}

export interface StockItemQty {
  itmCd: string;
  itmNm: string | null;
  qty: number;
}

/** Stock report: totals and top items of stock in (IQty) / stock out (OQty) */
export interface StockInOut {
  totalIn: number;
  totalOut: number;
  topIn: StockItemQty[];
  topOut: StockItemQty[];
}

/** Which stores the logged-in user's dashboard covers. ok = false when the token's store settings are inconsistent. */
export interface DashboardScope {
  ok: boolean;
  /** null = every store (multi-store user), otherwise the single store's code */
  storeCode: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _HttpClient: HttpClient, private _TokenService: TokenService) { }

  /**
   * Works the dashboard scope out from the login token:
   *  - MultiStore === 'True'  and SingleStoreCode is the text "null"  -> all stores
   *  - MultiStore === 'False' and SingleStoreCode has a real value    -> that store only
   * Anything else is treated as not usable rather than guessing.
   */
  resolveScope(): DashboardScope {
    const settings = this._TokenService.GetUserStoreSettings();
    if (!settings) {
      return { ok: false, storeCode: null };
    }

    const hasStore = !!settings.SingleStoreCode && settings.SingleStoreCode.trim().toLowerCase() !== 'null';
    const hasStoreName = !!settings.SingleStoreName && settings.SingleStoreName.trim().toLowerCase() !== 'null';

    if (settings.MultiStore === 'True' && !hasStore && !hasStoreName) {
      return { ok: true, storeCode: null };
    }
    if (settings.MultiStore === 'False' && hasStore && hasStoreName) {
      return { ok: true, storeCode: settings.SingleStoreCode };
    }
    return { ok: false, storeCode: null };
  }

  /** last 12 months (oldest first, current month last) of sales vs purchases */
  getMonthlySalesPurchases(storeCode: string | null): Observable<{ data: MonthlyTotal[] }> {
    let params = new HttpParams();
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: MonthlyTotal[] }>(`${environments.baseURL}/api/Dashboard/GetMonthlySalesPurchases`, { params });
  }

  /** cash vs credit sales per day for the last `days` days ending today (the user's own calendar day) */
  getDailySales(storeCode: string | null, days = 7): Observable<{ data: DailySales[] }> {
    let params = new HttpParams().set('days', days).set('date', dateToIso(new Date()));
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: DailySales[] }>(`${environments.baseURL}/api/Dashboard/GetDailySales`, { params });
  }

  /** the `top` customers with the biggest sales and their share of the total sales, for one store or every store (null) */
  getTopCustomers(storeCode: string | null, top = 5): Observable<{ data: TopCustomers }> {
    let params = new HttpParams().set('top', top);
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: TopCustomers }>(`${environments.baseURL}/api/Dashboard/GetTopCustomers`, { params });
  }

  /** client payments / supplier payments / personal withdrawals per store; one store only when storeCode is given, every store when null */
  getStoreCashTotals(storeCode: string | null): Observable<{ data: StoreCashTotals[] }> {
    let params = new HttpParams();
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: StoreCashTotals[] }>(`${environments.baseURL}/api/Dashboard/GetStoreCashTotals`, { params });
  }

  /** stock in / stock out OF TODAY (the user's own calendar day) for one store, or every store when storeCode is null */
  getStockInOut(storeCode: string | null, top = 6): Observable<{ data: StockInOut }> {
    let params = new HttpParams().set('top', top).set('date', dateToIso(new Date()));
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: StockInOut }>(`${environments.baseURL}/api/Dashboard/GetStockInOut`, { params });
  }

  getHomeStats(storeCode: string | null): Observable<{ data: HomeStats }> {
    // "today" is the user's own calendar day - the server may run in another time zone (Azure = UTC)
    let params = new HttpParams().set('date', dateToIso(new Date()));
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: HomeStats }>(`${environments.baseURL}/api/Dashboard/GetHomeStats`, { params });
  }
}
