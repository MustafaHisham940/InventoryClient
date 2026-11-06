import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';
import { TokenService } from './token.service';

export interface HomeStats {
  todaySales: number;
  todayPurchases: number;
  productsInStock: number;
}

export interface MonthlyTotal {
  year: number;
  /** 1 - 12 */
  month: number;
  sales: number;
  purchases: number;
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

  /** stock in / stock out from IvItmBal for one store, or every store when storeCode is null */
  getStockInOut(storeCode: string | null, top = 6): Observable<{ data: StockInOut }> {
    let params = new HttpParams().set('top', top);
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: StockInOut }>(`${environments.baseURL}/api/Dashboard/GetStockInOut`, { params });
  }

  getHomeStats(storeCode: string | null): Observable<{ data: HomeStats }> {
    let params = new HttpParams();
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    return this._HttpClient.get<{ data: HomeStats }>(`${environments.baseURL}/api/Dashboard/GetHomeStats`, { params });
  }
}
