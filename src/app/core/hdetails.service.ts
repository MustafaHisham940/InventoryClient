import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from './environment/environments';

@Injectable({
  providedIn: 'root'
})
export class HDetailsService {

  constructor(private _HttpClient: HttpClient) { }

  getAllHeadersFiltered(params: {
    f_StrCd_name?: string;
    f__TrsTy?: number;
    f__TrsNo?: number;
    f__TrsDt?: Date;
    f_CstId?: number;
    f__Val?: number;
    f_Disc_name?: string;
    f_OvrPrc_name?: string;
    f__DTy?: number;
    f_SCd_name?: string;
    f_OWn_name?: string;
    f_LUsr_name?: string;
    f__CTm?: Date;
    f__LTm?: Date;
    f_SPrc?: number;
    _Sort?: string;
    _pageSize?: number;
    _pageIndex?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();
  
    if (params.f_StrCd_name) httpParams = httpParams.append('f_StrCd_name', params.f_StrCd_name);
    if (params.f__TrsTy !== undefined) httpParams = httpParams.append('f__TrsTy', params.f__TrsTy.toString());
    if (params.f__TrsNo !== undefined) httpParams = httpParams.append('f__TrsNo', params.f__TrsNo.toString());
    if (params.f__TrsDt) httpParams = httpParams.append('f__TrsDt', params.f__TrsDt.toISOString());
    if (params.f_CstId !== undefined) httpParams = httpParams.append('f_CstId', params.f_CstId.toString());
    if (params.f__Val !== undefined) httpParams = httpParams.append('f__Val', params.f__Val.toString());
    if (params.f_Disc_name) httpParams = httpParams.append('f_Disc_name', params.f_Disc_name);
    if (params.f_OvrPrc_name) httpParams = httpParams.append('f_OvrPrc_name', params.f_OvrPrc_name);
    if (params.f__DTy !== undefined) httpParams = httpParams.append('f__DTy', params.f__DTy.toString());
    if (params.f_SCd_name) httpParams = httpParams.append('f_SCd_name', params.f_SCd_name);
    if (params.f_OWn_name) httpParams = httpParams.append('f_OWn_name', params.f_OWn_name);
    if (params.f_LUsr_name) httpParams = httpParams.append('f_LUsr_name', params.f_LUsr_name);
    if (params.f__CTm) httpParams = httpParams.append('f__CTm', params.f__CTm.toISOString());
    if (params.f__LTm) httpParams = httpParams.append('f__LTm', params.f__LTm.toISOString());
    if (params.f_SPrc !== undefined) httpParams = httpParams.append('f_SPrc', params.f_SPrc.toString());
    if (params._Sort) httpParams = httpParams.append('_Sort', params._Sort);
    if (params._pageSize !== undefined) httpParams = httpParams.append('_pageSize', params._pageSize.toString());
    if (params._pageIndex !== undefined) httpParams = httpParams.append('_pageIndex', params._pageIndex.toString());
  
    return this._HttpClient.get(`${environments.baseURL}/api/Headers/GetAllHeadersFiltered`, {
      params: httpParams
    });
  }


  AddNewHeaders(newHeader:any):Observable<any>{
    return this._HttpClient.post(`${environments.baseURL}/api/Headers/AddNewHeader` , newHeader)
  }

  GetHeaderValue(StrCd:string , TrsTy:number ,TrsNo:number ):Observable<any>{
    return this._HttpClient.get(`${environments.baseURL}/api/Headers/GetHeaderValue/${StrCd}/${TrsTy}/${TrsNo}`)
  }


  GetHeadersData_Report(body: any): Observable<Blob> {
    return this._HttpClient.post(
     `${environments.baseURL}/api/Reports/ClientCheckUp-report`,
      body,
      { responseType: 'blob' }
    );
  }

  ExcelReport_GetHeadersData_Report(body: any): Observable<Blob> {
    return this._HttpClient.post(
     `${environments.baseURL}/api/ExcelReport/ExcelRep-ClientCheckUp-report`,
      body,
      { responseType: 'blob' }
    );
  }


getMaxHeadersTrsNo(body:any):Observable<any>{
  return this._HttpClient.post(
    `${environments.baseURL}/api/Headers/GetMaxHeaderTrsno`,
    body);
}

}
