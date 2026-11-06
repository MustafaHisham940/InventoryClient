import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';
import { CostAdjustmentStoreItem } from '../interfaces/CostControl';
import { ItemsListReportRequest } from '../interfaces/items-list-report';
import { ItemsBalancesReportRequest } from '../interfaces/items-balances-report';
import { InventoryEvaluationReportRequest } from '../interfaces/inventory-evaluation-report';
import { InventorySalesReportRequest } from '../interfaces/inventory-sales-report';
import { DetailedItemSalesReportRequest } from '../interfaces/detailed-item-sales-report';
import { DailyBoxReportRequest } from '../interfaces/daily-box-report';
import { ExistDailyBoxReportRequest } from '../interfaces/exist-daily-box-report';
import { ItemsEvaluationInDurationReportRequest } from '../interfaces/items-evaluation-in-duration-report';
import { ClientSalesDetailedReportRequest } from '../interfaces/client-sales-detailed-report';
import { CustomersSuppliersListReportRequest } from '../interfaces/customers-suppliers-list-report';
import { StoreItemsNeedReportRequest } from '../interfaces/store-items-need-report';
import { CustomerItemsSalesReportRequest } from '../interfaces/customer-items-sales-report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private _HttpClient:HttpClient) { }


  getFilteredItemsReport(
    params: {
    _idName?: string | null;
    _itmName?: string | null;
    _barCode?: string | null;
    _ctgID?: string;
    _sort?: string;
    _pageSize?: number;
    _pageIndex?: number;
  }): Observable<Blob> {
  
    let httpParams = new HttpParams();
  
    if (params._idName)
      httpParams = httpParams.append('_idName', params._idName);
  
    if (params._itmName)
      httpParams = httpParams.append('_itmName', params._itmName);
  
    if (params._barCode)
      httpParams = httpParams.append('_barCode', params._barCode);
  
    if (params._ctgID)
      httpParams = httpParams.append('_ctgID', params._ctgID);
  
    if (params._sort)
      httpParams = httpParams.append('_sort', params._sort);
  
    if (params._pageSize !== undefined)
      httpParams = httpParams.append('_pageSize', params._pageSize.toString());
  
    if (params._pageIndex !== undefined)
      httpParams = httpParams.append('_pageIndex', params._pageIndex.toString());
  
    return this._HttpClient.get(
      `${environments.baseURL}/api/Reports/items-report`,
      { params: httpParams, responseType: 'blob' }
    );
  }
  


  getFilteredItemsExcel(
    params: {
    _idName?: string | null;
    _itmName?: string | null;
    _barCode?: string | null;
    _ctgID?: string;
    _sort?: string;
    _pageSize?: number;
    _pageIndex?: number;
  }): Observable<Blob> {
  
    let httpParams = new HttpParams();
  
    if (params._idName)
      httpParams = httpParams.append('_idName', params._idName);
  
    if (params._itmName)
      httpParams = httpParams.append('_itmName', params._itmName);
  
    if (params._barCode)
      httpParams = httpParams.append('_barCode', params._barCode);
  
    if (params._ctgID)
      httpParams = httpParams.append('_ctgID', params._ctgID);
  
    if (params._sort)
      httpParams = httpParams.append('_sort', params._sort);
  
    if (params._pageSize !== undefined)
      httpParams = httpParams.append('_pageSize', params._pageSize.toString());
  
    if (params._pageIndex !== undefined)
      httpParams = httpParams.append('_pageIndex', params._pageIndex.toString());
  
    return this._HttpClient.get(
      `${environments.baseURL}/api/ExcelReport/items-report-excel`,
      { params: httpParams, responseType: 'blob' }
    );
  }




  downloadExcel(params: any) {
    return this._HttpClient.get(
      `${environments.baseURL}/api/Reports/items-report-excel`,
      { params, responseType: 'blob' }
    );
  }
  

  getReport(): Observable<Blob> {
    return this._HttpClient.get(
      'https://localhost:5001/api/reports/return-details',
      { responseType: 'blob' }
    );
  }
  

