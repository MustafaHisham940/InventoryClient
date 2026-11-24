import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from './environment/environments';
import { IVDtlsspecsFilter } from './interfaces/ivDtls';
import { DeleteAllHeadersObj } from './interfaces/HdrData';

@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {

  constructor(private http: HttpClient) {}


  getAllDetailsFiltered(inputSpecs: any): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DetailsContoller/GetAllDetailsFitered`, inputSpecs);
  }
  
  
  /**
   * Searches the lines of ONE document. Body: _StrCd + _TrsTy + _TrsNo (the document), the criteria _LnNo (line number),
   * _ItmCd (item code) and _Qty (quantity), _Sort = 'qty_asc' | 'qty_desc' (by quantity; empty = by line number), paging.
   */
  searchDetails(filter: any): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DetailsContoller/SearchDetails`, filter);
  }


  AddNewDetails(inputSpecs: any): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DetailsContoller/AddNewDetails`, inputSpecs);
  }
  

  EditeDetailsData(updateData:any,StrCd:string , TrsTy:number ,TrsNo:number ,LnNo:number ):Observable<any>{
    
    return this.http.patch<any>(`${environments.baseURL}/api/DetailsContoller/updateDeatilsNewTech/${StrCd}/${TrsTy}/${TrsNo}/${LnNo}` , updateData);
  }

  EditeHeadersData(updateData:any,StrCd:string , TrsTy:number ,TrsNo:number  ):Observable<any>{

    return this.http.patch<any>(`${environments.baseURL}/api/Headers/UpdateHeader/${StrCd}/${TrsTy}/${TrsNo}` , updateData);
  }

  // For headers with no related store (StrCd is null), e.g. ClientPayments.
  EditeHeadersDataNoStore(updateData:any , TrsTy:number ,TrsNo:number  ):Observable<any>{

    return this.http.patch<any>(`${environments.baseURL}/api/Headers/UpdateHeaderNoStore/${TrsTy}/${TrsNo}` , updateData);
  }

  DeleteHeaderData(StrCd:string , TrsTy:number ,TrsNo:number  ):Observable<any>{
    
    return this.http.delete<any>(`${environments.baseURL}/api/Headers/DeleteHeaders/${StrCd}/${TrsTy}/${TrsNo}`);
  }

  DeleteDetailsdata(StrCd:string , TrsTy:number ,TrsNo:number ,LnNo:number  ):Observable<any>{
    
    return this.http.delete<any>(`${environments.baseURL}/api/DetailsContoller/DeleteDetails/${StrCd}/${TrsTy}/${TrsNo}/${LnNo}`);
  }


  getMaxDtlsLno(data: any): Observable<any> {
    return this.http.post<number>(
      `${environments.baseURL}/api/DetailsContoller/GetMaxDtlsLno`,
      data
    );
  }



  deleteHeadersParallel(data: any ): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DeleteHeaders/DeleteHeadersParallel`
      ,  data );
  }

  

  deleteHeadersParallels(data: any) {
    return this.http.post<any>(`${environments.baseURL}/api/DeleteHeaders/DeleteHeadersParallel`, data);
  }
}