/****************************************** */

  getItemCheckUpReport(body: any): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ItemCheckUp-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getItemCheckUpReport(body: any): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ItemCheckUp-report`,
      body,
      { responseType: 'blob' }
    );
  }
/*************************************** */


/************************************************************* */
  CostadjustmentSpeceficItemReport(body: any): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/CostAdjustment-report`,
      body,
      { responseType: 'blob' }
    );
  }
  ExcelReport_CostadjustmentSpeceficItemReport(body: any): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ExcelRep-ItemStoreCostAdjustment`,
      body,
      { responseType: 'blob' }
    );
  }

/******************************************************** */
  getAllItemsNeedAdjustCost():Observable<any>{
    return this._HttpClient.get(`${environments.baseURL}/api/Reports/findAllItemsNeedCostAdjustment`)
  }


  

  AdjustItemStoreCost():Observable<any>{
    return this._HttpClient.post(`${environments.baseURL}/api/CostAdjustment/AdjustItemStoreCost` , {})
  }

  AdjustSpeceficStoreITemCost(data:CostAdjustmentStoreItem):Observable<any>{
    return this._HttpClient.post(`${environments.baseURL}/api/CostAdjustment/AdjustSpeceficStoreITemCost` ,data )
  }



  CheckCostStack():Observable<any>{
    return this._HttpClient.get(`${environments.baseURL}/api/CostAdjustment/CheckCostStack`  )
  }



/******************************************************** */

  getItemsListReport(body: ItemsListReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ItemsList-2-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getItemsListReport(body: ItemsListReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ItemsList-2-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getItemsBalancesReport(body: ItemsBalancesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ItemsBalances-3-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getItemsBalancesReport(body: ItemsBalancesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ItemsBalances-3-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getInventoryEvaluationReport(body: InventoryEvaluationReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/InventoryEvaluation-4-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getInventoryEvaluationReport(body: InventoryEvaluationReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/InventoryEvaluation-4-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getInventorySalesReport(body: InventorySalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/InventorySales-5-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getInventorySalesReport(body: InventorySalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/InventorySales-5-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getInventoryPurchasesReport(body: InventorySalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/InventoryPurchases-6-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getInventoryPurchasesReport(body: InventorySalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/InventoryPurchases-6-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getExistDailyBoxReport(body: ExistDailyBoxReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ExistDailyBox-16-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getExistDailyBoxReport(body: ExistDailyBoxReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ExistDailyBox-16-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getDailyBoxReport(body: DailyBoxReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/DailyBox-15-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getDailyBoxReport(body: DailyBoxReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/DailyBox-15-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getDetailedItemSalesReport(body: DetailedItemSalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/DetailedItemSales-8-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getDetailedItemSalesReport(body: DetailedItemSalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/DetailedItemSales-8-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getDetailedItemPurchasesReport(body: DetailedItemSalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/DetailedItemPurchaces-8-2-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getDetailedItemPurchasesReport(body: DetailedItemSalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/DetailedItemPurchaces-8-2-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getItemsEvaluationInDurationReport(body: ItemsEvaluationInDurationReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ItemsEvaluationInDuration-9-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getItemsEvaluationInDurationReport(body: ItemsEvaluationInDurationReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ItemsEvaluationInDuration-9-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getClientSalesDetailedReport(body: ClientSalesDetailedReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ClientSalesDetailed-13-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getClientSalesDetailedReport(body: ClientSalesDetailedReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ClientSalesDetailed-13-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getCustomersSuppliersListReport(body: CustomersSuppliersListReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/CustomersSuppliersList-12-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getCustomersSuppliersListReport(body: CustomersSuppliersListReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/CustomersSuppliersList-12-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getClientPurchasesDetailedReport(body: ClientSalesDetailedReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/ClientPurchasesDetailed-14-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getClientPurchasesDetailedReport(body: ClientSalesDetailedReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/ClientPurchasesDetailed-14-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getStoreItemsNeedReport(body: StoreItemsNeedReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/StoreItemsNeed-7-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getStoreItemsNeedReport(body: StoreItemsNeedReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/StoreItemsNeed-7-report`,
      body,
      { responseType: 'blob' }
    );
  }

  getCustomerItemsSalesReport(body: CustomerItemsSalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/Reports/CustomersItemsSales-11-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_getCustomerItemsSalesReport(body: CustomerItemsSalesReportRequest): Observable<Blob> {
    return this._HttpClient.post(
      `${environments.baseURL}/api/ExcelReport/CustomersItemsSales-11-report`,
      body,
      { responseType: 'blob' }
    );
  }



 


}
